# 1. Generate licenses

FROM node:18.16-alpine3.17 AS builder
WORKDIR /usr/src/alfresco
COPY package.json package.json

RUN mkdir -p ./licenses && \
  yarn licenses list > ./licenses/licenses.txt && \
  yarn licenses generate-disclaimer > ./licenses/disclaimer.txt

# 2. Generate image

FROM nginxinc/nginx-unprivileged:1.21-alpine

USER root
RUN apk update && apk upgrade
USER 101

ARG PROJECT_NAME

COPY docker/default.conf.template /etc/nginx/templates/
COPY docker/docker-entrypoint.d/* /docker-entrypoint.d/

COPY dist/$PROJECT_NAME /usr/share/nginx/html/
COPY dist/$PROJECT_NAME/app.config.json /etc/nginx/templates/app.config.json.template
COPY --from=builder /usr/src/alfresco/licenses /usr/share/nginx/html/

USER root
RUN chmod a+w -R /etc/nginx/conf.d
USER 101

ENV BASE_PATH=/
ENV NGINX_ENVSUBST_OUTPUT_DIR=/etc/nginx/conf.d
