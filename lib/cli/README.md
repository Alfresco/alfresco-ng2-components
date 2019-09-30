# Alfresco ADF Cli


## The Goal of ADF CLI

The ADF CLI manages, builds , doc and test your ADF Application projects. 


## Installation
To get started  follow these instructions:

``
npm install @alfresco/adf-cli -g
``

### License Check

Move in the folder where you have your package.json and run the command:

```bash
npm install

adf-license
```
### Audit Check

Move in the folder where you have your package.json and run the command:

```bash
npm install

adf-audit
```

### Docker publish

Move in the folder where you have your Dockerfile and run the command:

```bash
adf-cli docker-publish --dockerRepo "${docker_repository}"  --dockerTags "${TAGS}" --pathProject "$(pwd)"
```

If you want to specify a different docker registry you can run
```bash
--loginCheck --loginUsername "username" --loginPassword "password" --loginRepo "quay.io"--dockerRepo "${docker_repository}"  --dockerTags "${TAGS}" --pathProject "$(pwd)"
```

### Kubectl update pod image

This command allows you to update a specific service on the rancher env with a specifig tag

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

This command allows you to update the commit sha as part of the package.json.
Your package.json must to have an existing property called "commit"

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
