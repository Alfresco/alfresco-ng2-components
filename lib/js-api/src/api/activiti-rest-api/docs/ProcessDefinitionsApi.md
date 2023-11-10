# ProcessdefinitionsApi

All URIs are relative to */activiti-app/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createIdentityLink**](ProcessDefinitionsApi.md#createIdentityLink) | **POST** /enterprise/process-definitions/{processDefinitionId}/identitylinks | Add a user or group involvement to a process definition
[**deleteIdentityLink**](ProcessDefinitionsApi.md#deleteIdentityLink) | **DELETE** /enterprise/process-definitions/{processDefinitionId}/identitylinks/{family}/{identityId} | Remove a user or group involvement from a process definition
[**getIdentityLinkType**](ProcessDefinitionsApi.md#getIdentityLinkType) | **GET** /enterprise/process-definitions/{processDefinitionId}/identitylinks/{family}/{identityId} | Get a user or group involvement with a process definition
[**getIdentityLinksForFamily**](ProcessDefinitionsApi.md#getIdentityLinksForFamily) | **GET** /enterprise/process-definitions/{processDefinitionId}/identitylinks/{family} | List either the users or groups involved with a process definition
[**getIdentityLinks**](ProcessDefinitionsApi.md#getIdentityLinks) | **GET** /enterprise/process-definitions/{processDefinitionId}/identitylinks | List the users and groups involved with a process definition
[**getProcessDefinitionDecisionTables**](ProcessDefinitionsApi.md#getProcessDefinitionDecisionTables) | **GET** /enterprise/process-definitions/{processDefinitionId}/decision-tables | List the decision tables associated with a process definition
[**getProcessDefinitionForms**](ProcessDefinitionsApi.md#getProcessDefinitionForms) | **GET** /enterprise/process-definitions/{processDefinitionId}/forms | List the forms associated with a process definition
[**getProcessDefinitionStartForm**](ProcessDefinitionsApi.md#getProcessDefinitionStartForm) | **GET** /enterprise/process-definitions/{processDefinitionId}/start-form | Retrieve the start form for a process definition
[**getProcessDefinitions**](ProcessDefinitionsApi.md#getProcessDefinitions) | **GET** /enterprise/process-definitions | Retrieve a list of process definitions
[**getRestFieldValues**](ProcessDefinitionsApi.md#getRestFieldValues) | **GET** /enterprise/process-definitions/{processDefinitionId}/start-form-values/{field} | Retrieve field values (eg. the typeahead field)
[**getRestTableFieldValues**](ProcessDefinitionsApi.md#getRestTableFieldValues) | **GET** /enterprise/process-definitions/{processDefinitionId}/start-form-values/{field}/{column} | Retrieve field values (eg. the table field)


<a name="createIdentityLink"></a>
# **createIdentityLink**
> IdentityLinkRepresentation createIdentityLink(processDefinitionIdidentityLinkRepresentation)

Add a user or group involvement to a process definition

### Example

```javascript
import ProcessdefinitionsApi from 'src/api/activiti-rest-api/docs/ProcessDefinitionsApi';
import {AlfrescoApi} from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let processdefinitionsApi = new ProcessdefinitionsApi(this.alfrescoApi);


processdefinitionsApi.createIdentityLink(processDefinitionIdidentityLinkRepresentation).then((data) => {
    console.log('API called successfully. Returned data: ' + data);
}, function (error) {
    console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **processDefinitionId** | **string**| processDefinitionId | 
 **identityLinkRepresentation** | [**IdentityLinkRepresentation**](IdentityLinkRepresentation.md)| identityLinkRepresentation | 

### Return type

[**IdentityLinkRepresentation**](IdentityLinkRepresentation.md)

<a name="deleteIdentityLink"></a>
# **deleteIdentityLink**
> deleteIdentityLink(processDefinitionIdfamilyidentityId)

Remove a user or group involvement from a process definition

### Example

```javascript
import ProcessdefinitionsApi from 'src/api/activiti-rest-api/docs/ProcessDefinitionsApi';
import {AlfrescoApi} from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let processdefinitionsApi = new ProcessdefinitionsApi(this.alfrescoApi);


processdefinitionsApi.deleteIdentityLink(processDefinitionIdfamilyidentityId).then(() => {
    console.log('API called successfully.');
}, function (error) {
    console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **processDefinitionId** | **string**| Process definition ID | 
 **family** | **string**| Identity type | 
 **identityId** | **string**| User or group ID | 

### Return type

null (empty response body)

<a name="getIdentityLinkType"></a>
# **getIdentityLinkType**
> IdentityLinkRepresentation getIdentityLinkType(processDefinitionIdfamilyidentityId)

Get a user or group involvement with a process definition

### Example

```javascript
import ProcessdefinitionsApi from 'src/api/activiti-rest-api/docs/ProcessDefinitionsApi';
import {AlfrescoApi} from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let processdefinitionsApi = new ProcessdefinitionsApi(this.alfrescoApi);


processdefinitionsApi.getIdentityLinkType(processDefinitionIdfamilyidentityId).then((data) => {
    console.log('API called successfully. Returned data: ' + data);
}, function (error) {
    console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **processDefinitionId** | **string**| Process definition ID | 
 **family** | **string**| Identity type | 
 **identityId** | **string**| User or group ID | 

### Return type

[**IdentityLinkRepresentation**](IdentityLinkRepresentation.md)

<a name="getIdentityLinksForFamily"></a>
# **getIdentityLinksForFamily**
> IdentityLinkRepresentation getIdentityLinksForFamily(processDefinitionIdfamily)

List either the users or groups involved with a process definition

### Example

```javascript
import ProcessdefinitionsApi from 'src/api/activiti-rest-api/docs/ProcessDefinitionsApi';
import {AlfrescoApi} from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let processdefinitionsApi = new ProcessdefinitionsApi(this.alfrescoApi);


processdefinitionsApi.getIdentityLinksForFamily(processDefinitionIdfamily).then((data) => {
    console.log('API called successfully. Returned data: ' + data);
}, function (error) {
    console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **processDefinitionId** | **string**| processDefinitionId | 
 **family** | **string**| Identity type | 

### Return type

[**IdentityLinkRepresentation**](IdentityLinkRepresentation.md)

<a name="getIdentityLinks"></a>
# **getIdentityLinks**
> IdentityLinkRepresentation getIdentityLinks(processDefinitionId)

List the users and groups involved with a process definition

### Example

```javascript
import ProcessdefinitionsApi from 'src/api/activiti-rest-api/docs/ProcessDefinitionsApi';
import {AlfrescoApi} from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let processdefinitionsApi = new ProcessdefinitionsApi(this.alfrescoApi);


processdefinitionsApi.getIdentityLinks(processDefinitionId).then((data) => {
    console.log('API called successfully. Returned data: ' + data);
}, function (error) {
    console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **processDefinitionId** | **string**| processDefinitionId | 

### Return type

[**IdentityLinkRepresentation**](IdentityLinkRepresentation.md)

<a name="getProcessDefinitionDecisionTables"></a>
# **getProcessDefinitionDecisionTables**
> ResultListDataRepresentationRuntimeDecisionTableRepresentation getProcessDefinitionDecisionTables(processDefinitionId)

List the decision tables associated with a process definition

### Example

```javascript
import ProcessdefinitionsApi from 'src/api/activiti-rest-api/docs/ProcessDefinitionsApi';
import {AlfrescoApi} from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let processdefinitionsApi = new ProcessdefinitionsApi(this.alfrescoApi);


processdefinitionsApi.getProcessDefinitionDecisionTables(processDefinitionId).then((data) => {
    console.log('API called successfully. Returned data: ' + data);
}, function (error) {
    console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **processDefinitionId** | **string**| processDefinitionId | 

### Return type

[**ResultListDataRepresentationRuntimeDecisionTableRepresentation**](ResultListDataRepresentationRuntimeDecisionTableRepresentation.md)

<a name="getProcessDefinitionForms"></a>
# **getProcessDefinitionForms**
> ResultListDataRepresentationRuntimeFormRepresentation getProcessDefinitionForms(processDefinitionId)

List the forms associated with a process definition

### Example

```javascript
import ProcessdefinitionsApi from 'src/api/activiti-rest-api/docs/ProcessDefinitionsApi';
import {AlfrescoApi} from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let processdefinitionsApi = new ProcessdefinitionsApi(this.alfrescoApi);


processdefinitionsApi.getProcessDefinitionForms(processDefinitionId).then((data) => {
    console.log('API called successfully. Returned data: ' + data);
}, function (error) {
    console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **processDefinitionId** | **string**| processDefinitionId | 

### Return type

[**ResultListDataRepresentationRuntimeFormRepresentation**](ResultListDataRepresentationRuntimeFormRepresentation.md)

<a name="getProcessDefinitionStartForm"></a>
# **getProcessDefinitionStartForm**
> FormDefinitionRepresentation getProcessDefinitionStartForm(processDefinitionId)

Retrieve the start form for a process definition

### Example

```javascript
import ProcessdefinitionsApi from 'src/api/activiti-rest-api/docs/ProcessDefinitionsApi';
import {AlfrescoApi} from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let processdefinitionsApi = new ProcessdefinitionsApi(this.alfrescoApi);

processdefinitionsApi.getProcessDefinitionStartForm(processDefinitionId).then((data) => {
    console.log('API called successfully. Returned data: ' + data);
}, function (error) {
    console.error(error);
});

```

### Parameters
This endpoint does not need any parameter.

### Return type

[**FormDefinitionRepresentation**](FormDefinitionRepresentation.md)

<a name="getProcessDefinitions"></a>
# **getProcessDefinitions**
> ResultListDataRepresentationProcessDefinitionRepresentation getProcessDefinitions(opts)

Retrieve a list of process definitions

Get a list of process definitions (visible within the tenant of the user)

### Example

```javascript
import ProcessdefinitionsApi from 'src/api/activiti-rest-api/docs/ProcessDefinitionsApi';
import {AlfrescoApi} from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let processdefinitionsApi = new ProcessdefinitionsApi(this.alfrescoApi);

let opts = {
    'latest': true //  | latest
    'appDefinitionId': 789 //  | appDefinitionId
    'deploymentId': deploymentId_example //  | deploymentId
};

processdefinitionsApi.getProcessDefinitions(opts).then((data) => {
    console.log('API called successfully. Returned data: ' + data);
}, function (error) {
    console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **latest** | **boolean**| latest | [optional] 
 **appDefinitionId** | **number**| appDefinitionId | [optional] 
 **deploymentId** | **string**| deploymentId | [optional] 

### Return type

[**ResultListDataRepresentationProcessDefinitionRepresentation**](ResultListDataRepresentationProcessDefinitionRepresentation.md)

<a name="getRestFieldValues"></a>
# **getRestFieldValues**
> FormValueRepresentation getRestFieldValues()

Retrieve field values (eg. the typeahead field)

### Example

```javascript
import ProcessdefinitionsApi from 'src/api/activiti-rest-api/docs/ProcessDefinitionsApi';
import {AlfrescoApi} from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let processdefinitionsApi = new ProcessdefinitionsApi(this.alfrescoApi);

processdefinitionsApi.getRestFieldValues().then((data) => {
    console.log('API called successfully. Returned data: ' + data);
}, function (error) {
    console.error(error);
});

```

### Parameters
This endpoint does not need any parameter.

### Return type

[**FormValueRepresentation**](FormValueRepresentation.md)

<a name="getRestTableFieldValues"></a>
# **getRestTableFieldValues**
> FormValueRepresentation getRestTableFieldValues()

Retrieve field values (eg. the table field)

### Example

```javascript
import ProcessdefinitionsApi from 'src/api/activiti-rest-api/docs/ProcessDefinitionsApi';
import {AlfrescoApi} from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let processdefinitionsApi = new ProcessdefinitionsApi(this.alfrescoApi);

processdefinitionsApi.getRestTableFieldValues().then((data) => {
    console.log('API called successfully. Returned data: ' + data);
}, function (error) {
    console.error(error);
});

```

### Parameters
This endpoint does not need any parameter.

### Return type

[**FormValueRepresentation**](FormValueRepresentation.md)

