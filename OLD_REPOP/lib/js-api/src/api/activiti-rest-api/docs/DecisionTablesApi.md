# DecisionTablesApi

All URIs are relative to */activiti-app/api*

| Method                                                    | HTTP request                                                               | Description                         |
|-----------------------------------------------------------|----------------------------------------------------------------------------|-------------------------------------|
| [getDecisionTableEditorJson](#getDecisionTableEditorJson) | **GET** /enterprise/decisions/decision-tables/{decisionTableId}/editorJson | Get definition for a decision table |
| [getDecisionTable](#getDecisionTable)                     | **GET** /enterprise/decisions/decision-tables/{decisionTableId}            | Get a decision table                |
| [getDecisionTables](#getDecisionTables)                   | **GET** /enterprise/decisions/decision-tables                              | Query decision tables               |

# getDecisionTableEditorJson

Get definition for a decision table

**Parameters**

| Name                | Type   |
|---------------------|--------|
| **decisionTableId** | number |

**Return type**: [JsonNode](#JsonNode)

**Example**

```javascript
import { AlfrescoApi, DecisionTablesApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const decisionTablesApi = new DecisionTablesApi(alfrescoApi);
const decisionTableId = 0;

decisionTablesApi.getDecisionTableEditorJson(decisionTableId).then((data) => {
    console.log('API called successfully. Returned data: ' + data);
});
```

# getDecisionTable

Get a decision table

**Parameters**

| Name                | Type   |
|---------------------|--------|
| **decisionTableId** | number |

**Return type**: [RuntimeDecisionTableRepresentation](RuntimeDecisionTableRepresentation.md)

**Example**

```javascript
import { AlfrescoApi, DecisionTablesApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const decisionTablesApi = new DecisionTablesApi(alfrescoApi);
const decisionTableId = 0;

decisionTablesApi.getDecisionTable(decisionTableId).then((data) => {
    console.log('API called successfully. Returned data: ' + data);
});
```

# getDecisionTables

Query decision tables

**Parameters**

| Name         | Type   |
|--------------|--------|
| nameLike     | string |
| keyLike      | string |
| tenantIdLike | string |
| deploymentId | number |
| sort         | string |
| order        | string |
| start        | number |
| size         | number |

**Return type**: [ResultListDataRepresentationRuntimeDecisionTableRepresentation](ResultListDataRepresentationRuntimeDecisionTableRepresentation.md)

**Example**

```javascript
import { AlfrescoApi, DecisionTablesApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const decisionTablesApi = new DecisionTablesApi(alfrescoApi);
const opts = {};

decisionTablesApi.getDecisionTables(opts).then((data) => {
    console.log('API called successfully. Returned data: ' + data);
});
```

# Models

## JsonNode

**Properties**

| Name                | Type    |
|---------------------|---------|
| array               | boolean |
| bigDecimal          | boolean |
| bigInteger          | boolean |
| binary              | boolean |
| boolean             | boolean |
| containerNode       | boolean |
| double              | boolean |
| float               | boolean |
| floatingPointNumber | boolean |
| int                 | boolean |
| integralNumber      | boolean |
| long                | boolean |
| missingNode         | boolean |
| nodeType            | string  |
| null                | boolean |
| number              | boolean |
| object              | boolean |
| pojo                | boolean |
| short               | boolean |
| textual             | boolean |
| valueNode           | boolean |

### JsonNode.NodeTypeEnum

* `ARRAY` (value: `'ARRAY'`)
* `BINARY` (value: `'BINARY'`)
* `BOOLEAN` (value: `'BOOLEAN'`)
* `MISSING` (value: `'MISSING'`)
* `NULL` (value: `'NULL'`)
* `NUMBER` (value: `'NUMBER'`)
* `OBJECT` (value: `'OBJECT'`)
* `POJO` (value: `'POJO'`)
* `STRING` (value: `'STRING'`)
