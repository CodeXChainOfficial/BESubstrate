#!/bin/sh

ssh -o StrictHostKeyChecking=no ubuntu@$STAGING_SERVER << 'ENDSSH'
  cd /home/ubuntu/staging/xnames-service-stg
  aws ecr get-login-password --region eu-west-2 | docker login --username AWS --password-stdin 782057639577.dkr.ecr.eu-west-2.amazonaws.com  
  aws --version
  docker info
  docker --version
  docker pull 782057639577.dkr.ecr.eu-west-2.amazonaws.com/xnames-service-stg:latest
  docker rm -f xnames-service-stg
  docker run -itd --name xnames-service-stg -p 4000:4000 -p 3001:3000 -p 5201:5201 -p 5202:5202 -p 8000:8000  782057639577.dkr.ecr.eu-west-2.amazonaws.com/xnames-service-stg:latest
ENDSSH
