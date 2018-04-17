---
Added: v2.0.0
Status: Active
Last reviewed: 2018-04-05
---

# Apps Process service

Gets details of the Process Services apps that are deployed for the user.

## Class members

### Methods

-   `getApplicationDetailsById(appId: number = null): Observable<AppDefinitionRepresentation>`<br/>
    Gets the details for a specific app ID number.
    -   `appId: number = null` -  ID of the target app
    -   **Returns** `Observable<AppDefinitionRepresentation>` - Details of the app
-   `getDeployedApplications(): Observable<AppDefinitionRepresentation[]>`<br/>
    Gets a list of deployed apps for this user.
    -   **Returns** `Observable<AppDefinitionRepresentation[]>` - The list of deployed apps
-   `getDeployedApplicationsByName(name: string = null): Observable<AppDefinitionRepresentation>`<br/>
    Gets a list of deployed apps for this user, where the app name is \`name\`.
    -   `name: string = null` -  Name of the app
    -   **Returns** `Observable<AppDefinitionRepresentation>` - The list of deployed apps

## Details

This service can be used to access the Process Services apps that are available
to the current user. You can find more information about the
returned `AppDefinitionRepresentation` class in the
[Filter model page](../process-services/filter.model.md)
and in the
[Process Services Apps API](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-activiti-rest-api/docs/AppsApi.md#getAppDefinitions).
The methods of this service make use of the
[getAppDefinitions](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-activiti-rest-api/docs/AppsApi.md#getAppDefinitions)
method, also from the Apps API.

## See also

-   [Filter model](../process-services/filter.model.md)
