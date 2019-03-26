
kubectl delete service web-app-server
gcloud container images delete gcr.io/cloudcomputing-235600/exchange-server:v1
kubectl delete deployment web-app-server

docker image rm gcr.io/cloudcomputing-235600/exchange-server:v1
