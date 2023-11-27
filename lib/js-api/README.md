# Alfresco JavaScript API

JavaScript client API for the Alfresco REST API and Activiti REST API.

## API clients documentation

- [Authentication Api](src/api/auth-rest-api/README.md)
- [Content Api](src/api/content-rest-api/README.md)
- [Model Api](src/api/model-rest-api/README.md)
- [Process Api (AAE)](src/api/activiti-rest-api/README.md)
- [Search Api](src/api/search-rest-api/README.md)
- [Governance Classification Api](src/api/gs-classification-rest-api/README.md)
- [Governance Core Api](src/api/gs-core-rest-api/README.md)
- [Discovery Content API](src/api/discovery-rest-api/README.md)

## Guides

- [Authentication](docs/authentication.md)
- [Calling Custom Endpoints](docs/calling-custom-endpoints.md)
- [Error Events](docs/error-events.md)
- [ECM Examples](docs/ecm-example.md), full docs: [Content API](src/api/content-rest-api/README.md)
- [BPM Examples](docs/bpm-example.md), full docs: [APS 2.X API](src/api/activiti-rest-api/README.md)

## Prerequisites

The minimal supported versions are:

- Alfresco Platform Repository: version [5.2.a-EA](https://wiki.alfresco.com/wiki/Community_file_list_201606-EA) or newer
- Activiti: 1.5
- Node.js ([Long Term Support](https://nodejs.org/en/) version)

## Installing

Using NPM:

```sh
npm install @alfresco/js-api
```

## Development

To run the build

```sh
npm run build
```

To run the test

```sh
npm run test
```
