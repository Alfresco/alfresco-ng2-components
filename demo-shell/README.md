
# ADF Demo Application

Please note that this application is not an official product, but a testing and demo application to showcase complex interactions of ADF components.

## Installing

To correctly use this demo check that on your machine you have [Node](https://nodejs.org/en/) version 5.x.x or higher.

```sh
git clone https://github.com/Alfresco/alfresco-ng2-components.git
cd alfresco-ng2-components
npm install
npm start
```

## Proxy settings and CORS

To simplify development and reduce the time to get the application started, we have the following Proxy settings:

- **http://localhost:3000/ecm** is mapped to **http://localhost:8080**
- **http://localhost:3000/bpm** is mapped to **http://localhost:9999**

The settings above address most common scenarios for running ACS on port 8080 and APS on port 9999 and allow you to skip the CORS configuration.

If you would like to change default proxy settings, please edit the `proxy.conf.js` file.

## Application settings (server-side)

All server-side application settings are stored in the [src/app.config.json](src/app.config.json). 
By default the configuration files have the content similar to the following one:

```json
{
    "$schema": "../../lib/core/app-config/schema.json",
    "ecmHost": "http://{hostname}:{port}",
    "bpmHost": "http://{hostname}:{port}",
    "application": {
        "name": "Alfresco ADF Application"
    }
}
```

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
npm run start:prod
```

This command builds project in `production` mode.
All output is placed to `dist` folder and can be served to your preferred web server.
You should need no additional files outside the `dist` folder.

## Development branch build

If you want to run the demo shell with the latest changes from the development branch, use the following command :

```sh
npm run start
```
