#!/usr/bin/env bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"


show_help() {
    echo "Usage: pr-build.sh"
    echo ""
    echo "-n or --name pr name"
    echo "-r or --repo docker repository url"
}

name_pr(){
    NAME_PR=$1
}

name_docker_repo(){
    DOCKER_REPO=$1
}

username_docker_repo(){
    USERNAME_DOCKER=$1
}

password_docker_repo(){
    PASSWORD_DOCKER=$1
}

while [[ $1 == -* ]]; do
    case "$1" in
      -h|--help|-\?) show_help; exit 0;;
      -n|--name)  name_pr $2; shift 2;;
      -r|--repo)  name_docker_repo $2; shift 2;;
      -u|--username)  username_docker_repo $2; shift 2;;
      -p|--password)  password_docker_repo $2; shift 2;;
      -*) echo "invalid option: $1" 1>&2; show_help; exit 0;;
    esac
done

cd $DIR/..

echo "====== Install JS-API alpha ===== "

npm install alfresco-js-api@alpha

echo "====== Build ADF ===== "

npm run build-lib || exit 1

echo "====== COPY new build in node_modules ===== "

rm -rf ../node_modules/@alfresco

mkdir -p $DIR/../node_modules/@alfresco/adf-core
mkdir -p $DIR/../node_modules/@alfresco/adf-content-services
mkdir -p $DIR/../node_modules/@alfresco/adf-process-services
mkdir -p $DIR/../node_modules/@alfresco/adf-insights

cp -R $DIR/../lib/dist/core/* $DIR/..//node_modules/@alfresco/adf-core
cp -R $DIR/../lib/dist/content-services/* $DIR/../node_modules/@alfresco/adf-content-services
cp -R $DIR/../lib/dist/process-services/* $DIR/../node_modules/@alfresco/adf-process-services
cp -R $DIR/../lib/dist/insights/* $DIR/../node_modules/@alfresco/adf-insights

npm run server-versions
ng build --prod --app dist --base-href=/$NAME_PR/ -op demo-shell/dist/$NAME_PR

echo "====== PUBLISH DOCKER IMAGE TAG pr $NAME_PR ====="

docker build -t $DOCKER_REPO/adf/demo-shell:$NAME_PR .

echo "====== LOGIN  ====="
docker login http://$DOCKER_REPO -p $PASSWORD_DOCKER -u $USERNAME_DOCKER
docker push "$DOCKER_REPO/adf/demo-shell:$NAME_PR"




