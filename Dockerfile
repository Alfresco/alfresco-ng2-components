FROM nginx:stable-alpine AS Build
LABEL version="3.0.0"

ARG GROUPNAME=Alfresco
ARG GROUPID=1000
ARG USERNAME=adf
ARG USERID=33011

ARG BUILD_NUMBER

COPY ./docker/nginx.conf /etc/nginx/nginx.conf
COPY ./docker/entrypoint.sh /

WORKDIR /usr/share/nginx/html
COPY demo-shell/dist/ .
COPY --from=builder /usr/src/alfresco/licenses ./licenses

RUN addgroup -g ${GROUPID} ${GROUPNAME} && \
  adduser -S -u ${USERID} -G ${GROUPNAME} -s "/bin/bash" ${USERNAME} && \
  chown -R ${USERNAME}:${GROUPNAME} ./${BUILD_NUMBER}/app.config.json && \
  chown -R ${USERNAME}:${GROUPNAME} /var/cache/nginx && \
  touch /var/run/nginx.pid && \
  chown -R ${USERNAME}:${GROUPNAME} /var/run/nginx.pid && \
  chmod +x /entrypoint.sh && \
  chown -R ${USERNAME}:${GROUPNAME} /entrypoint.sh

EXPOSE 8080
USER ${USERNAME}
ENTRYPOINT [ "/entrypoint.sh" ]
