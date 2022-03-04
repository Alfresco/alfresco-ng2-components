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
| changelog | Generate changelog report for two branches of git repository |
|check-cs-env |Check cs env is up |
|check-ps-env |Check ps env is up |
|check-plugin-env |Check plugin status |
|artifact-from-s3  |Get artifact from S3 |
|artifact-to-s3    |Get artifact to S3 |
|docker            |Build and publish a docker image or create additional tag link |
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

### Changelog

You can get command details by using `--help` argument

```bash
adf-cli changelog --help
```

The format of the command is as following:

```bash
Usage: adf-cli changelog [options]

Generate changelog report for two branches of git repository

Options:
  -v, --version          output the version number
  -r, --range <range>    Commit range, e.g. master..develop (default: "master..develop")
  -d, --dir <dir>        Working directory (default: working directory)
  -m, --max <number>     Limit the number of commits to output
  -o, --output <dir>     Output directory, will use console output if not defined
  --skip <number>        Skip number commits before starting to show the commit output
  -f, --format <format>  Output format (md, html) (default: "md")
  -e --exclude <string>  Exclude authors from the output, comma-delimited list
  -h, --help             output usage information
```

#### Usage examples

```sh
# show changelog in the console for the current directory
adf-cli changelog -r master..develop -d .

# show changelog in the console for a specific folder 
adf-cli changelog -d ~/github/alfresco-ng2-components

# generate changelog for specific folder and pipe the console output to a file
adf-cli changelog -d ~/github/alfresco-ng2-components > log.md

# generate changelog report in the default format as "changelog-X.X.X.md" and save to the current folder
adf-cli changelog -d ~/github/alfresco-ng2-components -o .  

# generate changelog report and save it to a specific folder
adf-cli changelog -d ~/github/alfresco-ng2-components -o ../reports

# generate changelog report in the HTML format and save to the current folder
adf-cli changelog -d ~/github/alfresco-ng2-components -f html -o .

# generate report in the default format and save to the current folder, reset all filters (including embedded ones for bots)
adf-cli changelog -d ~/github/alfresco-ng2-components -e ""

# generate report in the default format excluding commits made by certain authors
adf-cli changelog -d ~/github/alfresco-ng2-components -e "bot,user1,user2"
```

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

### Docker
The command provides 2 targets 'Publish' (default value) and 'Link'

Publish target
Move in the folder where you have your `Dockerfile` and run the command:

```bash
adf-cli docker --target "publish" --dockerRepo "${docker_repository}"  --dockerTags "${TAGS}"
```

If you want to specify a different docker registry you can run
```bash
--loginCheck --loginUsername "username" --loginPassword "password" --loginRepo "quay.io"--dockerRepo "${docker_repository}"  --dockerTags "${TAGS}"
```

Link target
In case you don't need to publish a new image but you would like to create a link to an already existing image (sourceTag) you can use the link target.

```bash
adf-cli docker --target "link" --dockerRepo "${docker_repository}"  --dockerTags "${TAGS}"  --sourceTag "develop"
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

### Checks plugin status

The following command is in charge of checking plugin status by given plugin name:

```bash
adf-cli check-plugin-env --host "gateway_env" --pluginName "Name of the plugin" --clientId "clientId" --appName "appName" -u "username" -p "password" 
--ui "uiName"
```

### Scan the environment

The following command will scan the environment to show various information on its current status:

```bash
adf-cli scan-env --host "https://example.com" --clientId "clientId" -u "admin" -p "password"
```
