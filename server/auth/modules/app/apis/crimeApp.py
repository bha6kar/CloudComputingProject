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
    'crimes_api_cache', backend='sqlite', expire_after=36000)

crime_url_template = 'https://data.police.uk/api/crimes-street/all-crime?lat={lat}&lng={lng}&date={date}'
categories_url_template = 'https://data.police.uk/api/crime-categories?date={date}'


@app.route('/crimestat',  methods=['GET'])
@jwt_required
def crimechart():
    my_latitude = request.args.get('lat', '51.52369')
    my_longitude = request.args.get('lng', '-0.0395857')
    my_date = request.args.get('date', '2018-11')

    # compute  crime_category_stats
    crime_url = crime_url_template.format(
        lat=my_latitude, lng=my_longitude, date=my_date)

    respons = requests.get(crime_url)

    if respons.ok:
        crimes = respons.json()
    else:
        print(respons.reason)

    resp = requests.get(categories_url_template.format(date=my_date))
    if resp.ok:
        categories_json = resp.json()
    else:
        print(resp.reasone)

    categories = {categ["url"]: categ["name"] for categ in categories_json}
    crime_category_stats = dict.fromkeys(categories.keys(), 0)
    crime_category_stats.pop("all-crime")

    for crime in crimes:
        crime_category_stats[crime["category"]] += 1

    # compute crime_outcome_stats
    crime_outcome_stats = {'None': 0}

    for crime in crimes:
        outcome = crime["outcome_status"]
        if not outcome:
            crime_outcome_stats['None'] += 1
        elif outcome['category'] not in crime_outcome_stats.keys():
            crime_outcome_stats.update({outcome['category']: 1})
        else:
            crime_outcome_stats[outcome['category']] += 1

    graphs = [
        dict(
            data=[
                dict(
                    values=list(crime_category_stats.values()),
                    labels=list(crime_category_stats.keys()),
                    hole=.4,
                    type='pie',
                    name='Category'
                ),
            ],
            layout=dict(
                title='Crime Categoty Stats During {}'.format(my_date)
            )
        ),
        dict(
            data=[
                dict(
                    values=list(crime_outcome_stats.values()),
                    labels=list(crime_outcome_stats.keys()),
                    hole=.4,
                    type='pie',
                    name='Outcome'
                ),
            ],
            layout=dict(
                title='Crime Outcome Stats During {}'.format(my_date)
            )
        ),
    ]

    ids = ['graph-{}'.format(i) for i, _ in enumerate(graphs)]

    graphJSON = json.dumps(graphs, cls=PlotlyJSONEncoder)
    return render_template('plotholder.html', ids=ids, graphJSON=graphJSON)


if __name__ == "__main__":
    app.run(port=8080, debug=True)
