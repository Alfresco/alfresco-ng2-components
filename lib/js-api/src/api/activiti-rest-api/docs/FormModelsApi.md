# Form Models Api

All URIs are relative to */activiti-app/api*

| Method                                  | HTTP request                                                            | Description                 |
|-----------------------------------------|-------------------------------------------------------------------------|-----------------------------|
| [getFormEditorJson](#getFormEditorJson) | **GET** /enterprise/forms/{formId}/editorJson                           | Get form content            |
| [getFormHistory](#getFormHistory)       | **GET** /enterprise/editor/form-models/{formId}/history/{formHistoryId} | Get form history            |
| [getForm](#getForm)                     | **GET** /enterprise/editor/form-models/{formId}                         | Get a form model            |
| [getForm](#getForm)                     | **GET** /enterprise/forms/{formId}                                      | Get a form                  |
| [getForms](#getForms)                   | **GET** /enterprise/editor/form-models/values                           | Get forms                   |
| [getForms](#getForms)                   | **GET** /enterprise/editor/form-models                                  | List form models            |
| [getForms](#getForms)                   | **GET** /enterprise/forms                                               | Query forms                 |
| [saveForm](#saveForm)                   | **PUT** /enterprise/editor/form-models/{formId}                         | Update form model content   |
| [validateModel](#validateModel)         | **PUT** /enterprise/editor/form-models/{formId}/validate                | Validate form model content |


# **getFormEditorJson**

Get form content

**Parameters**

| Name       | Type       | Description |
|------------|------------|-------------|
| **formId** | **number** | formId      | 

**Return type**: [FormDefinitionRepresentation](FormDefinitionRepresentation.md)

**Example**

```javascript
import {AlfrescoApi, FormModelsApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*...*/);
const formModelsApi = new FormModelsApi(alfrescoApi);

formModelsApi.getFormEditorJson(formId).then((data) => {
    console.log('API called successfully. Returned data: ' + data);
});
```

# **getFormHistory**

Get form history

**Parameters**

| Name              | Type   | Description   |
|-------------------|--------|---------------|
| **formId**        | number | formId        | 
| **formHistoryId** | number | formHistoryId | 

**Return type**: [FormRepresentation](FormRepresentation.md)

**Example**

```javascript
import { AlfrescoApi, FormModelsApi} from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*...*/);
const formModelsApi = new FormModelsApi(alfrescoApi);

formModelsApi.getFormHistory(formIdformHistoryId).then((data) => {
    console.log('API called successfully. Returned data: ' + data);
});
```

# **getForm**

Get a form model

**Parameters**

| Name       | Type   | Description |
|------------|--------|-------------|
| **formId** | number | formId      | 

**Return type**: [FormRepresentation](FormRepresentation.md)

**Example**

```javascript
import { AlfrescoApi, FormModelsApi} from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*...*/);
const formModelsApi = new FormModelsApi(alfrescoApi);

formModelsApi.getForm(formId).then((data) => {
    console.log('API called successfully. Returned data: ' + data);
});
```

# **getForms**

Get forms

**Parameters**

| Name       | Type   | Description |
|------------|--------|-------------|
| **formId** | string | formId      | 

**Return type**: [**FormRepresentation**](FormRepresentation.md)

**Example**

```javascript
import { AlfrescoApi, FormModelsApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*...*/);
const formModelsApi = new FormModelsApi(alfrescoApi);

formModelsApi.getForms(formId).then((data) => {
    console.log('API called successfully. Returned data: ' + data);
});
```

# **getForms**

List form models

**Return type**: [ResultListDataRepresentationFormRepresentation](ResultListDataRepresentationFormRepresentation.md)

**Example**

```javascript
import { AlfrescoApi, FormModelsApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*...*/);
const formModelsApi = new FormModelsApi(alfrescoApi);

formModelsApi.getForms().then((data) => {
    console.log('API called successfully. Returned data: ' + data);
});
```

# **getForms**

Query forms

**Parameters**

| Name     | Type   | Description |
|----------|--------|-------------|
| nameLike | string | nameLike    | 
| appId    | number | appId       | 
| tenantId | number | tenantId    | 
| start    | number | start       |
| sort     | string | sort        | 
| order    | string | order       |
| size     | number | size        | 

**Return type**: [ResultListDataRepresentationRuntimeFormRepresentation](ResultListDataRepresentationRuntimeFormRepresentation.md)

**Example**

```javascript
import { AlfrescoApi, FormModelsApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*...*/);
const formModelsApi = new FormModelsApi(alfrescoApi);
const opts = {/*...*/};

formModelsApi.getForms(opts).then((data) => {
    console.log('API called successfully. Returned data: ' + data);
});
```

# **saveForm**

Update form model content

**Parameters**

| Name                   | Type                                                | Description              |
|------------------------|-----------------------------------------------------|--------------------------|
| **formId**             | number                                              | ID of the form to update | 
| **saveRepresentation** | [FormSaveRepresentation](FormSaveRepresentation.md) | saveRepresentation       | 

**Return type**: [FormRepresentation](FormRepresentation.md)

**Example**

```javascript
import { AlfrescoApi, FormModelsApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*...*/);
const formModelsApi = new FormModelsApi(alfrescoApi);

formModelsApi.saveForm(formIdsaveRepresentation).then((data) => {
    console.log('API called successfully. Returned data: ' + data);
});
```

# **validateModel**

Validate form model content

The model content to be validated must be specified in the POST body

**Parameters**

| Name                   | Type                                                | Description        |
|------------------------|-----------------------------------------------------|--------------------|
| **formId**             | number                                              | formId             | 
| **saveRepresentation** | [FormSaveRepresentation](FormSaveRepresentation.md) | saveRepresentation | 

**Return type**: [ValidationErrorRepresentation](ValidationErrorRepresentation.md)

**Example**

```javascript
import { AlfrescoApi, FormModelsApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*...*/);
const formModelsApi = new FormModelsApi(alfrescoApi);
const payload = {/*...*/};

formModelsApi.validateModel(payload).then((data) => {
    console.log('API called successfully. Returned data: ' + data);
});
```