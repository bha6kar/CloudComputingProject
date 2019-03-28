''' flask app with mongo '''
import os
import json
import datetime
from bson.objectid import ObjectId
from flask import Flask
from flask_pymongo import PyMongo
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
from pymongo import MongoClient
from Crypto.PublicKey import RSA


class JSONEncoder(json.JSONEncoder):
    ''' extend json-encoder class'''

    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        if isinstance(o, set):
            return list(o)
        if isinstance(o, datetime.datetime):
            return str(o)
        return json.JSONEncoder.default(self, o)


# create the flask object
app = Flask(__name__)

app.config.from_object('config')
app.config.from_pyfile('config.py')

RSA_PUBLIC = RSA.import_key(open("key/pub.pem", "r").read())
RSA_PRIVATE = RSA.import_key(open("key/prv.pem").read(), passphrase='secret')
# app.config['MONGO_URI'] = 'mongodb+srv://admin:bhaskar123@cluster0-ydzee.gcp.mongodb.net/'
app.config['JWT_SECRET_KEY'] = app.config['SECRET_KEY']
app.config['JWT_PUBLIC_KEY'] = RSA_PUBLIC
app.config['JWT_PRIVATE_KEY'] = RSA_PRIVATE
# app.config['JWT_ALGORITHM'] = 'RS512'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = datetime.timedelta(days=1)
# mongo = PyMongo(app)
flask_bcrypt = Bcrypt(app)
jwt = JWTManager(app)
app.json_encoder = JSONEncoder

from app.apis import *
from app.controllers import *  # eslint: disable=W0401,C0413
