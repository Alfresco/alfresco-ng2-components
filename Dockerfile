FROM nginx:stable-alpine
LABEL version="3.0.0"

COPY ./docker/nginx.conf /etc/nginx/nginx.conf
COPY ./docker/entrypoint.sh /

WORKDIR /usr/share/nginx/html
COPY demo-shell/dist/ .

ENTRYPOINT [ "/docker-entrypoint.sh" ]
