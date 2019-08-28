# 1. Generate licenses

FROM node:11.9-alpine AS builder
WORKDIR /usr/src/alfresco
COPY package.json package.json

RUN mkdir -p ./licenses && \
  yarn licenses list > ./licenses/licenses.txt && \
  yarn licenses generate-disclaimer > ./licenses/disclaimer.txt

# 2. Generate image

FROM nginx:stable-alpine
LABEL version="3.0.0"

COPY ./docker/nginx.conf /etc/nginx/nginx.conf
COPY ./docker/entrypoint.sh /

WORKDIR /usr/share/nginx/html
COPY demo-shell/dist/ .
COPY --from=builder /usr/src/alfresco/licenses ./licenses

EXPOSE 8080

ENTRYPOINT [ "/entrypoint.sh" ]
