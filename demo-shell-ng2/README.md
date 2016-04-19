
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

- [Alfresco Docker image with CORS support](https://github.com/wabson/alfresco-docker-cors)

## Start development

Install the npm packages described in the `package.json` and verify that it works:

```bash
$ npm install
$ npm run build.dev
```
You're ready to write your application.

Remember the npm scripts in `package.json`:

## Development

* To runs the compiler and a server at the same time, both in "watch mode"

    ```$ npm start```
    
* To runs the test

    ```$ npm test```

* To runs the TypeScript compiler once

    ```$ npm run tsc```

* To runs the TypeScript compiler in watch mode; the process keeps running, awaiting changes to TypeScript files and re-compiling when it sees them

    ```$ npm run tsc:w```

* To runs the [lite-server](https://www.npmjs.com/package/lite-server), a light-weight, static file server, written and maintained by [John Papa](https://github.com/johnpapa) and [Christopher Martin](https://github.com/cgmartin) with excellent support for Angular apps that use routing.
   
    ```$ npm run lite```

* To runs the typings tool
    
    ```$ npm run typings```

* called by *npm* automatically *after* it successfully completes package installation. This script installs the TypeScript definition files this app requires
    
    ```$ npm run postinstall```
