export PROJECT_ID="$(gcloud config get-value project -q)"

kubectl delete service web-app-server

# gcloud container clusters delete my-cluster

gcloud container images delete gcr.io/$PROJECT_ID/exchange-server:v1
kubectl delete deployment web-app-server

docker image rm gcr.io/$PROJECT_ID/exchange-server:v1
docker image rm python:3.7