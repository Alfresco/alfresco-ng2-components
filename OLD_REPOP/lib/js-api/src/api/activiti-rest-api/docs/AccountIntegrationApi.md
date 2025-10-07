# AccountIntegrationApi

All URIs are relative to */activiti-app/api*

| Method                      | HTTP request                            | Description                           |
|-----------------------------|-----------------------------------------|---------------------------------------|
| [getAccounts](#getAccounts) | **GET** /enterprise/account/integration | Retrieve external account information |

# **getAccounts**

Retrieve external account information

Accounts are used to integrate with third party apps and clients

**Return type**: [ResultListDataRepresentationAccountRepresentation](#ResultListDataRepresentationAccountRepresentation)

**Example**

```javascript
import { AlfrescoApi, AccountIntegrationApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const accountIntegrationApi = new AccountIntegrationApi(alfrescoApi);

accountIntegrationApi.getAccounts().then((data) => {
    console.log('API called successfully. Returned data: ' + data);
});
```

# Models

## ResultListDataRepresentationAccountRepresentation

**Properties**

| Name  | Type                                              |
|-------|---------------------------------------------------|
| data  | [AccountRepresentation[]](#AccountRepresentation) |
| size  | number                                            |
| start | number                                            |
| total | number                                            |


## AccountRepresentation

**Properties**

| Name             | Type    |
|------------------|---------|
| authorizationUrl | string  |
| authorized       | boolean |
| metaDataAllowed  | boolean |
| name             | string  |
| serviceId        | string  |


