## Running a demo project

The Alfresco application development framework comes with a demo project that you can run to get a
feel for what's available.

* Start by navigating into the app development framework source folder, and then the script folder:

```ssh
 cd app-dev-framework
 cd scripts
```

* Start the demo and Install all the dependencies (*Note. do it this way only the first time, and be aware, it will take some time*)

```sh
./start.sh -install
```

* Start the demo (*the standard way of starting the demo after first initialization*):

```sh
./start.sh
```

* Start the demo, install all the dependencies, and remove the previous version of the npm packages (*Note. do this only after big changes*):

```sh
./start.sh -cleanInstall
```

* Start the demo and update the dependencies:

```sh
./start.sh -update
```

For development environment configuration please refer to [project docs](demo-shell-ng2/README.md).