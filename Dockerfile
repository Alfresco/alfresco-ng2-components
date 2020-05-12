FROM nginx:stable-alpine
LABEL version="3.0.0"

ARG GROUPNAME=Alfresco
ARG GROUPID=1000
ARG USERNAME=adf
ARG USERID=33011

COPY ./docker/nginx.conf /etc/nginx/nginx.conf
COPY ./docker/entrypoint.sh /

WORKDIR /usr/share/nginx/html
COPY demo-shell/dist/ .

RUN addgroup -g ${GROUPID} ${GROUPNAME} && \
  adduser -S -u ${USERID} -G ${GROUPNAME} -s "/bin/bash" ${USERNAME} && \
  chown -R ${USERNAME}:${GROUPNAME} ./**/app.config.json,  ./app.config.json  /var/cache/nginx  ||  \
  touch /var/run/nginx.pid && \
  chown -R ${USERNAME}:${GROUPNAME} /var/run/nginx.pid && \
  chmod +x /entrypoint.sh && \
  chown -R ${USERNAME}:${GROUPNAME} /entrypoint.sh

EXPOSE 8080
USER ${USERNAME}
ENTRYPOINT [ "/entrypoint.sh" ]
