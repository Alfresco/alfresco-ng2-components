# Apps Process service

Gets details of the Process Services apps that are deployed for the user.

## Methods

`getDeployedApplications(): Observable<AppDefinitionRepresentation[]>`<br/>
Gets a list of deployed apps for this user.

`getDeployedApplicationsByName(name: string): Observable<AppDefinitionRepresentation>`<br/>
Gets a list of deployed apps for this user, where the app name is `name`.

`getApplicationDetailsById(appId: number): Observable<AppDefinitionRepresentation>`<br/>
Get the details for a specific app ID number.

## Details

This service can be used to access the Process Services apps that are available
to the current user. You can find more information about the
returned `AppDefinitionRepresentation` class in the [Filter model page](filter.model.md)
and in the
[Process Services Apps API](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-activiti-rest-api/docs/AppsApi.md#getAppDefinitions).
The methods of this service make use of the
[getAppDefinitions](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-activiti-rest-api/docs/AppsApi.md#getAppDefinitions)
method, also from the Apps API.

<!-- Don't edit the See also section. Edit seeAlsoGraph.json and run config/generateSeeAlso.js -->
<!-- seealso start -->
## See also

- [Filter model](filter.model.md)
<!-- seealso end -->