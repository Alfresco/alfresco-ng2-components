# Prerequisites for building and running apps with the Alfresco Application Development Framework

The [Angular 2](https://angular.io/) based application development framework requires the following:

- An Alfresco Platform Repository (version [201609 Early Access](https://community.alfresco.com/docs/DOC-6372-alfresco-community-edition-file-list-201609-ea) or newer) 
- [Enable cors on Alfresco One](/ALFRESCOCORS.md)
- [Download and install Activiti](https://www.alfresco.com/products/bpm/alfresco-activiti/trial)
- [Node.js](https://nodejs.org/en/) JavaScript runtime.
- [npm](https://www.npmjs.com/) package manager for JavaScript.
- local nginx proxy to avoid cross-origin browser restrictions (see below)
- (If you use ECM and BPM together) Make sure your user has the same username and password in both system

*Note: Default username for activiti is "admin@app.activiti.com" and "admin" for Alfresco, and also the default password are different. Change them to be equal.*

**Verify that you are running at least node `v5.x.x` and npm `3.x.x`**
by running `node -v` and `npm -v` in a terminal/console window.
Older versions produce errors.

## Installing Node.js

If you don't have Node.js installed then access this [page](https://nodejs.org/en/download/) and use the appropriate installer for your OS.

Make sure the Node.js version is > 5:

```
$ node -v
v5.12.0
```

## Installing nginx

Most Linux distributions will come with nginx available to install via your
package manager and on Mac OS you can use [Homebrew](http://brew.sh/).

If you want to install manually however you can follow the instructions on the
[download page](http://nginx.org/en/download.html). See also the specific information for
[windows users](http://nginx.org/en/docs/windows.html).

### Start nginx

Start nginx using the supplied configuration in [nginx.conf](nginx.conf)

    nginx -c nginx.conf

### Review nginx configuration

To correctly configure nginx use the following file [nginx.conf](/nginx.conf).
This will host Activiti, Alfresco and the app dev framework under the same origin.

* ECM : http://localhost:8888/alfresco/
* BPM : http://localhost:8888/activiti/

To make everything work, you have to change the address of the ECM and BPM. In the demo app you can do that clicking on the top right settings menu and changing the bottom left options: *ECM host* and *BPM host*.

This configuration assumes few things:

* Port mapping:
  * nginx entry point: 0.0.0.0:8888
  * Demo Shell: locathost:3000
  * Alfresco: locathost:8080
  * Activiti: locathost:9999

All those values can be modified at their respective `location` directive on the [nginx.conf](/nginx.conf) file.

If you want to know more on how to install and configure nginx to work with the Application Development Framework can be found [here](https://community.alfresco.com/community/application-development-framework/blog/2016/09/28/adf-development-set-up-with-nginx-proxy)
