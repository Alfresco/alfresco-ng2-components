## Running a demo project

- [start demo shell](#Start-Demo-Shell)

The Alfresco application development framework comes with a demo project that you can run to get a
feel of what's available.

* Start by navigating into the app development framework source folder, and then the scripts folder:

```ssh
 cd alfresco-ng2-components
 cd scripts
```

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

```sh
./scripts/test-e2e-lib.sh -host adf.domain.com -u admin -p admin -e admin --spec ./core/filenam.e2e.ts
```

Use a different backend

```sh
./scripts/test-e2e-lib.sh -host localhost:42000 -proxy adf.domain.com  -u admin -p admin -e admin
```
