FROM node:5

# Create src directory
RUN mkdir -p /usr/src
WORKDIR /usr/src

# Copy source and install app dependencies
COPY app /usr/src/app/
COPY assets /usr/src/assets/
COPY i18n /usr/src/i18n/
COPY app /usr/src/app/
COPY package.json index.html systemjs.config.js *.json LICENSE README.md /usr/src/

RUN npm install material-design-lite material-design-icons
RUN npm set registry http://devproducts.alfresco.me:4873/
RUN npm install

EXPOSE 3000

CMD [ "npm", "start" ]