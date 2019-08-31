''' controller and routes for users '''
import os
from flask import request, jsonify
from flask_jwt_extended import (create_access_token, create_refresh_token,
                                jwt_required, jwt_refresh_token_required, get_jwt_identity)
from app import app, flask_bcrypt, jwt
from app.schemas import validate_user
import logger
from urllib.parse import parse_qs
import pymongo

# ROOT_PATH = '.:/usr/src/app'
# LOG = logger.get_root_logger(
#     __name__, filename=os.path.join(ROOT_PATH, 'output.log'))

mongo_client = pymongo.MongoClient(
    'mongodb+srv://bhaskar:bhaskar123@cluster0-ydzee.gcp.mongodb.net/', maxPoolSize=50, connect=False)
db = pymongo.database.Database(mongo_client, 'bhaskarDB')
print(mongo_client)


@jwt.unauthorized_loader
def unauthorized_response(callback):
    return jsonify({
        'ok': False,
        'message': 'Missing Authorization Header'
    }), 401


@app.route('/auth', methods=['POST'])
def auth_user():
    ''' auth endpoint '''
    data = validate_user(request.get_json())
    if data['ok']:
        data = data['data']
        user = db.users.find_one({'email': data['email']}, {"_id": 0})
        if user and flask_bcrypt.check_password_hash(user['password'], data['password']):
            del user['password']
            access_token = create_access_token(identity=data)
            refresh_token = create_refresh_token(identity=data)
            user['token'] = access_token
            user['refresh'] = refresh_token
            return jsonify({'ok': True, 'data': user}), 200
        else:
            return jsonify({'ok': False, 'message': 'invalid username or password'}), 401
    else:
        return jsonify({'ok': False, 'message': 'Bad request parameters: {}'.format(data['message'])}), 400


@app.route('/login', methods=['POST'])
def login():
    ''' auth endpoint '''
    header_data = parse_qs(request)
    print(request)
    data = validate_user(header_data)
    if data['ok']:
        data = data['data']

        user = db.users.find_one({'email': data['email']}, {"_id": 0})
        if user and flask_bcrypt.check_password_hash(user['password'], data['password']):
            del user['password']
            access_token = create_access_token(identity=data)
            refresh_token = create_refresh_token(identity=data)
            user['token'] = access_token
            user['refresh'] = refresh_token
            return jsonify({'ok': True, 'data': user}), 200
        else:
            return jsonify({'ok': False, 'message': 'invalid username or password'}), 401
    else:
        return jsonify({'ok': False, 'message': 'Bad request parameters: {}'.format(data['message'])}), 400


@app.route('/register', methods=['POST'])
def register():
    ''' register user endpoint '''
    data = validate_user(request.get_json())
    if data['ok']:
        data = data['data']
        password = data['password']
        data['password'] = flask_bcrypt.generate_password_hash(
            data['password'])
        user = db.users.find_one({'email': data['email']}, {"_id": 0})
        # LOG.debug(user)
        if bool(user):
            return jsonify({'ok': False, 'message': 'User already exist with same email'}), 400
        else:
            db.users.insert_one(data)
            user = {}
            user['name'] = data['name']
            del data['name']
            del data['_id']
            data['password'] = password
            access_token = create_access_token(identity=data)
            refresh_token = create_refresh_token(identity=data)
            data['token'] = access_token
            data['refresh'] = refresh_token
            del data['password']
            data['name'] = user['name']
            # LOG.debug(data)
            return jsonify({'ok': True, 'data': data, 'message': 'User created successfully!'}), 200
    else:
        return jsonify({'ok': False, 'message': 'Bad request parameters: {}'.format(data['message'])}), 400


@app.route('/refresh', methods=['POST'])
@jwt_refresh_token_required
def refresh():
    ''' refresh token endpoint '''
    current_user = get_jwt_identity()
    ret = {
        'token': create_access_token(identity=current_user)
    }
    return jsonify({'ok': True, 'data': ret}), 200


@app.route('/user', methods=['GET', 'DELETE', 'PATCH'])
@jwt_required
def user():
    ''' route read user '''
    if request.method == 'GET':
        query = request.args
        data = db.users.find_one({'email': query['email']}, {"_id": 0})
        if bool(data):
            user = {}
            # for i in data:
            user['name'] = data['name']
            user['email'] = data['email']
            # data = list(db.users.find())
        # data = {'data': data}

            return jsonify({'ok': True, 'data': user}), 200
        else:
            return jsonify({'ok': False, 'message': 'No user exist with this mail'}), 400

    data = request.get_json()
    if request.method == 'DELETE':
        if data.get('email', None) is not None:
            db_response = db.users.delete_one({'email': data['email']})
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

        user = db.users.find_one({'email': data['email']}, {"_id": 0})

        if 'password' in data.keys() and 'name' in data.keys():
            data['password'] = flask_bcrypt.generate_password_hash(
                data['password'])
            newvalues = {
                "$set": {"name": data['name'], "password": data['password']}}
        else:
            if 'password' in data.keys():
                data['password'] = flask_bcrypt.generate_password_hash(
                    data['password'])
                newvalues = {"$set": {"password": data['password']}}
            if 'name' in data.keys():
                newvalues = {"$set": {"name": data['name']}}

        if bool(user):
            db.users.update_one(user, newvalues)
            return jsonify({'ok': True, 'message': 'User updated successfully!'}), 200
        else:
            response = {'ok': True, 'message': 'no record found'}
            return jsonify(response)
    else:
        return jsonify({'ok': False, 'message': 'Bad request parameters: {}'.format(data['message'])}), 400
