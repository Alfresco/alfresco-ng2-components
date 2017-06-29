# Prerequisites for building and running apps with the Alfresco Application Development Framework

The [Angular 2](https://angular.io/) based application development framework requires the following:

- An Alfresco Platform Repository (version [201609 Early Access](https://community.alfresco.com/docs/DOC-6372-alfresco-community-edition-file-list-201609-ea) or newer) 
- [Download and install Activiti](https://www.alfresco.com/products/bpm/alfresco-activiti/trial)
- [Node.js](https://nodejs.org/en/) JavaScript runtime.
- [npm](https://www.npmjs.com/) package manager for JavaScript.
- (If you use ECM and BPM together) Make sure your user has the same username and password in both system
- [If you are experiencing CORS problem read this guide](/ALFRESCOCORS.md)

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
