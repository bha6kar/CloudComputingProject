

#  Mini Project for Cloud computing (ECS 781P)
* #### Name : Bhaskar Jyoti Saikia
* #### Student Id : 180034550
* http://mrbhaskar.com


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

> **NOTE:** I have made the authentication in React JS and Node Js as well along with python, which can be found in **server/authJS** with which we can make a micro service and call them in any API for security check. But both(Python JWT authentication and REactJS authentication) are doing the same work and providing the same level of security. But the ReactJS one has more flexibility in terms of CORS and have more control on authentication. So, I made that and implemented that as well and deployed that as well in AWS cloud. But for 1 server-app deployment in gcloud  I used the python authentication. 


I am using Jwt RS512 algorithm for tokenization in both. The keys can be found in the server/key folder. I have made the shell script to generate the key, it can be found in jwtRS512.sh :

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
#### Authentication in React JS
To install all the dependencies:

```sh
yarn install
```
It will installl the required dependenies to run the server-app.
To run the app:

```sh 
yarn start
```
It will start the app.

To build the production app for deployment. We can run :
```sh
yarn build
```
It will generate the necessary files for deployment in the dist folder.
>**NOTE:** I am using webpack and babel for distribution or deployment folder. And instead of yarn you can use **npm**, but **yarn** is better as it provides the locking system.

#### Kubernetes + Google Cloud

See [KUBERNETES.md](https://github.com/joemccann/dillinger/blob/master/KUBERNETES.md)

I generated the Kubernetes scripts as well using kompose the library provided by the Kubernetes, command for that is:

```sh
kompose convert
```
It generates loadbalancer files deployment and service yaml file. And to run it we can  do the following:

```sh
kompose up
``` 
this will deploy the app and we can debug

To make the deployment in the Google CLoud with Kubernetes I made the script, you can use the shell script deployGcloud.sh


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

<a href="https://www.buymeacoffee.com/Bhaskar" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/black_img.png" alt="Buy Me A Coffee" style="height: auto !important;width: auto !important;" ></a>