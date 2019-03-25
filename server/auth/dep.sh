export PROJECT_ID="$(gcloud config get-value project -q)"
gcloud config set project $PROJECT_ID
gcloud config set compute/zone us-central1-b
