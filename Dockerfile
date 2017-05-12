FROM node:6
EXPOSE 3000
CMD [ "npm", "run", "start:dist" ]
RUN echo "unsafe-perm=true" > ~/.npmrc
RUN echo 'registry=http://npm.londonlab.alfresco.me:4873/' >> ~/.npmrc
COPY demo-shell-ng2 /usr/src/alfresco-ng2-components/demo-shell-ng2
WORKDIR /usr/src/alfresco-ng2-components/demo-shell-ng2/
RUN npm install 
RUN npm run build