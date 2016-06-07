
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
# docker-login is only needed the first time; after this your credentials will be cached
docker login dockerreg.alfresco.com
docker pull dockerreg.alfresco.com/platform-distribution:api-latest
docker-compose up
```
**Note:** for complete installation on Windows please review the instructions here: [Windows installation](WINDOWS.md)

to clean up afterwards

```
docker-compose rm
```

If you are using the local build you must also have configured your npm to use our private registry, where the
components are published. Currently the registry can only be accessed from Alfresco's London and Maidenhead offices.

    npm set registry http://devproducts.alfresco.me:4873

Note this is a global setting which will apply to all your npm projects. You can use `npm config delete registry` to
remove the setting once you no longer need it, or you can temporarily comment out the line in your `.npmrc` file.

### Building and running

#### Local build

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

#### Docker build

A Dockerfile is provided as part of the demo-shell. This can be used to build a local image using the current code
that you have in your development environment. The `node_modules` folder will not be copied over, instead `npm install`
is executed during the build to bring in the required dependencies from the registry, which ensures that you start from
a clean base.

Another advantage is that you do not need to have Node and npm installed locally, since these are already included with the
base image.

    docker build -t demo-shell --rm .
    docker run -it --rm --name demo-shell-ng2 -p 3000 demo-shell

When you are done testing you can remove the image that you created

    docker rmi demo-shell

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


