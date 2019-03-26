mkdir ssl_cert
cd ssl_cert
openssl genrsa -out prv.key 2048
openssl req -new -key prv.key -out pub.csr

openssl x509 -req -days 365 -in pub.csr -signkey prv.key -out cloudcomputing.crt

gcloud compute ssl-certificates create cloudcomputing \
    --certificate cloudcomputing.crt \
    --private-key prv.key