FROM node:6-alpine

RUN apk add --update bash && rm -rf /var/cache/apk/*

COPY demo-shell-ng2 /usr/src/alfresco-ng2-components/demo-shell-ng2
COPY scripts /usr/src/alfresco-ng2-components/scripts/
WORKDIR /usr/src/alfresco-ng2-components/
RUN /bin/bash -c "./scripts/update-version.sh -v $(npm view ng2-alfresco-core@beta version) -sj -gnu -demoshell"
RUN chmod +x scripts/start.sh && ./scripts/start.sh -ss
RUN /bin/bash -c "rm -rf ./node_modules && npm cache clean && npm install wsrv && rm -rf ./node_modules"
WORKDIR /usr/src/alfresco-ng2-components/demo-shell-ng2/

EXPOSE 3000
CMD [ "npm", "run", "start:dist" ]