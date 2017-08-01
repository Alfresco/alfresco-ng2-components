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

* Start the demo shell using the JS-API from the development branch and the local component in the ng2-components folder

```sh
./start.sh -dev -t -gitjsapi development
```

* Build the ng2-components folder using the JS-API from the development branch 

```sh
./npm-build-all.sh -gitjsapi development
```

* Build the ng2-components folder using the JS-API from the development branch and run the tests on it

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
| -r or --registry    |  Start the demo using an alternative npm registry  |
| -v or --version    | Use the version defined in the pacakge.json . Download from npm and Install a different version of the ng2-components (this option is not compatible with -dev)  |
| -si or --skipinstall    | skip the install of the node_modules  |
| -ss or --skipstart    | skip the start of the demo shell and only build it providing a dist folder in the relative demo-shell-ng2 folder  |
| -dev or --develop    | Start the demo in development mode building the relative folder ng2-components with all the components and pointing to those components instead of the ng2-components present in the node_modules folder |
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

* Use instead the version defined in the pacakge.json. Download from npm and install a different version of the ng2-components (this option is not compatible with -dev)  |

```sh
./start.sh -version or -v COMPONENTS_VERSION

./start.sh -v 1.4.0
```

* Start the demo in development mode building the relative folder ng2-components with all the components and pointing to this component instead of the node_modules one

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

***npm-build-all.sh*** this script provides an easy way to deal with the npm command and the correct sequence to build the ng2-components

## Options

The default behaviour of the ***npm-build-all.sh*** install node_modules and build all the components


| Option | Description |
| --- | --- |
| -h or --help    | show the help  |
| -t or --test    | Run the tests, this parameter accepts also a wildcard to execute tests for example -t "ng2-alfresco-core" |
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
./npm-build-all.sh -t or -test
```

* Clean the ng2-components folder node_modules before build

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

For development environment configuration please refer to [project docs](../demo-shell-ng2/README.md).


# npm-relock-pkgs.sh

***npm-relock-pkgs.sh*** Deletes and regenerates package-lock.json files for each|passed components, depending on the component's actual package.json

## Options

| Option | Description |
| --- | --- |
| -h or --help    | show the help  |
| -t or --test    | run the test suites after "npm install" of each component

## Examples

* Regenerate package-lock.json files for every package 

```sh
./npm-relock-pkgs.sh
```

* Regenerate package-lock.json files for ng2-alfresco-core and ng2-alfresco-search components

```sh
./npm-relock-pkgs.sh ng2-alfresco-core ng2-alfresco-search
```

* Regenerate package-lock.json files for every package and run test suites for them

```sh
./npm-relock-pkgs.sh -t
```

* Regenerate package-lock.json files for for ng2-alfresco-core and ng2-alfresco-search components and run test suites for them

```sh
./npm-relock-pkgs.sh -t ng2-alfresco-core ng2-alfresco-search
```

# npm-clean.sh

***npm-clean.sh*** clean all the projects folders : ng2-components and  demo-shell-ng2.

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


***npm-add-pkg.sh*** check the bundles in the package npm are present

Add a package across all the pacakge json in the project

| Option | Description |
| --- | --- |
| -h or --help    | show the help  |
| --save   | save it in dependencies |
| --save-dev   | save it in dev dependencies |

* Add a package in the project

```sh
./npm-add-pkg.sh --save-dev NPM_NAME
```