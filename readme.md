[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://travis-ci.org/joemccann/dillinger)

#  Mini Project for Cloud computing (ECS 781P)
* #### Name : Bhaskar Jyoti Saikia
* #### Student Id : 180034550



# Introduction
In this project I have build a Foreign exchange currency application with user login & live update of the data. I have used react as front-end JavaScript library & MongoDB as database and server side in Python using JWt token.

### Server Side
> **Deployment:** In **Google Cloud Platform**  deployed with **Kubernetes**  with Load balancing of 3 clusters

```sh
http://104.154.145.98
```

* Python 
* Nodejs

### Client Side
> **Deployment:** In **AWS Cloud** 
```sh
http://s3.console.aws.amazon.com/s3/buckets/cloudcomputingclient/?region=eu-west-1&tab=properties
```
* Reactjs
* Nodejs

### Database
> **MONGO DB** deployed with Load balancing of 4 clusters in mongo DB cloud Atlas
```sh
https://www.mongodb.com/cloud/atlas
```

# Features!
For converting money from one currency to another, we need to find the exchange rate between that currencies.

Mostly exchange rates are fluctuating in daily basis. Here I am using 3 API online service for finding exchange rates and historical data

* [Forex forge1 API](https://forex.1forge.com)
* [European Central bank API](https://exchangeratesapi.io)
* [Currency Layer API](https://currencylayer.com/documentation)

I am also showing the weather forecast with the country code currency fetched.I am using 2 APIs here, API used here are:

* [Open weather Map](https://openweathermap.org)
* [APIXU API](https://www.apixu.com)

#### Authentication
In app I am using JWT authentication **Bearer Token** while login. I am using Flask-JWT-Extended module which internally uses PyJWT. In this authentication these steps involved :
- Integrating Flask-JWT-Extended module with flask server.
- Using jsonschema to validate the API request object.
- Creating user registration & authentication route.

I am using Jwt RS512 algorithm for tokenization. The keys can be found in the server/key folder. I have made the shell script to generate the key, it can be found in jwtRS512.sh :

```sh 
$ openssl genrsa -aes128 -out prv.pem 4096
$ openssl rsa -in prv.pem -pubout -out pub.pem
```

#### You can see more features about the API here :


| API | LINK |
| ------ | ------ |
| Users Authentication | https://documenter.getpostman.com/view/2252854/S17tR8PJ |
| Currency | https://documenter.getpostman.com/view/2252854/S17tR8PH |
| Weather | https://documenter.getpostman.com/view/2252854/S17tR8Tb |




And to run the project I amincluding the steps here: 
 on GitHub.

## Installation

It requires [Docker](https://www.docker.com)  to run.



By default, the Docker will expose port 8080, so change this within the Dockerfile if necessary. When ready, simply use the Dockerfile to build the image.

```sh
cd server/auth
docker build -t server-app .
```
This will create the server-app image and pull in the necessary dependencies.

Once done, run the Docker image and map the port to whatever you wish on your host. In this example, we simply map port 8000 of the host to port 8080 of the Docker (or whatever port was exposed in the Dockerfile):

```sh
docker run --rm -p 8080:8080 server-app
```

Verify the deployment by navigating to your server address in your preferred browser.

```sh
127.0.0.1:8000
```

#### Kubernetes + Google Cloud

See [KUBERNETES.md](https://github.com/joemccann/dillinger/blob/master/KUBERNETES.md)

To make the deployment in the Google CLoud with Kubernetes use the shell script deployGcloud.sh

```sh
$ sh server/deployGcloud.sh 
```
This will dploy the server app in gcloud with Kubernetes 3 clusters load balancing. If anything goes wrong the delete script can also be found & run:
```sh
$ sh server/deleteGcloud.sh 
```

License
----

#### QMUL

If you like it :
<style>.bmc-button img{width: 27px !important;margin-bottom: 1px !important;box-shadow: none !important;border: none !important;vertical-align: middle !important;}.bmc-button{line-height: 36px !important;height:37px !important;text-decoration: none !important;display:inline-flex !important;color:#ffffff !important;background-color:#000000 !important;border-radius: 3px !important;border: 1px solid transparent !important;padding: 1px 9px !important;font-size: 22px !important;letter-spacing: 0.6px !important;box-shadow: 0px 1px 2px rgba(190, 190, 190, 0.5) !important;-webkit-box-shadow: 0px 1px 2px 2px rgba(190, 190, 190, 0.5) !important;margin: 0 auto !important;font-family:'Cookie', cursive !important;-webkit-box-sizing: border-box !important;box-sizing: border-box !important;-o-transition: 0.3s all linear !important;-webkit-transition: 0.3s all linear !important;-moz-transition: 0.3s all linear !important;-ms-transition: 0.3s all linear !important;transition: 0.3s all linear !important;}.bmc-button:hover, .bmc-button:active, .bmc-button:focus {-webkit-box-shadow: 0px 1px 2px 2px rgba(190, 190, 190, 0.5) !important;text-decoration: none !important;box-shadow: 0px 1px 2px 2px rgba(190, 190, 190, 0.5) !important;opacity: 0.85 !important;color:#ffffff !important;}</style><link href="https://fonts.googleapis.com/css?family=Cookie" rel="stylesheet"><a class="bmc-button" target="_blank" href="https://www.buymeacoffee.com/Bhaskar"><img src="https://www.buymeacoffee.com/assets/img/BMC-btn-logo.svg" alt="Buy me a coffee"><span style="margin-left:5px">Buy me a coffee</span></a>
