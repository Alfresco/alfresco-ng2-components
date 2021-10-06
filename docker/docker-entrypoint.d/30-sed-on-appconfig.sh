#!/bin/sh

set -e

echo Running sed on "${NGINX_ENVSUBST_OUTPUT_DIR}/app.config.json"

if [ -n "${APP_CONFIG_AUTH_TYPE}" ]; then
  sed -e "s/\"authType\": \".*\"/\"authType\": \"${APP_CONFIG_AUTH_TYPE}\"/g" \
    -i "${NGINX_ENVSUBST_OUTPUT_DIR}/app.config.json"
fi

if [ -n "${APP_CONFIG_IDENTITY_HOST}" ]; then
  replace="\/"
  encodedIdentity=${APP_CONFIG_IDENTITY_HOST//\//$replace}
  sed -e "s/\"identityHost\": \".*\"/\"identityHost\": \"$encodedIdentity\"/g" \
    -i "${NGINX_ENVSUBST_OUTPUT_DIR}/app.config.json"
fi

if [ -n "${APP_CONFIG_OAUTH2_HOST}" ]; then
  replace="\/"
  encoded=${APP_CONFIG_OAUTH2_HOST//\//$replace}
  sed -e "s/\"host\": \".*\"/\"host\": \"${encoded}\"/g" \
    -i "${NGINX_ENVSUBST_OUTPUT_DIR}/app.config.json"
fi

if [ -n "${APP_CONFIG_OAUTH2_CLIENTID}" ]; then
  sed -e "s/\"clientId\": \".*\"/\"clientId\": \"${APP_CONFIG_OAUTH2_CLIENTID}\"/g" \
    -i "${NGINX_ENVSUBST_OUTPUT_DIR}/app.config.json"
fi

if [ -n "${APP_CONFIG_OAUTH2_IMPLICIT_FLOW}" ]; then
  sed -e "s/\"implicitFlow\": [^,]*/\"implicitFlow\": ${APP_CONFIG_OAUTH2_IMPLICIT_FLOW}/g" \
    -i "${NGINX_ENVSUBST_OUTPUT_DIR}/app.config.json"
fi

if [ -n "${APP_CONFIG_OAUTH2_SILENT_LOGIN}" ]; then
  sed -e "s/\"silentLogin\": [^,]*/\"silentLogin\": ${APP_CONFIG_OAUTH2_SILENT_LOGIN}/g" \
    -i "${NGINX_ENVSUBST_OUTPUT_DIR}/app.config.json"
fi

if [ -n "${APP_CONFIG_OAUTH2_REDIRECT_SILENT_IFRAME_URI}" ]; then
  replace="\/"
  encoded=${APP_CONFIG_OAUTH2_REDIRECT_SILENT_IFRAME_URI//\//$replace}
  sed -e "s/\"redirectSilentIframeUri\": \".*\"/\"redirectSilentIframeUri\": \"${encoded}\"/g" \
    -i "${NGINX_ENVSUBST_OUTPUT_DIR}/app.config.json"
fi

if [[ -n "${APP_CONFIG_BPM_HOST}" ]]; then
  replace="\/"
  encoded=${APP_CONFIG_BPM_HOST//\//$replace}
  sed -e "s/\"bpmHost\": \".*\"/\"bpmHost\": \"${encoded}\"/g" \
    -i "${NGINX_ENVSUBST_OUTPUT_DIR}/app.config.json"
fi

if [[ -n "${APP_CONFIG_ECM_HOST}" ]]; then
  replace="\/"
  encoded=${APP_CONFIG_ECM_HOST//\//$replace}
  sed -e "s/\"ecmHost\": \".*\"/\"ecmHost\": \"${encoded}\"/g" \
    -i "${NGINX_ENVSUBST_OUTPUT_DIR}/app.config.json"
fi

if [[ -n "${APP_CONFIG_KERBEROS_ENABLED}" ]]; then
  sed -e "s/\"withCredentials\": [^,]*/\"withCredentials\": ${APP_CONFIG_KERBEROS_ENABLED}/g" \
    -i "${NGINX_ENVSUBST_OUTPUT_DIR}/app.config.json"
fi

if [[ -n "${APP_CONFIG_PROVIDERS}" ]]; then
  sed -e "s/\"providers\": [^,]*/\"providers\": \"${APP_CONFIG_PROVIDERS}\"/g" \
    -i "${NGINX_ENVSUBST_OUTPUT_DIR}/app.config.json"
fi

if [ -n "${APP_CONFIG_APPS_DEPLOYED}" ]; then
  sed -e "s/\"alfresco-deployed-apps\": \[.*\]/\"alfresco-deployed-apps\": ${APP_CONFIG_APPS_DEPLOYED}/g" \
    -i "${NGINX_ENVSUBST_OUTPUT_DIR}/app.config.json"
fi
