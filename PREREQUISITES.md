# Prerequisites for building and running apps with the Alfresco Application Development Framework

The [Angular 2](https://angular.io/) based application development framework requires the following:

- An Alfresco Platform Repository (version [5.2.a-EA](https://wiki.alfresco.com/wiki/Community_file_list_201606-EA) or newer) to talk to, which has [CORS](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing) enabled. 
- [Download and install Activiti](https://www.alfresco.com/products/bpm/alfresco-activiti/trial)
- [Node.js](https://nodejs.org/en/) JavaScript runtime.
- [npm](https://www.npmjs.com/) package manager for JavaScript.
 
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

## Configure Nginx

To correctly configure Nginx use the following file [nginx.conf](/nginx.conf).
This will put Activiti, Alfresco and the app dev framework under the same domain.

