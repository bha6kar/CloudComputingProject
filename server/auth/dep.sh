export PROJECT_ID="$(gcloud config get-value project -q)"
gcloud config set project $PROJECT_ID
gcloud config set compute/zone us-central1-b

docker build -t gcr.io/${PROJECT_ID}/exchange-server:v1 .
gcloud auth configure-docker -yes
docker push gcr.io/${PROJECT_ID}/exchange-server:v1

kubectl run web-app-server --image=gcr.io/${PROJECT_ID}/exchange-server:v1 --port 8080

kubectl expose deployment web-app-server --type=LoadBalancer --port 80 --target-port 8080