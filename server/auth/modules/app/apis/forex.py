from flask import Flask, render_template, request, jsonify
import plotly.graph_objs as go
from plotly.utils import PlotlyJSONEncoder
import json
import requests
import requests_cache
import os
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson.objectid import ObjectId
from app import app, mongo
import logger
from app.schemas import validate_code
ROOT_PATH = os.environ.get('ROOT_PATH')
LOG = logger.get_root_logger(
    __name__, filename=os.path.join(ROOT_PATH, 'output.log'))

requests_cache.install_cache(
    'exchange_api_cache', backend='sqlite', expire_after=36000)

app.config.from_object('config')
app.config.from_pyfile('config.py')

symbol_url = 'https://forex.1forge.com/1.0.3/symbols?api_key={key}'
convert_url = 'https://forex.1forge.com/1.0.3/convert?from={fromCurrency}&to={toCurrency}&quantity={qty}&api_key={key}'
quotes_url = 'https://forex.1forge.com/1.0.3/quotes?pairs={pairs}&api_key={key}'
history_url = 'http://apilayer.net/api/historical?access_key={key}&date={date}&currencies={currency}'
quote_url = 'https://api.exchangeratesapi.io/latest?base={base}'
history_time_url = 'https://api.exchangeratesapi.io/history?start_at={start}&end_at={end}&symbols={symbols}&base={base}'
market_url = 'https://forex.1forge.com/1.0.3/market_status?api_key={key}'
MY_API_KEY_FOREX = os.environ.get('MY_API_KEY_FOREX')
MY_API_KEY_HIST = os.environ.get('MY_API_KEY_HIST')


@app.route('/exchange', methods=['GET'])
def convert():
    fromCurrency = request.args.get('from')
    toCurrency = request.args.get('to')
    qty = request.args.get('qty')
    c = mongo.db.data.find_one({'Code': fromCurrency}, {"_id": 0})
    t = mongo.db.data.find_one({'Code': toCurrency}, {"_id": 0})
    url = convert_url.format(
        fromCurrency=fromCurrency, toCurrency=toCurrency, qty=qty, key=MY_API_KEY_FOREX)
    resp = requests.get(url)
    if resp.ok:
        murl = market_url.format(key=MY_API_KEY_FOREX)
        status = requests.get(murl)
        status = status.json()

        response = resp.json()
        response = {**response, **status,
                    ** {'from Country': c}, **{'to Country info': t}}
        return jsonify(response)
    else:
        return (resp.reason)


@app.route('/symbol', methods=['GET'])
def symbol():

    url = symbol_url.format(key=MY_API_KEY_FOREX)
    print(url)
    resp = requests.get(url)
    if resp.ok:
        response = resp.json()
        return jsonify(response)
    else:
        return (resp.reason)


@app.route('/status', methods=['GET'])
def market_status():

    url = market_url.format(key=MY_API_KEY_FOREX)
    resp = requests.get(url)
    if resp.ok:
        response = resp.json()
        return jsonify(response)
    else:
        return (resp.reason)


@app.route('/quotes', methods=['GET'])
def quotes():
    pairs = request.args.get('pairs')

    url = quotes_url.format(
        pairs=pairs, key=MY_API_KEY_FOREX)
    print(url)
    resp = requests.get(url)
    if resp.ok:
        response = resp.json()

        return jsonify(response)
    else:
        return (resp.reason)


@app.route('/quotebase', methods=['GET'])
def quoteBase():
    base = request.args.get('base')

    url = quote_url.format(
        base=base, key=MY_API_KEY_FOREX)
    resp = requests.get(url)
    if resp.ok:
        response = resp.json()
        return jsonify(response)
    else:
        return (resp.reason)


@app.route('/history', methods=['GET'])
def history():
    date = request.args.get('date')
    currency = request.args.get('currency')

    url = quotes_url.format(
        date=date, currency=currency, key=MY_API_KEY_HIST)
    print(url)
    resp = requests.get(url)
    if resp.ok:
        response = resp.json()
        return jsonify(response)
    else:
        return (resp.reason)


@app.route('/histCurrency', methods=['GET'])
def historical_data():
    start = request.args.get('start')
    end = request.args.get('end')
    base = request.args.get('base')
    symbols = request.args.get('currency')

    url = history_time_url.format(
        start=start, end=end, base=base, symbols=symbols, key=MY_API_KEY_HIST)
    LOG.debug(url)
    resp = requests.get(url)
    if resp.ok:
        response = resp.json()
        return jsonify(response)
    else:
        return (resp.reason)


@app.route('/entryCode', methods=['POST'])
def entry_code():
    ''' create or add new code '''
    data = validate_code(request.get_json())
    if data['ok']:
        data = data['data']

        c = mongo.db.data.find_one({'Country': data['Country']}, {"_id": 0})
        # LOG.debug(user)
        if bool(c):
            return jsonify({'ok': False, 'message': 'Code already exist with same Country name'}), 400
        else:
            mongo.db.data.insert_one(data)

            # LOG.debug(data)
            return jsonify({'ok': True, 'data': data, 'message': 'User created successfully!'}), 200
    else:
        return jsonify({'ok': False, 'message': 'Bad request parameters: {}'.format(data['message'])}), 400


@app.route('/code', methods=['GET', 'DELETE', 'PATCH'])
@jwt_required
def code():
    ''' route read user '''
    if request.method == 'GET':
        query = request.args
        LOG.debug(query)
        data = mongo.db.users.find_one({'email': query['email']}, {"_id": 0})
        if bool(data):
            user = {}
            # for i in data:
            user['name'] = data['name']
            user['email'] = data['email']
            # data = list(mongo.db.users.find())
        # data = {'data': data}
            LOG.debug(data)

            return jsonify({'ok': True, 'data': user}), 200
        else:
            return jsonify({'ok': False, 'message': 'No user exist with this mail'}), 400

    data = request.get_json()
    if request.method == 'DELETE':
        if data.get('email', None) is not None:
            db_response = mongo.db.users.delete_one({'email': data['email']})
            if db_response.deleted_count == 1:
                response = {'ok': True, 'message': 'record deleted'}
            else:
                response = {'ok': True, 'message': 'no record found'}
            return jsonify(response), 200
        else:
            return jsonify({'ok': False, 'message': 'Bad request parameters!'}), 400

    if request.method == 'PATCH':
        # if data.get('query', {}) != {}:
        data = request.get_json()

        user = mongo.db.users.find_one({'email': data['email']}, {"_id": 0})

        if 'password' in data.keys() and 'name' in data.keys():
            data['password'] = flask_bcrypt.generate_password_hash(
                data['password'])
            newvalues = {"$set": {"name": data['name'],
                                  "password": data['password']}}
        else:
            if 'password' in data.keys():
                data['password'] = flask_bcrypt.generate_password_hash(
                    data['password'])
                newvalues = {"$set": {"password": data['password']}}
            if 'name' in data.keys():
                newvalues = {"$set": {"name": data['name']}}

        if bool(user):
            mongo.db.users.update_one(user, newvalues)
            return jsonify({'ok': True, 'message': 'User updated successfully!'}), 200
        else:
            response = {'ok': True, 'message': 'no record found'}
            return jsonify(response)
    else:
        return jsonify({'ok': False, 'message': 'Bad request parameters: {}'.format(data['message'])}), 400
