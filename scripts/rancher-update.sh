#!/bin/bash

show_help() {
    echo "Usage: docker_publish.sh"
    echo ""
    echo "--access_key rancher access key"
    echo "--secret_key rancher secret key"
    echo "--url rancher_url"
    echo "--environment_name service name to replace in rancher"
    echo "--image image to gater and load in the service, example:  docker:alfresco/demo-shell:latest"
}

access_key(){
 ACCESSKEY=$1
}

secret_key(){
 SECRETKEY=$1
}

url(){
 RANCHERURL=$1
}

environment_name(){
 ENVIRONMENTNAME=$1
}

image_name(){
 IMAGE=$1
}

while [[ $1 == -* ]]; do
    case "$1" in
      -h|--help|-\?) show_help; exit 0;;
      --access_key)  access_key $2; shift 2;;
      --secret_key)  secret_key $2; shift 2;;
      --url)  url $2; shift 2;;
      --environment_name)  environment_name $2; shift 2;;
      --image)  image_name $2; shift 2;;
      -*) echo "invalid option: $1" 1>&2; show_help; exit 1;;
    esac
done

docker pull etlweather/gaucho:alpine

docker=$(which docker)

echo "getting the  id"

ENVIRONMENTID=$($docker run --rm -e CATTLE_ACCESS_KEY=$ACCESSKEY \
                    -e CATTLE_SECRET_KEY=$SECRETKEY \
                    -e CATTLE_URL=$RANCHERURL  \
                    etlweather/gaucho:alpine id_of $ENVIRONMENTNAME)

echo "id retrieved! is ${environment_id}"

$docker run --rm -e CATTLE_ACCESS_KEY=$ACCESSKEY \
                 -e CATTLE_SECRET_KEY=$SECRETKEY \
                 -e CATTLE_URL=$RANCHERURL  \
                 etlweather/gaucho:alpine upgrade $ENVIRONMENTID --imageUuid $IMAGE --auto_complete true --timeout 600
