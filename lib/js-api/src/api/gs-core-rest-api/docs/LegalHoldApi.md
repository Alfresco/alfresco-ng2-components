# LegalHoldApi

All URIs are relative to _https://localhost/alfresco/api/-default-/public/gs/versions/1_

| Method                                           | HTTP request                                 | Description                   |
| ------------------------------------------------ | -------------------------------------------- | ----------------------------- |
| [**getHolds**](LegalHoldApi.md#getHolds)         | **GET** /file-plans/{filePlanId}/holds       | Get legal holds list          |
| [**assignHold**](LegalHoldApi.md#assignHold)     | **POST** /holds/{holdId}/children            | Assign node to legal hold     |
| [**assignHolds**](LegalHoldApi.md#assignHolds)   | **POST** /holds/{holdId}/children            | Assign nodes to legal hold    |
| [**unassignHold**](LegalHoldApi.md#unassignHold) | **DELETE** /holds/{holdId}/children/{nodeId} | Unassign node from legal hold |
| [**createHold**](LegalHoldApi.md#createHold)     | **POST** /file-plans/{filePlanId}/holds      | Create one hold               |
| [**createHolds**](LegalHoldApi.md#createHolds)   | **POST** /file-plans/{filePlanId}/holds      | Create list of holds          |
| [**bulkHold**](LegalHoldApi.md#bulkHold)         | **POST** /holds/{holdId}/bulk                | Bulk add of nodes to the hold |

<a name="getHolds"></a>

# **getHolds**

> HoldPaging getHolds(filePlanId, opts)

Get legal holds list.

### Example

```javascript
import LegalHoldApi from 'LegalHoldApi';
import { AlfrescoApi } from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

const legalHoldApi = new LegalHoldApi(this.alfrescoApi);

let opts = {
  'skipCount': 56 //  | The number of entities that exist in the collection before those included in this list.
  'maxItems': 56 //  | The maximum number of items to return in the list.
};

legalHoldApi.getHolds('-filePlan-', opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, function(error) {
  console.error(error);
});

```

### Parameters

| Name           | Type       | Default value | Description                                                                                        |
| -------------- | ---------- | ------------- | -------------------------------------------------------------------------------------------------- |
| **filePlanId** | **string** |               | The site details                                                                                   |
| **skipCount**  | **number** | `0`           | The number of entities that exist in the collection before those included in this list. [optional] |
| **maxItems**   | **number** | `100`         | The maximum number of items to return in the list. [optional]                                      |

### Return type

[**HoldPaging**](HoldPaging.md)

<a name="assignHold"></a>

# **assignHold**

> HoldEntry assignHold(nodeId, holdId)

Assign node to legal hold.

### Example

```javascript
import LegalHoldApi from 'LegalHoldApi';
import { AlfrescoApi } from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let legalHoldApi = new LegalHoldApi(this.alfrescoApi);

legalHoldApi.assignHold('nodeId', 'holdId').then(
    (data) => {
        console.log('API called successfully. Returned data: ' + data);
    },
    function (error) {
        console.error(error);
    }
);
```

### Parameters

| Name       | Type       | Default value | Description                               |
| ---------- | ---------- | ------------- | ----------------------------------------- |
| **nodeId** | **string** |               | The id of the node to be assigned to hold |
| **holdId** | **string** |               | The identifier of a hold.                 |

### Return type

[**HoldEntry**](HoldEntry.md)

<a name="assignHolds"></a>

# **assignHolds**

> HoldPaging assignHolds(nodeIds, holdId)

Assign nodes to legal hold.

### Example

```javascript
import LegalHoldApi from 'LegalHoldApi';
import { AlfrescoApi } from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let legalHoldApi = new LegalHoldApi(this.alfrescoApi);

legalHoldApi.assignHolds([{ id: 'foo' }, { id: 'bar' }], 'holdId').then(
    (data) => {
        console.log('API called successfully. Returned data: ' + data);
    },
    function (error) {
        console.error(error);
    }
);
```

### Parameters

| Name        | Type                 | Default value | Description                                          |
| ----------- | -------------------- | ------------- | ---------------------------------------------------- |
| **nodeIds** | **{ id: string }[]** |               | The list with id of nodes to assign to existing hold |
| **holdId**  | **string**           |               | The identifier of a hold.                            |

### Return type

[**HoldPaging**](HoldPaging.md)

<a name="unassignHold"></a>

# **unassignHold**

> void unassignHold(holdId, nodeId)

Unassign node from legal hold.

### Example

```javascript
import LegalHoldApi from 'LegalHoldApi';
import { AlfrescoApi } from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let legalHoldApi = new LegalHoldApi(this.alfrescoApi);

legalHoldApi.unassignHold('holdId', 'nodeId').then(
    (data) => {
        console.log('API called successfully. Returned data: ' + data);
    },
    function (error) {
        console.error(error);
    }
);
```

### Parameters

| Name       | Type       | Default value | Description                                |
| ---------- | ---------- | ------------- | ------------------------------------------ |
| **holdId** | **string** |               | The identifier of a hold                   |
| **nodeId** | **string** |               | The nodeId of the node which is unassigned |

### Return type

**void**

<a name="createHold"></a>

# **createHold**

> HoldEntry createHold(filePlanId, holds)

Create legal hold.

### Example

```javascript
import LegalHoldApi from 'LegalHoldApi';
import { AlfrescoApi } from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

const legalHoldApi = new LegalHoldApi(this.alfrescoApi);

const hold = {
    name: 'Hold 1',
    reason: 'Reason 1'
};

legalHoldApi.createHold('-filePlan-', hold).then(
    (data) => {
        console.log('API called successfully. Returned data: ' + data);
    },
    function (error) {
        console.error(error);
    }
);
```

### Parameters

| Name           | Type       | Default value | Description      |
| -------------- | ---------- | ------------- | ---------------- |
| **filePlanId** | **string** |               | The site details |
| **hold**       | **Hold**   |               | Hold to create.  |

### Return type

[**HoldEntry**](./HoldEntry.md)

<a name="createHolds"></a>

# **createHolds**

> HoldPaging createHolds(filePlanId, holds)

Create legal holds list.

### Example

```javascript
import LegalHoldApi from 'LegalHoldApi';
import { AlfrescoApi } from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

const legalHoldApi = new LegalHoldApi(this.alfrescoApi);

let opts = [
    {
        name: 'Hold 1',
        reason: 'Reason 1'
    },
    {
        name: 'Hold 2',
        reason: 'Reason 2',
        description: 'Description'
    }
];

legalHoldApi.createHolds('-filePlan-', holds).then(
    (data) => {
        console.log('API called successfully. Returned data: ' + data);
    },
    function (error) {
        console.error(error);
    }
);
```

### Parameters

| Name           | Type       | Default value | Description         |
| -------------- | ---------- | ------------- | ------------------- |
| **filePlanId** | **string** |               | The site details    |
| **holds**      | **Hold[]** |               | Array of new holds. |

### Return type

[**HoldPaging**](./HoldPaging.md)

<a name="bulkHold"></a>

# **bulkHold**

> BulkHoldAddResponse bulkHold(holdId, query, language)

Start the asynchronous bulk process for a hold with id `holdId` based on search query results.

### Example

```javascript
import LegalHoldApi from 'LegalHoldApi';
import { AlfrescoApi } from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

const legalHoldApi = new LegalHoldApi(this.alfrescoApi);

legalHoldApi.bulkHold('holdId', 'SITE:swsdp and TYPE:content', 'afts').then(
    (data) => {
        console.log('API called successfully. Returned data: ' + data);
    },
    function (error) {
        console.error(error);
    }
);
```

### Parameters

| Name         | Type       | Default value | Description              |
| ------------ | ---------- | ------------- | ------------------------ |
| **holdId**   | **string** |               | The identifier of a hold |
| **query**    | **string** |               | Search query.            |
| **language** | **string** |               | Language.                |

### Return type

[**BulkHoldAddResponse**](./BulkHoldAddResponse.md)
