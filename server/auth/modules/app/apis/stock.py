from flask import Flask, request
import json
import requests
import requests_cache
import os
from app import app, mongo

requests_cache.install_cache(
    'dicyionary_api_cache', backend='sqlite', expire_after=36000)


stock_url = 'https://financialmodelingprep.com/api/financials/income-statement/{stock}'


@app.route('/stockdata', methods=['GET'])
def stockIncome():

    stock = request.args.get('stock')
    url = stock_url.format(
        stock=stock)
    respons = requests.get(url)
    if respons.ok:
        weather = respons.content
        return (weather)
    else:
        print(respons.reason)


if __name__ == '__main__':
    app.run(debug=True)
