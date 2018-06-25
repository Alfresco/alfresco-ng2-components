#!/usr/bin/env bash

set -e
eval EXEC_LOGIN=false

show_help() {
    echo "Usage: docker_publish.sh"
    echo ""
    echo "-u or --username username docker repo"
    echo "-p or --passwor password docker repo"
    echo "-t or --tags  tags comma separated"
}

username_set() {
    USERNAME=$1
}

password_set() {
    PASSWORD=$1
    EXEC_LOGIN=true
}


tags_set() {
    TAGS=$1
}

while [[ $1 == -* ]]; do
    case "$1" in
      -h|--help|-\?) show_help; exit 0;;
      -u|--username)  username_set $2; shift 2;;
      -p|--password)  password_set $2; shift 2;;
      -t|--tags)  tags_set $2; shift 2;;
      -*) echo "invalid option: $1" 1>&2; show_help; exit 1;;
    esac
done

# Tag and push image for each additional tag
for current_tag in $(echo $TAGS | sed "s/,/ /g")
do

echo "====== PUBLISH DOCKER IMAGE TAG ${current_tag} ====="

docker build -t alfresco/demo-shell:${current_tag} .
docker tag alfresco/demo-shell:${current_tag} alfresco/demo-shell:${current_tag}

if $EXEC_LOGIN == true; then
    echo "====== LOGIN  ====="
    docker login -u "${USERNAME}" -p "${PASSWORD}"
fi

docker push "alfresco/demo-shell"
echo "====== CLEAN LOCAL IMAGE TAG ${current_tag} ====="
docker rmi -f alfresco/demo-shell:${current_tag}
done
