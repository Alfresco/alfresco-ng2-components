## Running a demo project

The Alfresco application development framework comes with a demo project that you can run to get a
feel for what's available.

* Start by navigating into the app development framework source folder, and then the script folder:

```ssh
 cd alfresco-ng2-components
 cd scripts
```

Start using published components
---

This is recommended if you are running from the `master` branch.

Start the demo-shell app after installing all the dependencies from npm (*Note. do it this way only the first time, and be aware, it will take some time*)

```sh
./start.sh -install
```

Or, if you have previously run `-install` but want to update the dependencies, use `-update`

```sh
./start.sh -update
```

If there are no big changes in the demo-shell since you last started then you can start without `-install` and `-update` to skip fetching packages, which should be much quicker

```sh
./start.sh
```

If you get errors when starting which do not go away with `-update` or `-install,` or if you want to test starting the demo shell from a clean environment, then use the `-cleanInstall` option

This will remove previous versions of all packages, before running `npm install` again

```sh
./start.sh -cleanInstall
```

Start using linked components
---

This is recommended if you are using the `development` branch or a feature branch off `development`

* If you want to use your local components use the following script with any of the previous option. It will npm link all the components
in the demo shell:

```sh
./start-linked.sh
```

For development environment configuration please refer to [project docs](demo-shell-ng2/README.md).
