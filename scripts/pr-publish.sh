#!/usr/bin/env bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"


show_help() {
    echo "Usage: pr-publish.sh"
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

echo "====== PUBLISH DOCKER IMAGE TAG pr $NAME_PR ====="

docker build -t $DOCKER_REPO/adf/demo-shell:$NAME_PR --build-arg BUILD_NUMBER=$NAME_PR .

echo "====== LOGIN  ====="
docker login http://$DOCKER_REPO -p $PASSWORD_DOCKER -u $USERNAME_DOCKER
docker push "$DOCKER_REPO/adf/demo-shell:$NAME_PR"




