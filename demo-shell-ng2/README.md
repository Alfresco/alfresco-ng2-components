
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

### Building and running steps:

1 Install dependencies

```sh
npm install
```

2 Fast build and watch for dev purposes

```sh
npm start
```

>`start` script also includes live reload and watchers for all the `.ts` files.
TypeScript watchers are also configured for `node_modules` folder within demo shell
and provide live reload for all the component libraries as well.


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


