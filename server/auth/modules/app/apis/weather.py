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

ROOT_PATH = os.environ.get('ROOT_PATH')
LOG = logger.get_root_logger(
    __name__, filename=os.path.join(ROOT_PATH, 'output.log'))


requests_cache.install_cache(
    'weather_api_cache', backend='sqlite', expire_after=36000)

wather_url = 'http://samples.openweathermap.org/data/2.5/weather?q=London&appid=b6907d289e10d714a6e88b30761fae22'
wather_url_apixu = 'http://api.apixu.com/v1/current.json?key={api_key}&q={city}&lang={language}'
weather_url_forecast = 'http://api.apixu.com/v1/forecast.json?key={api_key}&q={city}&days={days}&lang={language}'


@app.route('/weatherCity',  methods=['GET'])
@jwt_required
def weatherCity():

    respons = requests.get(wather_url)

    if respons.ok:
        weather = respons.json()
        return jsonify(weather)
    else:
        print(respons.reason)


@app.route('/cityWeather',  methods=['GET'])
@jwt_required
def weather():

    city = request.args.get('city')
    language = request.args.get('language')
    api_key = request.args.get('api_key', '0a90bd51afe74d5889a03447192003')

    weather_url = wather_url_apixu.format(
        api_key=api_key, city=city, language=language)
    respons = requests.get(weather_url)

    if respons.ok:
        weather = respons.json()
        return jsonify(weather)
    else:
        print(respons.reason)


@app.route('/forecast',  methods=['GET'])
@jwt_required
def weatherForecast():

    city = request.args.get('city')
    language = request.args.get('language')
    day = request.args.get('days')
    api_key = request.args.get('api_key', '0a90bd51afe74d5889a03447192003')

    weather_url = weather_url_forecast.format(
        api_key=api_key, city=city, language=language, days=day)
    respons = requests.get(weather_url)

    if respons.ok:
        weather = respons.json()
        return jsonify(weather)
    else:
        print(respons.reason)
