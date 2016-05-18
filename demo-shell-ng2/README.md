
<h1 align="center">Alfresco Angular 2 Components</h1>
<p align="center">
  <img title="alfresco" alt='alfresco' src='../assets/alfresco.png'  width="280px" height="150px" ></img>
  <img title="angular2" alt='angular2' src='../assets/angular2.png'  width="150px" height="150px" ></img>
</p>
<p align="center">
    <a href='https://github.com/mgechev/angular2-style-guide'>
      <img src='https://mgechev.github.io/angular2-style-guide/images/badge.svg' alt='style' />
    </a>
</p>


## Prerequisites

Docker machine with latest `platform-distribution:api-latest` image.

```
docker login dockerreg.alfresco.com
docker pull dockerreg.alfresco.com/platform-distribution:api-latest
docker-compose up
```
**Note:** for complete installation on Windows please review the instructions here: [Windows installation](WINDOWS.md)

to clean up afterwards

```
docker-compose rm
```

### Configuring development environment

*All scripts assume you are at the project root folder*

**Install symlinks for Alfresco components**

**On Linux, you may need to use sudo cmd or add user write permissions to /usr/lib/node_modules**

*ng2-alfresco-core:*

```sh
npm link ../ng2-components/ng2-alfresco-core
```

*ng2-alfresco-datatable component:*

```sh
npm link ../ng2-components/ng2-alfresco-datatable
```

*ng2-alfresco-documentlist component:*

```sh
npm link ../ng2-components/ng2-alfresco-documentlist
```

*ng2-alfresco-login component:*

```sh
npm link ../ng2-components/ng2-alfresco-login
```

*ng2-alfresco-upload component:*

```sh
npm link ../ng2-components/ng2-alfresco-upload
```

*dev-platform-js-api client:*

```sh
npm link ../../dev-platform-js-api
```

Please refer to [this article](https://docs.npmjs.com/cli/link) for more details on npm link.

### Building and running

**Install dependencies:**

```sh
cd dev-platform-webcomponents/demo-shell-ng2/
npm install
```

**(Option 1) Fast build and watch for dev purposes:**

```sh
npm start
```

**(Option 2) Build and watch with Gulp:**

```sh
npm run build.dev
```

*or*

```sh
gulp dev
```


###Multi-language
To support a new language you need to create your language file (.json) and add it to `i18n/` folder.

```json
{
        "username" : "Username",
        "input-required-message": "Required",
        "input-min-message": "Your username needs to be at least 4 characters.",
        "login-button": "Login"
}
```

Directory structure:
```
.
├── i18n/
│   ├── en.json
│   ├── it.json
│   └── fr.json
```


