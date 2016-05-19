# ALFRESCO WEB COMPONENTS

<p align="center">
  <img title="alfresco" alt='alfresco' src='assets/alfresco.png'  width="280px" height="150px"></img>
  <img title="angular2" alt='angular2' src='assets/angular2.png'  width="150px" height="150px"></img>
</p>

## Prerequisites

- Alfresco repository with CORS enabled. A Docker-compose file is provided by the [demo-shell](demo-shell-ng2/README.md) app.

## Private Npm repository configuration

All the components are stored in our private repository, the address is http://52.16.120.219:4873/. The repository is visible only from the Alfresco VPN.

How to configure it:

```sh
npm set registry http://52.16.120.219:4873
npm adduser --registry http://52.16.120.219:4873
```

### Running demo project

*Steps below show the quickest way to get demo shell up and running.*

##### Using setup script (recommended)

```sh
git clone https://github.com/Alfresco/dev-platform-js-api.git
git clone https://github.com/Alfresco/dev-platform-webcomponents.git
cd dev-platform-webcomponents
```

* Start the demo and Install all the dependencies (do it the first time or after a project update)

```sh
./start.sh -install
```

* Start the demo 

```sh
./start.sh
```

For development environment configuration please refer to [project docs](demo-shell-ng2/README.md).

## Components

- [Core library](ng2-components/ng2-alfresco-core/README.md)
- [DataTable](ng2-components/ng2-alfresco-datatable/README.md)
- [DocumentList](ng2-components/ng2-alfresco-documentlist/README.md)
- [Viewer](ng2-components/ng2-alfresco-viewer/README.md)
- [Login](ng2-components/ng2-alfresco-login/README.md)
- [Upload](ng2-components/ng2-alfresco-upload/README.md)
