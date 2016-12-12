
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

## Installing

To correctly use this demo check that on your machine is running Node version 6.9.2 LTS or higher.


```sh
npm install
```

## Development build

```sh
npm start
```

This command compiles and starts the project in watch mode. 
Browser will automatically reload upon changes.
Upon start you can navigate to `http://localhost:3000` with your preferred browser.

## Production build

```sh
npm run build
```

This command builds broject in `production` mode. 
All output is placed to `dist` folder and can be served your preferred web server.
You should need no additional files outside the `dist` folder.

In order to quickly test the output you can use the [wsrv](https://www.npmjs.com/package/wsrv) tool (lightweight web server):

```sh
npm install -g wsrv
wsrv -s -o dist/
```

## Development branch build

If you want to run the demo shell with the latest change from the development branch, use the following command from the /script folder:

```sh
./npm-clean.sh
./start-linked.sh -install
```

## Multi-language
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


