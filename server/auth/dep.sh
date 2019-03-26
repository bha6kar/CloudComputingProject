export PROJECT_ID="$(gcloud config get-value project -q)"
gcloud config set project $PROJECT_ID
gcloud config set compute/zone us-central1-b

docker build -t gcr.io/${PROJECT_ID}/exchange-server:v1 .
gcloud auth configure-docker
docker push gcr.io/${PROJECT_ID}/exchange-server:v1