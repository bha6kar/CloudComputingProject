gcloud config set project 
gcloud config set compute/zone us-central1-b
export PROJECT_ID="$(gcloud config get-value project -q)"