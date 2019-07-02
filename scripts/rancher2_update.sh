#!/bin/bash

curl -LO https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl
chmod +x ./kubectl
sudo mv ./kubectl /usr/local/bin/kubectl

show_help() {
    echo "Usage: kube-cli.sh"
    echo ""
    echo "--cluster_name cluster name to update in rancher"
    echo "--rancher_user rancher username"
    echo "--rancher_token token for rancher user to access services"
    echo "--deployment_name name of the deployed service"
    echo "--deployed_app_name name of deployed app"
    echo "--env_url environment url for cluster in rancher"
    echo "--image_url image url from repo to be pulled, example:  docker:alfresco/alfresco-modeling-app:development"

}

cluster_name(){
 CLUSTER_NAME=$1
}

rancher_user(){
 RANCHER_USER=$1
}

rancher_token(){
 RANCHER_TOKEN=$1
}

deployment_name(){
DEPLOYMENT_NAME=$1
}

deployed_app_name(){
DEPLOYED_APP_NAME=$1
}

env_url(){
ENV_URL=$1
}

image_url(){
 IMAGE_URL=$1
}

while [[ $1 == -* ]]; do
    case "$1" in
      -h|--help|-\?) show_help; exit 0;;
      --cluster_name)  cluster_name $2; shift 2;;
      --env_url)  env_url $2; shift 2;;
      --rancher_user)  rancher_user $2; shift 2;;
      --rancher_token)  rancher_token $2; shift 2;;
      --deployment_name)  deployment_name $2; shift 2;;
      --deployed_app_name)  deployed_app_name $2; shift 2;;
      --image_url)  image_url $2; shift 2;;
      -*) echo "invalid option: $1" 1>&2; show_help; exit 1;;
    esac
done

kubectl config set-cluster ${CLUSTER_NAME} --server=${ENV_URL}
kubectl config set-credentials ${RANCHER_USER} --token=${RANCHER_TOKEN}
kubectl config set-context ${CLUSTER_NAME} --cluster=${CLUSTER_NAME} --user=${RANCHER_USER}
echo kubectl config set-context ${CLUSTER_NAME} --cluster=${CLUSTER_NAME} --user=${RANCHER_USER}
kubectl config use-context ${CLUSTER_NAME}
kubectl version
kubectl set image deployment/${DEPLOYMENT_NAME} ${DEPLOYED_APP_NAME}=${IMAGE_URL}
