FROM nginx:alpine

COPY demo-shell/nginx.conf /etc/nginx/nginx.conf

WORKDIR /usr/share/nginx/html
COPY demo-shell/dist/ .
