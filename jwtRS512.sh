openssl genrsa -aes128 -out cert.key 4096
openssl rsa -in cert.key -pubout -out cert.pub
cat cert.key
cat cert.pub