## Running a demo project

The Alfresco application development framework comes with a demo project that you can run to get a
feel for what's available.

* Start by navigating into the app development framework source folder, and then the script folder:

```ssh
 cd alfresco-ng2-components
 cd scripts
```

* Start the demo and Install all the dependencies (*Note. do it this way only the first time, and be aware, it will take some time*)

```sh
./start.sh -install or -i
```

* Start the demo (*the standard way of starting the demo after first initialization*):

```sh
./start.sh
```

* Start the demo, install all the dependencies, and remove the previous version of the npm packages (*Note. do this only after big changes*):

```sh
./start.sh -c -i
```

* Start the demo using an alternative npm registry 

```sh
./start.sh -registry 'http://npm.local.me:8080/'
```

* Start the demo and update the dependencies:

```sh
./start.sh -update or -u
``

* Install a different version of the ng2-components specified in the package.json his option is not compatible with -d

```sh
./start.sh -version or -v COMPONENTS_VERSION

./start.sh -v 1.4.0
```

* Start the demo in development mode building the relative folder ng2-components with all the components and pointing to this component instead to the node_modules one

```sh
./start.sh -develop or -d
```

* Start the demo start the demo shell in dist mode

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

* If you want to build all your local component:

```sh
./npm-buid-all.sh
```

* If you want to build all your local component and run the test:

```sh
./npm-buid-all.sh -t or -test
```

* If you want clean the ng2-components folder node_modules before to build

```sh
./npm-buid-all.sh -c
```* 

If you want build to build all the components against a commit-ish version of the JS-API

```sh
 ./npm-buid-all.sh -gitjsapi commit-ish

 ./npm-build-all.sh -gitjsapi development
 
 ./npm-build-all.sh -gitjsapi de92be966e2ce7eca642ca9e9d7647ba4f849356
```

* If you want clean all your local component and the demo shell:

```sh
./npm-clean.sh
```

For development environment configuration please refer to [project docs](../demo-shell-ng2/README.md).
