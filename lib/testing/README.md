# Alfresco Testing Library

Contains the reusable pages for e2e tests

## Run e2e against a remote env using the .env.cloud file
Create a file `.env.cloud` under the `e2e` folder
```
HOST_BPM="https://gateway.example.com"
HOST_SSO="https://identity.example.com/auth/realms/alfresco"
URL_HOST_IDENTITY="https://identity.example.com/auth/admin/realms/alfresco"
IDENTITY_USERNAME_ADF="username"
IDENTITY_PASSWORD_ADF="password"
```

### How can I run the *cloud* e2e against a *remote* env with *chrome headless* ?
Add to `.env.cloud` and run `./scripts/test-e2e-lib.sh`
```
FOLDER="process-services-cloud"
URL_HOST_ADF="http://myadf.example.com"
...
```
or
`./scripts/test-e2e-lib.sh -host http://myadf.example.com -f process-services-cloud`

### How can I run the *cloud* e2e against a *remote* env with *full chrome* ?
Add to `.env.cloud` and run `./scripts/test-e2e-lib.sh -env .env.cloud`
```
BROWSER_RUN=true
FOLDER="process-services-cloud"
URL_HOST_ADF="http://myadf.example.co"
...
```
or
`./scripts/test-e2e-lib.sh -host http://myadf.example.com -f process-services-cloud -b`

### How can I run specific *specs* agains a *remote* env?
Add to `.env.cloud` and run `./scripts/test-e2e-lib.sh -env .env.cloud`
```
LIST_SPECS="process-services-cloud/apps-section-cloud.e2e.ts,process-services-cloud/task-filters-cloud.e2e.ts"
URL_HOST_ADF="http://myadf.example.co"
...
```
or `./scripts/test-e2e-lib.sh -host http://myadf.example.com -s process-services-cloud/apps-section-cloud.e2e.ts,process-services-cloud/task-filters-cloud.e2e.ts`

## Run e2e against a local env (use dist) using the .env.cloud file
Create a file `.env.cloud` under the `e2e` folder
```
HOST_BPM="https://gateway.example.com"
HOST_SSO="https://identity.example.com/auth/realms/alfresco"
URL_HOST_IDENTITY="https://identity.example.com/auth/admin/realms/alfresco"
IDENTITY_USERNAME_ADF="username"
IDENTITY_PASSWORD_ADF="password"
```
### How can I run the *cloud* e2e against a *local* env with *chrome headless* ?
Add to `.env.cloud` and run `./scripts/test-e2e-lib.sh -ud  -env .env.cloud`
```
FOLDER="process-services-cloud"
URL_HOST_ADF="http://localhost:4200"
...
```
or `./scripts/test-e2e-lib.sh -ud -host http://localhost:4200 -f process-services-cloud `

### How can I run the *cloud* e2e against a *local* env with *full chrome* ?
Add to `.env.cloud` and run `./scripts/test-e2e-lib.sh -ud  -env .env.cloud`
```
BROWSER_RUN=true
FOLDER="process-services-cloud"
URL_HOST_ADF="http://localhost:4200"
...
```
or `./scripts/test-e2e-lib.sh -ud -host http://localhost:4200 -f process-services-cloud -b`

### How can I run specific *specs* agains a *local* env?
Add to `.env.cloud` and run `./scripts/test-e2e-lib.sh -ud  -env .env.cloud`
```
LIST_SPECS="process-services-cloud/apps-section-cloud.e2e.ts,process-services-cloud/task-filters-cloud.e2e.ts"
URL_HOST_ADF="http://localhost:4200"
...
```
or `./scripts/test-e2e-lib.sh -ud -host http://localhost:4200 -s process-services-cloud/apps-section-cloud.e2e.ts,process-services-cloud/task-filters-cloud.e2e.ts`
