## Running a demo project


- [Quick examples](#quick-examples)
- [start.sh Demo shell script](#start.sh)
- [Ng2 components framework alfresco build](#npm-build-all.sh)
- [Clean components and Demo](#npm-clean.sh)


The Alfresco application development framework comes with a demo project that you can run to get a
feel for what's available.

* Start by navigating into the app development framework source folder, and then the script folder:

```ssh
 cd alfresco-ng2-components
 cd scripts
```

# Quick examples if you want develop the ADF framework

* Start the demo shell using the JS-API from the development branch and the local component in the ng2-components folder

```sh
./start.sh -dev -t -gitjsapi development
```

* Build the ng2-components folder using the JS-API from the development branch 

```sh
./npm-build-all.sh -gitjsapi development
```

* Build the ng2-components folder using the JS-API from the development branch and run the test on it

```sh
./npm-build-all.sh -t -gitjsapi development
```

# start.sh

***start.sh*** script provide a easy way to deal with the npm command and the correct sequence to run the task on demo-shell during develop phases.

## Options

The default behaviour of the ***start.sh*** script always run the install and the start of the demo shell on the port 3000, anyway with some of the options below this behaviour can be changed 
All the commands before can be used in combination

| Option | Description |
| --- | --- |
| -h or --help    | show the help  |
| -u or --update  | run the update of the node_modules packages on the demo shell  |
| -c or --clean   | clean the demo shell folder before to start it  |
| -t or --test    | run the test on the demo-shell  |
| -r or --registry    |  Start the demo using an alternative npm registry  |
| -v or --version    | Instead to use the version defined in the pacakge.json . Download from npm and Install a different version of the ng2-components (this option is not compatible with -dev)  |
| -si or --skipinstall    | skip the install of the node_modules  |
| -ss or --skipstart    | skip the start of the demo shell and oly build it providing a dist folder in the relative demo-shell-ng2 folder  |
| -dev or --develop    | Start the demo in development mode building the relative folder ng2-components with all the components and pointing to those components instead to the ng2-components present in the node_modules folder |
| -dist     | Start the demo shell using a light server and the files builded in the dist folder, particular useful to test the final result of the project |
| -gitjsapi   | if you want start the demo shell using an alfresco-js-api referenced by commit-ish version of the JS-API |
| -vjsapi   | Instead to use the version defined in the pacakge.json . Download from npm and Install a different version of JS-API  |


## Examples

* Start the demo and Install all the dependencies 

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

* Instead to use the version defined in the pacakge.json . Download from npm and Install a different version of the ng2-components (this option is not compatible with -dev)  |

```sh
./start.sh -version or -v COMPONENTS_VERSION

./start.sh -v 1.4.0
```

* Start the demo in development mode building the relative folder ng2-components with all the components and pointing to this component instead to the node_modules one

```sh
./start.sh -develop or -dev
```

* Start the demo shell using a light server using the files builded in the dist folder

```sh
./start.sh -dist
```

* If you want start the demo shell using an alfresco-js-api referenced by commit-ish version of the JS-API

```sh
./start.sh -gitjsapi commit-ish

./start.sh -gitjsapi development
 
./start.sh -gitjsapi de92be966e2ce7eca642ca9e9d7647ba4f849356
```

* If you want start the alfresco-js-api against a commit-ish version of the JS-API

```sh
./start.sh -vjsapi 1.4.0

```

* If you want run the Demo shell test

```sh
./start.sh -t

```

# npm-build-all.sh

***npm-build-all.sh*** this script provide a easy way to deal with the npm command and the correct sequence to build the ng2-components

## Options

The default behaviour of the ***npm-build-all.sh*** install node_modules and build all the components


| Option | Description |
| --- | --- |
| -h or --help    | show the help  |
| -t or --test    | If you want run the test:  |
| -c or --clean   | clean the ng2_components folders before to start from all the temp builds file as node_modules  |
| -gitjsapi   | if you want start the demo shell using an alfresco-js-api referenced by commit-ish version of the JS-API |
| -si or --skipinstall    | skip the install of the node_modules  |
| -sb or --skipbuild    | skip the creation of the bundles files and skip the  errors and lint check inside the components |

      
* If you want to build all your local component:

```sh
./npm-build-all.sh
```

* If you want to build all your local component and run the test:

```sh
./npm-build-all.sh -t or -test
```

* If you want clean the ng2-components folder node_modules before to build

```sh
./npm-build-all.sh -c
```

* If you want build to build all the components against a commit-ish version of the JS-API

```sh
 ./npm-build-all.sh -gitjsapi commit-ish

 ./npm-build-all.sh -gitjsapi development
 
 ./npm-build-all.sh -gitjsapi de92be966e2ce7eca642ca9e9d7647ba4f849356
```

* If you want avoid initial build and run only all the test

```sh
./npm-build-all.sh -s -t
```

* If you want skip initial install node_modules

```sh
./npm-build-all.sh -si
```

* If you want clean all your local component and the demo shell:

```sh
./npm-clean.sh
```

For development environment configuration please refer to [project docs](../demo-shell-ng2/README.md).


# npm-clean.sh

***npm-clean.sh*** clean all the projects folder : ng2-components, ng2-components/*.*/demo and  demo-shell-ng2.

## Options

| Option | Description |
| --- | --- |
| -h or --help    | show the help  |
| -sd or --skipDemo   | skip the demo folder clean |
