export PROJECT_ID="$(gcloud config get-value project -q)"
gcloud config set project 
gcloud config set compute/zone us-central1-b

docker build -t gcr.io/${PROJECT_ID}/exchange-server:v1 .
gcloud auth configure-docker
docker push gcr.io/${PROJECT_ID}/exchange-server:v1
docker run --rm -p 8080:8080 gcr.io/${PROJECT_ID}/exchange-server:v1
gcloud container clusters create hello-cluster --num-nodes=3
kubectl run hello-web --image=gcr.io/${PROJECT_ID}/exchange-server:v1 --port 8080
kubectl get pods
kubectl expose deployment hello-web --type=LoadBalancer --port 80 --target-port 8080
kubectl get service


gcloud container images delete gcr.io/cloud2019/exchange-server:v1

kubectl expose deployment web-dev --type=LoadBalancer --name=web-dev

kubectl expose deployment mongodb --type=LoadBalancer --name=mongodb

gcloud container images list-tags gcr.io/cloudcomputing-235600/exchange-server --filter='-tags:*'  --format='get(digest)' --limit=unlimited

gcloud container images delete --quiet gcr.io/cloudcomputing-235600/exchange-server@sha256:78e61f6b8e0dce572f7472589ad2e4317d3c2286bc5469f231bb4561e8012aaf

gcloud container images delete gcr.io/cloudcomputing-235600/exchange-server:v1