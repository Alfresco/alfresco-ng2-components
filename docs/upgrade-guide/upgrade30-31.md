---
Title: Upgrading from ADF v3.0 to v3.1
---

# Upgrading from ADF v3.0 to v3.1

This guide explains how to upgrade your ADF v3.0 project to work with v3.1.

Do not skip this task, if you want your application to be updated to a most recent version of ADF. Upgrades of multiple versions of ADF cannot be done in one step only, but should follow the chain of sequential updates. 

**Note:** the steps described below might involve making changes
to your code. If you are working with a versioning system then you should
commit any changes you are currently working on. If you aren't using versioning
then be sure to make a backup copy of your project before going ahead with the
upgrade.

## Library updates

### Automatic update using the Yeoman Generator

If your application has few changes from the original app created by the
[Yeoman generator](https://github.com/Alfresco/generator-ng2-alfresco-app)
then you may be able to update your project with the following steps:

1.  Update the Yeoman generator to the latest version (3.1.0). Note that
    you might need to run these commands with `sudo` on Linux or MacOS:

    ```sh
    npm uninstall -g generator-alfresco-adf-app
    npm install -g generator-alfresco-adf-app
    ```

2.  Run the new yeoman app generator:

    ```sh
    yo alfresco-adf-app
    ```

3.  Clean your old distribution and dependencies by deleting the `node_modules` folder
    and the `package-lock.json` file.

4.  Install the dependencies:
    ```sh
    npm install
    ```

At this point, the generator might have overwritten some of your code where it differs from
the original generated app. Be sure to check for any differences from your project code 
(using a versioning system might make this easier) and if there are any differences,
retrofit your changes. When you have done this, you should be able to start the application
as usual:

```sh
npm run start
```

After starting the app, if everything is working fine, that's all and you don't need to do anything else. However, if things don't work as they should then recover the original version of the project and try the manual approach.

### Manual update

1.  Update the `package.json` file with the latest library versions:
    ```json
    "dependencies": {
        ...
        "@alfresco/adf-core": "3.1.0",
        "@alfresco/adf-content-services": "3.1.0",
        "@alfresco/adf-process-services-cloud": "3.1.0",
        "@alfresco/adf-insights": "3.1.0",
        "@alfresco/js-api": "3.1.0",
        ...
    ```

2.  Clean your old distribution and dependencies by deleting `node_modules` and `package-lock.json`.

3.  Reinstall your dependencies
    ```sh
    npm install
    ```