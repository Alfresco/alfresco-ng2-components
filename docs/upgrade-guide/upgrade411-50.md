---
Title: Upgrading from ADF v4.11 to v5.0
---

# Upgrading from ADF v4.11 to v5.0

This guide explains how to upgrade your ADF v4.11 project to work with v5.0.

Do not skip this task, if you want your application to be updated to a most recent version of ADF. 
Upgrades of multiple versions of ADF cannot be done in one step only, but should follow the chain of sequential updates. 

**Note:** the steps described below might involve making changes
to your code. If you are working with a versioning system then you should
commit any changes you are currently working on. If you aren't using versioning
then be sure to make a backup copy of your project before going ahead with the
upgrade.


### Manual update

1.  Update the `package.json` file with the latest library versions:
    ```json
    "dependencies": {
        "@alfresco/adf-core": "5.0.0",
        "@alfresco/adf-content-services": "5.0.0",
        "@alfresco/adf-process-services-cloud": "5.0.0",
        "@alfresco/adf-insights": "5.0.0",
        "@alfresco/js-api": "5.0.0",
    }
    ```

2.  Clean your old distribution and dependencies by deleting `node_modules` and `package-lock.json`.

3.  This is a major release of the Alfresco Application Development Framework containing upgrade to Angular 14.
    With the current upgrade of the Angular framework, the suggested stack has also being updated:

    | Name | Version | 
    | --- | --- | 
    | Node | 14.15.0 |
    | npm | 6.14.8 |
    | Angular | 14 |
    | Typescript | 4.6 |

    For a complete list of changes, supported browsers and new feature please refer to the official documentation

    | Angular version | link |
    | --- | --- |
    | v11 | [Changes & Deprecations](https://v11.angular.io/guide/updating-to-version-11)|
    | v12 | [Changes & Deprecations](https://v12.angular.io/guide/updating-to-version-12)|
    | v13 | [Changes & Deprecations](https://v13.angular.io/guide/update-to-latest-version)|
    | v14 | [Changes & Deprecations](https://angular.io/guide/update-to-latest-version) |

    ## Upgrade

    To migrate custom code and application to Angular 14, please refer to the [offcial documentation](https://angular.io/).

    **Note:**: Consider the possibility of leveraging [ADF v5.0.0-angular.13.2](https://www.npmjs.com/package/@alfresco/adf-core/v/5.0.0-angular.13.2),
    a version of ADF compatible with Angular 13 that is meant to be used as intermediate step towards ADF v5. with angular v14.
    
4.  A breaking change worth mentioning is related to style import. with ADF v5.0.0 an extra `/lib` is required.


    **example**:

    previous versions of ADF : `@import '~@alfresco/adf-core/prebuilt-themes/adf-blue-orange.css';`
    
    starting ADF 5.0.0 : `@import '~@alfresco/adf-core/lib/prebuilt-themes/adf-blue-orange.css';`


5.  Reinstall your dependencies
    ```sh
    npm install
    ```
    
6.  Run the application
    ```sh
    npm start
    ```
