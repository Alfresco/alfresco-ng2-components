# ALFRESCO WEB COMPONENTS

<p align="center">
  <img title="alfresco" alt='alfresco' src='assets/alfresco.png'  width="280px" height="150px"></img>
  <img title="angular2" alt='angular2' src='assets/angular2.png'  width="150px" height="150px"></img>
</p>

## Prerequisites

- Alfresco repository with CORS enabled. A Docker-compose file is provided by the [demo-shell](demo-shell-ng2/README.md) app.

### Running demo project

**Note**: *Steps below show the quickest way to get demo shell up and running.
For development configuration please refer to* **Configuring development environment**
*section further in this document.*

##### Using setup script (recommended)

```sh
git clone https://github.com/Alfresco/dev-platform-js-api.git
git clone https://github.com/Alfresco/dev-platform-webcomponents.git
cd dev-platform-webcomponents
./start.sh
```

##### Manual setup

```sh
git clone https://github.com/Alfresco/dev-platform-js-api.git
git clone https://github.com/Alfresco/dev-platform-webcomponents.git

cd dev-platform-webcomponents/demo-shell-ng2

npm install
npm install ../ng2-components/ng2-alfresco-core
npm install ../ng2-components/ng2-alfresco-login
npm install ../ng2-components/ng2-alfresco-documentlist
npm install ../ng2-components/ng2-alfresco-upload
npm install ../../dev-platform-js-api

npm run build.dev
```

For development environment configuration please refer to [project docs](demo-shell-ng2/README.md).
