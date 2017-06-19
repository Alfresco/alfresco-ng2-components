
# ADF Demo Application

Please note that this application is not an official product, but a testing and demo application to showcase complex interactions for ADF components.

## Installing

To correctly use this demo check that on your machine is running [Node](https://nodejs.org/en/) version 5.x.x or higher.

```sh
git clone https://github.com/Alfresco/alfresco-ng2-components.git
cd alfresco-ng2-components/demo-shell-ng2/
npm install
```

## Proxy settings and CORS

To simplify development and reduce the time to get started the application features the following Proxy settings:

- **http://localhost:3000/ecm** is mapped to **http://localhost:8080**
- **http://localhost:3000/bpm** is mapped to **http://localhost:9999**

The settings above address most common scenarios for running ACS on port 8080 and APS on port 9999 and allow you to skip the CORS configuration.

If you would like to change default proxy settings, please edit the `config/webpack.common.js` file.

## Application settings (server-side)

All server-side application settings are stored in the `app.config.json` file by default and have the content similar to the following one:

```json
{
    "ecmHost": "http://localhost:3000/ecm",
    "bpmHost": "http://localhost:3000/bpm",
    "application": {
        "name": "Alfresco"
    }
}
```

You can add any additional settings to the application configuration file if needed.

## Development build

```sh
npm start
```

This command compiles and starts the project in watch mode.
Browser will automatically reload upon changes.
Upon start you can navigate to `http://localhost:3000` with your preferred browser.

### Important notes

This script is recommended for development environment and not suited for headless servers and network access.

## Production build

```sh
npm run build
npm run start:dist
```

This command builds project in `production` mode.
All output is placed to `dist` folder and can be served your preferred web server.
You should need no additional files outside the `dist` folder.

### Important notes

By default demo application is configured to use [wsrv](https://www.npmjs.com/package/wsrv) tool (lightweight web server)
to serve production build output. It will be running at `0.0.0.0` address with port `3000` and allow you accessing your application
via network. However you can use any web server of your choice in production.

## Development branch build

If you want to run the demo shell with the latest change from the development branch, use the following command from the /script folder:

```sh
./npm-clean.sh
./start-linked.sh -install
```