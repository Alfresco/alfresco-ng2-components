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
./start.sh -cleanInstall or -c
```

* Start the demo and update the dependencies:

```sh
./start.sh -update or -u
```

* If you want to use your local components use the following script with any of the previous option. It will npm link all the components
in the demo shell:

```sh
./start.sh -link or -l
```

* If you want to build all your local component:

```sh
./npm-buid-alll.sh
```

* If you want clean all your local component and the demo shell:

```sh
./npm-clean.sh
```

For development environment configuration please refer to [project docs](../demo-shell-ng2/README.md).
