---
Title: Apps Process service
Added: v2.0.0
Status: Active
Last reviewed: 2018-11-16
---

# [Apps Process service](../../../lib/process-services/src/lib/app-list/services/apps-process.service.ts "Defined in apps-process.service.ts")

Gets details of the Process Services apps that are deployed for the user.

## Class members

### Methods

-   **getApplicationDetailsById**(appId: `number`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`AppDefinitionRepresentation`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-activiti-rest-api/docs/AppDefinitionRepresentation.md)`>`<br/>
    Gets the details for a specific app ID number.
    -   _appId:_ `number`  - ID of the target app
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`AppDefinitionRepresentation`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-activiti-rest-api/docs/AppDefinitionRepresentation.md)`>` - Details of the app
-   **getDeployedApplications**(): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`AppDefinitionRepresentation`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-activiti-rest-api/docs/AppDefinitionRepresentation.md)`[]>`<br/>
    Gets a list of deployed apps for this user.
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`AppDefinitionRepresentation`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-activiti-rest-api/docs/AppDefinitionRepresentation.md)`[]>` - The list of deployed apps
-   **getDeployedApplicationsByName**(name: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`AppDefinitionRepresentation`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-activiti-rest-api/docs/AppDefinitionRepresentation.md)`>`<br/>
    Gets a list of deployed apps for this user, where the app name is `name`.
    -   _name:_ `string`  - Name of the app
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`AppDefinitionRepresentation`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-activiti-rest-api/docs/AppDefinitionRepresentation.md)`>` - The list of deployed apps

## Details

This service can be used to access the Process Services apps that are available
to the current user. You can find more information about the
returned [`AppDefinitionRepresentation`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-activiti-rest-api/docs/AppDefinitionRepresentation.md) class  in the
[Process Services Apps API](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-activiti-rest-api/docs/AppsApi.md#getAppDefinitions).
The methods of this service make use of the
[getAppDefinitions](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-activiti-rest-api/docs/AppsApi.md#getAppDefinitions)
method, also from the Apps API.
