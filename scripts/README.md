## Running a demo project


- [Quick examples](#quick-examples)
- [start.sh Demo shell script](#start.sh)
- [Ng2 components framework alfresco build](#npm-build-all.sh)
- [Clean components and Demo](#npm-clean.sh)

The Alfresco application development framework comes with a demo project that you can run to get a
feel of what's available.

* Start by navigating into the app development framework source folder, and then the scripts folder:

```ssh
 cd alfresco-ng2-components
 cd scripts
```

# Quick examples developed with ADF

* Start the demo shell using the JS-API from the development branch and the local component in the lib folder

```sh
./start.sh -dev -gitjsapi development
```

* Build the lib folder using the JS-API from the development branch 

```sh
./npm-build-all.sh -gitjsapi development
```

* Build the lib folder using the JS-API from the development branch and run the tests on it

```sh
./npm-build-all.sh -t -gitjsapi development
```

# start.sh

***start.sh*** script provide an easy way to deal with the npm command and the correct sequence to run the task on demo-shell during development phases.

## Options

The default behaviour of the ***start.sh*** script always runs the install and the start of the demo shell on the port 3000, but with some of the options below this behaviour can be changed.
All the commands before can be used in combination

| Option | Description |
| --- | --- |
| -h or --help    | show the help  |
| -u or --update  | run the update of the node_modules packages on the demo shell  |
| -c or --clean   | clean the demo shell folder before starting it  |
| -t or --test    | run the tests on the demo-shell  |
| --e2e   | execute e2e test   |
| -r or --registry    |  Start the demo using an alternative npm registry  |
| -v or --version    | Use the version defined in the pacakge.json . Download from npm and Install a different version of the lib (this option is not compatible with -dev)  |
| -si or --skipinstall    | skip the install of the node_modules  |
| -ss or --skipstart    | skip the start of the demo shell and only build it providing a dist folder in the relative demo-shell folder  |
| -dev or --develop    | Start the demo in development mode building the relative folder lib with all the components and pointing to those components instead of the lib present in the node_modules folder |
| -dist     | Start the demo shell using a light server and the files built in the dist folder, particular useful to test the final result of the project |
| -gitjsapi   | Start the demo shell using an alfresco-js-api referenced by commit-ish version of the JS-API |
| -vjsapi   | Use the version defined in the pacakge.json. Download from npm and install a different version of JS-API  |


## Examples

* Start the demo and install all the dependencies 

```sh
./start.sh 
```

* Start the demo, install all the dependencies, and remove the previous version of the npm packages (*Note. do this only after big changes*):

```sh
./start.sh -c 
```

* Start the demo using an alternative npm registry 

```sh
./start.sh -registry 'http://npm.local.me:8080/'
```

* Start the demo and update the dependencies:

```sh
./start.sh -update or -u
```

* Use instead the version defined in the pacakge.json. Download from npm and install a different version of the lib (this option is not compatible with -dev)  |

```sh
./start.sh -version or -v COMPONENTS_VERSION

./start.sh -v 1.4.0
```

* Start the demo in development mode building the relative folder lib with all the components and pointing to this component instead of the node_modules one

```sh
./start.sh -develop or -dev
```

* Start the demo shell using a light server using the files built in the dist folder

```sh
./start.sh -dist
```

* Start the demo shell using an alfresco-js-api referenced by commit-ish version of the JS-API

```sh
./start.sh -gitjsapi commit-ish

./start.sh -gitjsapi development
 
./start.sh -gitjsapi de92be966e2ce7eca642ca9e9d7647ba4f849356
```

* Start the alfresco-js-api against a commit-ish version of the JS-API

```sh
./start.sh -vjsapi 1.4.0

```

* Run the Demo shell tests

```sh
./start.sh -t

```

# npm-build-all.sh

***npm-build-all.sh*** this script provides an easy way to deal with the npm command and the correct sequence to build the lib

## Options

The default behaviour of the ***npm-build-all.sh*** install node_modules and build all the components


| Option | Description |
| --- | --- |
| -h or --help    | show the help  |
| -t or --test    | Run the tests, this parameter accepts also a wildcard to execute tests for example -t "core" |
| -d or --debug    | Run the tests **in browser**, this parameter accepts also a wildcard to execute tests for example -d "core" |
| -c or --clean   | clean the ng2_components folders before start from all the temp builds files as node_modules  |
| -gitjsapi   | start the demo shell using an alfresco-js-api referenced by commit-ish version of the JS-API |
| -si or --skipinstall    | skip the installation of the node_modules  |
| -sb or --skipbuild    | skip the creation of the bundles files and skip the errors and lint checks inside the components |

      
* Build all your local components:

```sh
./npm-build-all.sh
```

* Build all your local components and run the tests:

```sh
./npm-build-all.sh -t
```

* Build all your local components and run the tests **in BROWSER**:

```sh
./npm-build-all.sh -d
```

* Build only a part of the component and run the tests only for a specific folder **in BROWSER**:
(you can change core with, any other lib in the lib folder) 

```sh
./npm-build-all.sh -si -sb -d "core"
```

* Clean the lib folder node_modules before build

```sh
./npm-build-all.sh -c
```

* Build all the components against a commit-ish version of the JS-API

```sh
 ./npm-build-all.sh -gitjsapi commit-ish

 ./npm-build-all.sh -gitjsapi development
 
 ./npm-build-all.sh -gitjsapi de92be966e2ce7eca642ca9e9d7647ba4f849356
```

* Skip initial build and run only all the test

```sh
./npm-build-all.sh -s -t
```

* Skip initial installation of node_modules

```sh
./npm-build-all.sh -si
```

* Clean all your local components and the demo shell:

```sh
./npm-clean.sh
```

For development environment configuration please refer to [project docs](../demo-shell/README.md).

# npm-clean.sh

***npm-clean.sh*** clean all the projects folders : lib and  demo-shell.

## Options

| Option | Description |
| --- | --- |
| -h or --help    | show the help  |

# npm-check-bundles.sh

***npm-check-bundles.sh*** check the bundles in the package npm are present

## Options

| Option | Description |
| --- | --- |
| -h or --help    | show the help  |
| -r or --registry   | against which register you want to do this check |
| -v or --version    | the version of the components to check |


# npm-add-pkg.sh

***npm-add-pkg.sh*** check the bundles in the package npm are present

Add a package across all the pacakge json in the project

## Options

| Option | Description |
| --- | --- |
| -h or --help    | show the help  |
| --save   | save it in dependencies |
| --save-dev   | save it in dev dependencies |

* Add a package in the project

## Examples

```sh
./npm-add-pkg.sh --save-dev NPM_NAME
```

# extract-langs.sh

***extract-langs.sh*** 

Extract the i18n files from the repo and create a zip

## Options

| Option | Description |
| --- | --- |
| -h or --help    | show the help  |
| --output or o   | output folder otherwise will be 18n |

## Examples

```sh
./extract-langs.sh 
```

# docker-publish.sh

***docker-publish.sh*** 

publish doker images in the selected repository

## Options

| Option | Description |
| --- | --- |
| -u or --username  | username  |
| -p or --password  | password |
| -t or --tags  | tags |

## Examples

```sh
./docker-publish.sh
```

# test-e2e-bc.sh

***test-e2e-bc.sh*** 

This script test that the update from 2.0.0 to 2.x.x is still smooth 

## Examples

```sh
./test-e2e-bc
```

# test-e2e-bc.sh

***test-e2e-bc.sh*** 

This script test that the update from 2.0.0 to 2.x.x is still smooth 

## Examples

```sh
./test-e2e-bc
```

# simulate-publish.sh

***simulate-publish.sh*** 

This script run a verdaccio server and simulate a publish on it 

## Examples

```sh
./simulate-publish
```

# test-dist.sh

***test-dist.sh*** 

This script test the distribution of ADF against the demo shell 

## Examples

```sh
./test-dist
```

# rancher-update.sh

***rancher-update.sh*** 

Internal script for update the rancher env 

| Option | Description |
| --- | --- |
|--access_key |rancher access key|
|--secret_key |rancher secret key|
|--url |rancher_url|
|--environment_name s|ervice name to replace in rancher|
|--image |image to gater and load in the service, example:  docker:alfresco/demo-shell:latest|

## Examples

```sh
/rancher-update.sh --access_key ACCESS_KEY --secret_key SECRET_KEY --url RANCHER_URL--environment_name adf-master --image docker:alfresco/demo-shell:master
```


# test-e2e-lib.sh

***test-e2e-lib.sh*** 

Script to run e2e test

| Option | Description |
| --- | --- |
|-u or --username |username to use|
|-p or --password|password to use|
|-e or --email |email user to use|
|-b or --browser |browser run the test in the browsrwer (No headless mode)|
|-s or --spec |spec run a single test file|
|-dev or --dev |run it against local development environment it will deploy on localhost:4200 the current version of your branch|
|-t or --timeout |override the timeout foe the wait utils|
|-host or --host | host against to run the test|
|-proxy or --proxy | proxy Back end URL to use |

## Examples

```sh
./scripts/test-e2e-lib.sh -host adf.domain.com -u admin -p admin -e admin
```

Run on browser

```sh
./scripts/test-e2e-lib.sh -host adf.domain.com -u admin -p admin -e admin --browser
```


Run a single test

```sh
./scripts/test-e2e-lib.sh -host adf.domain.com -u admin -p admin -e admin --spec filenam.e2e.ts
```

if the test in a subfolder in e2e you need to add the subfolder in the path:

```shnpm in
./scripts/test-e2e-lib.sh -host adf.domain.com -u admin -p admin -e admin --spec ./core/filenam.e2e.ts
```

Use a different backend

```sh
./scripts/test-e2e-lib.sh -host localhost:42000 -proxy adf.domain.com  -u admin -p admin -e admin
```
