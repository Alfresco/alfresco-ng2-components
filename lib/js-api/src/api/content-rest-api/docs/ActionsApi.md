# ActionsApi

All URIs are relative to *https://localhost/alfresco/api/-default-/public/alfresco/versions/1*

| Method                          | HTTP request                                     | Description                                  |
|---------------------------------|--------------------------------------------------|----------------------------------------------|
| [actionDetails](#actionDetails) | **GET** /action-definitions/{actionDefinitionId} | Retrieve the details of an action definition |
| [actionExec](#actionExec)       | **POST** /action-executions                      | Execute an action                            |
| [listActions](#listActions)     | **GET** /action-definitions                      | Retrieve list of available actions           |
| [nodeActions](#nodeActions)     | **GET** /nodes/{nodeId}/action-definitions       | Retrieve actions for a node                  |


## actionDetails

Retrieve the details of an action definition

> this endpoint is available in **Alfresco 5.2** and newer versions.

**Parameters**

| Name                   | Type   | Description                             |
|------------------------|--------|-----------------------------------------|
| **actionDefinitionId** | string | The identifier of an action definition. | 

**Return type**: [ActionDefinitionEntry](#ActionDefinitionEntry)

**Example**

```javascript
import { AlfrescoApi, ActionsApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const actionsApi = new ActionsApi(alfrescoApi);

actionsApi.actionDetails(`<actionDefinitionId>`).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
});
```

## actionExec

Execute an action

> this endpoint is available in **Alfresco 5.2** and newer versions.

Executes an action

An action may be executed against a node specified by **targetId**. For example:

```json
{
  "actionDefinitionId": "copy",
  "targetId": "4c4b3c43-f18b-43ff-af84-751f16f1ddfd",
  "params": {
  	"destination-folder": "34219f79-66fa-4ebf-b371-118598af898c"
  }
}
```

Performing a POST with the request body shown above will result in the node identified by targetId
being copied to the destination folder specified in the params object by the key destination-folder.

**targetId** is optional, however, currently **targetId** must be a valid node ID.
In the future, actions may be executed against different entity types or
executed without the need for the context of an entity.

Parameters supplied to the action within the params object will be converted to the expected type,
where possible using the DefaultTypeConverter class. In addition:

* Node IDs may be supplied in their short form (implicit `workspace://SpacesStore` prefix)
* Aspect names may be supplied using their short form, e.g. `cm:versionable` or `cm:auditable`

In this example, we add the aspect `cm:versionable` to a node using the QName resolution mentioned above:

```json
{
  "actionDefinitionId": "add-features",
  "targetId": "16349e3f-2977-44d1-93f2-73c12b8083b5",
  "params": {
  	"aspect-name": "cm:versionable"
  }
}
```

The actionDefinitionId is the id of an action definition as returned by
the _list actions_ operations (e.g. `GET /action-definitions`).

The action will be executed **asynchronously** with a 202 HTTP response signifying that
the request has been accepted successfully. The response body contains the unique ID of the action
pending execution. The ID may be used, for example to correlate an execution with output in the server logs.

**Parameters**

| Name           | Type                              | Description              |
|----------------|-----------------------------------|--------------------------|
| actionBodyExec | [ActionBodyExec](#ActionBodyExec) | Action execution details | 

**Return type**: [ActionExecResultEntry](#ActionExecResultEntry)

**Example**

```javascript
import { AlfrescoApi, ActionsApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const actionsApi = new ActionsApi(alfrescoApi);
const actionBodyExec = {};

actionsApi.actionExec(actionBodyExec).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
});
```

## listActions

Retrieve list of available actions

> this endpoint is available in **Alfresco 5.2.2** and newer versions.

The default sort order for the returned list is for actions to be sorted by ascending name.
You can override the default by using the **orderBy** parameter.

You can use any of the following fields to order the results:

* name
* title

**Parameters**

| Name           | Type     | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                      | Notes          |
|----------------|----------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------|
| opts.skipCount | number   | The number of entities that exist in the collection before those included in this list. If not supplied then the default value is 0.                                                                                                                                                                                                                                                                                                                             | default to 0   |
| opts.maxItems  | number   | The maximum number of items to return in the list. If not supplied then the default value is 100.                                                                                                                                                                                                                                                                                                                                                                | default to 100 |
| opts.orderBy   | string[] | A string to control the order of the entities returned in a list. You can use the **orderBy** parameter to sort the list by one or more fields. Each field has a default sort order, which is normally ascending order. Read the API method implementation notes above to check if any fields used in this method have a descending default search order. To sort the entities in a specific order, you can use the **ASC** and **DESC** keywords for any field. |                |
| opts.fields    | string[] | A list of field names. You can use this parameter to restrict the fields returned within a response if, for example, you want to save on overall bandwidth. The list applies to a returned individual entity or entries within a collection. If the API method also supports the **include** parameter, then the fields specified in the **include** parameter are returned in addition to those specified in the **fields** parameter.                          |                | 

**Return type**: [ActionDefinitionList](#ActionDefinitionList)

**Example**

```javascript
import { AlfrescoApi, ActionsApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const actionsApi = new ActionsApi(alfrescoApi);
const opts = {};

actionsApi.listActions(opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
});
```

## nodeActions

Retrieve actions for a node

> this endpoint is available in Alfresco 5.2 and newer versions.

The default sort order for the returned list is for actions to be sorted by ascending name.
You can override the default by using the **orderBy** parameter.

You can use any of the following fields to order the results:

* name
* title

**Parameters**

| Name           | Type      | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                      | Notes          |
|----------------|-----------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------|
| **nodeId**     | string    | The identifier of a node.                                                                                                                                                                                                                                                                                                                                                                                                                                        | 
| opts.skipCount | number    | The number of entities that exist in the collection before those included in this list. If not supplied then the default value is 0.                                                                                                                                                                                                                                                                                                                             | default to 0   |
| opts.maxItems  | number    | The maximum number of items to return in the list. If not supplied then the default value is 100.                                                                                                                                                                                                                                                                                                                                                                | default to 100 |
| opts.orderBy   | string[]  | A string to control the order of the entities returned in a list. You can use the **orderBy** parameter to sort the list by one or more fields. Each field has a default sort order, which is normally ascending order. Read the API method implementation notes above to check if any fields used in this method have a descending default search order. To sort the entities in a specific order, you can use the **ASC** and **DESC** keywords for any field. |                | 
| opts.fields    | string [] | A list of field names. You can use this parameter to restrict the fields returned within a response if, for example, you want to save on overall bandwidth. The list applies to a returned individual entity or entries within a collection. If the API method also supports the **include** parameter, then the fields specified in the **include** parameter are returned in addition to those specified in the **fields** parameter.                          |                |

**Return type**: [ActionDefinitionList](#ActionDefinitionList)

**Example**

```javascript
import { AlfrescoApi, ActionsApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const actionsApi = new ActionsApi(alfrescoApi);
const opts = {};

actionsApi.nodeActions(`<nodeId>`, opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
});
```

# Models

## ActionBodyExec

**Properties**

| Name                   | Type   | Description                                                                  |
|------------------------|--------|------------------------------------------------------------------------------|
| **actionDefinitionId** | string |                                                                              |
| targetId               | string | The entity upon which to execute the action, typically a node ID or similar. |
| params                 | any    |                                                                              |

## ActionDefinitionEntry

**Properties**

| Name      | Type                                  |
|-----------|---------------------------------------|
| **entry** | [ActionDefinition](#ActionDefinition) |

## ActionDefinition

**Properties**

| Name                 | Type                                                      | Description                                                                               |
|----------------------|-----------------------------------------------------------|-------------------------------------------------------------------------------------------|
| **id**               | string                                                    | Identifier of the action definition — used for example when executing an action           |
| name                 | string                                                    | name of the action definition, e.g. "move"                                                |
| title                | string                                                    | title of the action definition, e.g. "Move"                                               |
| description          | string                                                    | describes the action definition, e.g. "This will move the matched item to another space." |
| **applicableTypes**  | string[]                                                  | QNames of the types this action applies to                                                |
| **trackStatus**      | boolean                                                   | whether the basic action definition supports action tracking or not                       |
| parameterDefinitions | [ActionParameterDefinition[]](#ActionParameterDefinition) |                                                                                           |

## ActionParameterDefinition

**Properties**

| Name         | Type    |
|--------------|---------|
| name         | string  |
| type         | string  |
| multiValued  | boolean |
| mandatory    | boolean |
| displayLabel | string  |

## ActionExecResultEntry

**Properties**

| Name      | Type                                  |
|-----------|---------------------------------------|
| **entry** | [ActionExecResult](#ActionExecResult) |

## ActionExecResult

**Properties**

| Name   | Type   | Description                                           |
|--------|--------|-------------------------------------------------------|
| **id** | string | The unique identifier of the action pending execution |

## ActionDefinitionList

**Properties**

| Name | Type                                                  |
|------|-------------------------------------------------------|
| list | [ActionDefinitionListList](#ActionDefinitionListList) |

## ActionDefinitionListList

**Properties**

| Name       | Type                                    |
|------------|-----------------------------------------|
| pagination | [Pagination](Pagination.md)             |
| entries    | [ActionDefinition[]](#ActionDefinition) |


