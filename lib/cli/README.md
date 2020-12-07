# Alfresco ADF Cli

The ADF CLI provides a set of utilities to manage your ADF projects.

## Installation

To get started  follow these instructions:

```bash
npm install @alfresco/adf-cli -g
```

To know more about any command use the -h or --help option: 

```bash
adf-cli <command> --help
```

## Developing

Link the project as a global tool

```bash
npm link
```

Build the tool in the **develop** mode (automatically watches for changes and rebuilds the commands):

```bash
npm run develop
```

Run the tool with the `DEVELOP` environment variable:

```bash
DEVELOP=true adf-cli <command>
```

In develop mode, the CLI takes the prebuilt scripts from the dist folder.

## Commands

| **Commands** |**Description** |
|--- |--- |
|check-cs-env |Check cs env is up |
|check-ps-env |Check ps env is up |
|artifact-from-s3  |Get artifact from S3 |
|artifact-to-s3    |Get artifact to S3 |
|docker-publish    |publish docker image|
|init-aae-env      |Init env|
|init-aps-env      |Init aps|
|kubectl-delete    |delete kubectl |
|kubectl-image     |This command allows you to update a specific service on the rancher env with a specific tag |
|npm-publish    | publish on npm |
| update-commit-sha   | his command allows you to update the commit sha as part of the `package.json`. Your `package.json` must to have an existing property called "commit" |
|update-version     |This command allows you to update the adf dependencies and js-api with different versions Update adf libs and js-api with latest alpha|
|licenses   |Create a 3th party license file |
|audit     |Check the security risk dependency in your package.json |
|scan-env   |Scan the environment to show its status    |

## Examples

### License Check

Move in the folder where you have your `package.json` and run the command:

```bash
npm install

adf-cli licenses
```

### Audit Check

Move in the folder where you have your `package.json` and run the command:

```bash
npm install

adf-cli audit
```

### Docker publish

Move in the folder where you have your `Dockerfile` and run the command:

```bash
adf-cli docker-publish --dockerRepo "${docker_repository}"  --dockerTags "${TAGS}" --pathProject "$(pwd)"
```

If you want to specify a different docker registry you can run
```bash
--loginCheck --loginUsername "username" --loginPassword "password" --loginRepo "quay.io"--dockerRepo "${docker_repository}"  --dockerTags "${TAGS}" --pathProject "$(pwd)"
```

### Kubectl update pod image

This command allows you to update a specific service on the rancher env with a specific tag

```bash
adf-cli kubectl-image --clusterEnv ${clusterEnv} --clusterUrl ${clusterUrl} --username ${username} --token ${token} --deployName ${deployName} --dockerRepo ${dockerRepo} --tag ${tag}
```

You can use the option --installCheck to install kubectl as part of the command

### update version

This command allows you to update the adf dependencies and js-api with different versions

Update adf libs and js-api with latest alpha

```bash
adf-cli update-version --alpha --pathPackage "$(pwd)"
```

Update adf libs and js-api with latest beta

```bash
adf-cli update-version --beta --pathPackage "$(pwd)"
```

Update adf libs and js-api with latest

```bash
adf-cli update-version --latest --pathPackage "$(pwd)"
```

Update only adf libs with a specific version

```bash
adf-cli update-version --version "3.2.0-fa5916ff413131513c3e382d7f27dd9b4cfa0e7e" --pathPackage "$(pwd)"
```

Update only js-api with a specific version

```bash
adf-cli update-version --vjs "3.2.0-fa5916ff413131513c3e382d7f27dd9b4cfa0e7e" --pathPackage "$(pwd)"
```

Update adf libs and js-api with latest alpha locally

```bash
adf-cli update-version --alpha --pathPackage "$(pwd)" --skipGnu
```

### Update commit sha

This command allows you to update the commit sha as part of the `package.json`.
Your `package.json` must to have an existing property called "commit"

```bash
adf-cli update-commit-sha --pathProject "$(pwd)"
```

You can use the option --pointer to chose a different pointer from the default HEAD.

```bash
adf-cli update-commit-sha --pointer "HEAD~1" --pathProject "$(pwd)"
```

Run command locally
```bash
adf-cli update-commit-sha --pathProject "$(pwd)" --skipGnu
```

### Initialize activiti cloud env

The following command is in charge of Initializing the activiti cloud env with the default apps:

```bash
adf-cli init-aae-env --host "gateway_env"  --oauth "identity_env" --identityHost "identity_env" --modelerUsername "modelerusername" --modelerPassword "modelerpassword" --devopsUsername "devopsusername" --devopsPassword "devopspassword" 
```

If you want to add a new app the schema needs to be:

```text
TEST_APP: {
        name: 'testapp',
        file_location: 'https://github.com/Alfresco/alfresco-ng2-components/blob/branch/e2e/resources/testapp.zip?raw=true',
        security: [
            {'role': 'APS_ADMIN', 'groups': ['myadmingroup'], 'users': ['myadminuser']},
            {'role': 'APS_USER', 'groups': ['myusergroup'], 'users': ['myuser']
        }]
    },
```
