FROM nginx:stable-alpine
LABEL version="3.0.0"

ARG PROJECT_NAME=demo-shell

COPY ./docker/nginx.conf /etc/nginx/nginx.conf
COPY ./docker/entrypoint.sh /

WORKDIR /usr/share/nginx/html
COPY dist/$PROJECT_NAME .

ENTRYPOINT [ "/entrypoint.sh" ]
