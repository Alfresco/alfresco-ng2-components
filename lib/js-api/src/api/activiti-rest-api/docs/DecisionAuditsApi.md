# DecisionAuditsApi

All URIs are relative to */activiti-app/api*

| Method                            | HTTP request                                        | Description                       |
|-----------------------------------|-----------------------------------------------------|-----------------------------------|
| [getAuditTrail](#getAuditTrail)   | **GET** /enterprise/decisions/audits/{auditTrailId} | Get an audit trail                |
| [getAuditTrails](#getAuditTrails) | **GET** /enterprise/decisions/audits                | Query decision table audit trails |

# getAuditTrail

Get an audit trail

**Parameters**

| Name             | Type   |
|------------------|--------|
| **auditTrailId** | number |

**Return type**: [DecisionAuditRepresentation](#DecisionAuditRepresentation)

**Example**

```javascript
import { AlfrescoApi, DecisionAuditsApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const decisionAuditsApi = new DecisionAuditsApi(this.alfrescoApi);
const auditTrailId = 0;

decisionauditsApi.getAuditTrail(auditTrailId).then((data) => {
    console.log('API called successfully. Returned data: ' + data);
});
```

# getAuditTrails

Query decision table audit trails

**Parameters**

| Name                | Type   |
|---------------------|--------|
| **decisionKey**     | string |
| **dmnDeploymentId** | number |

**Return type**: [ResultListDataRepresentationDecisionAuditRepresentation](#ResultListDataRepresentationDecisionAuditRepresentation)

**Example**

```javascript
import { AlfrescoApi, DecisionAuditsApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const decisionAuditsApi = new DecisionAuditsApi(this.alfrescoApi);
const dmnDeploymentId = 0;

decisionauditsApi.getAuditTrails(`<decisionKey>`, dmnDeploymentId).then((data) => {
    console.log('API called successfully. Returned data: ' + data);
});
```

# Models

## ResultListDataRepresentationDecisionAuditRepresentation

**Properties**

| Name  | Type                                                          |
|-------|---------------------------------------------------------------|
| data  | [DecisionAuditRepresentation[]](#DecisionAuditRepresentation) |
| size  | number                                                        |
| start | number                                                        |
| total | number                                                        |

## DecisionAuditRepresentation

**Properties**

| Name                    | Type    |
|-------------------------|---------|
| activityId              | string  |
| activityName            | string  |
| auditTrailJson          | string  |
| created                 | Date    |
| decisionExecutionFailed | boolean |
| decisionKey             | string  |
| decisionModelJson       | string  |
| decisionName            | string  |
| dmnDeploymentId         | number  |
| executionId             | string  |
| id                      | number  |
| processDefinitionId     | string  |
| processInstanceId       | string  |
| renderedVariables       | any     |


