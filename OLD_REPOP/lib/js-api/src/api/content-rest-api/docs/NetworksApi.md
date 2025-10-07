# NetworksApi

All URIs are relative to *https://localhost/alfresco/api/-default-/public/alfresco/versions/1*

| Method                                          | HTTP request                                    | Description             |
|-------------------------------------------------|-------------------------------------------------|-------------------------|
| [getNetwork](#getNetwork)                       | **GET** /networks/{networkId}                   | Get a network           |
| [getNetworkForPerson](#getNetworkForPerson)     | **GET** /people/{personId}/networks/{networkId} | Get network information |
| [listNetworksForPerson](#listNetworksForPerson) | **GET** /people/{personId}/networks             | List network membership |

## getNetwork

Get a network

**Parameters**

| Name          | Type     | Description                                                                                                                                                                                                                                                                                                                                                                                                                             |
|---------------|----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **networkId** | string   | The identifier of a network.                                                                                                                                                                                                                                                                                                                                                                                                            | 
| opts.fields   | string[] | A list of field names. You can use this parameter to restrict the fields returned within a response if, for example, you want to save on overall bandwidth. The list applies to a returned individual entity or entries within a collection. If the API method also supports the **include** parameter, then the fields specified in the **include** parameter are returned in addition to those specified in the **fields** parameter. | 

**Return type**: [PersonNetworkEntry](#PersonNetworkEntry)

**Example**

```javascript
import { AlfrescoApi, NetworksApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const networksApi = new NetworksApi(alfrescoApi);
const opts = {};

networksApi.getNetwork(`<networkId>`, opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
});
```

## getNetworkForPerson

Get network information

You can use the `-me-` string in place of <personId> to specify the currently authenticated user.

**Parameters**

| Name          | Type     | Description                                                                                                                                                                                                                                                                                                                                                                                                                             |
|---------------|----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **personId**  | string   | The identifier of a person.                                                                                                                                                                                                                                                                                                                                                                                                             | 
| **networkId** | string   | The identifier of a network.                                                                                                                                                                                                                                                                                                                                                                                                            | 
| fields        | string[] | A list of field names. You can use this parameter to restrict the fields returned within a response if, for example, you want to save on overall bandwidth. The list applies to a returned individual entity or entries within a collection. If the API method also supports the **include** parameter, then the fields specified in the **include** parameter are returned in addition to those specified in the **fields** parameter. | 

**Return type**: [PersonNetworkEntry](#PersonNetworkEntry)

**Example**

```javascript
import { AlfrescoApi, NetworksApi} from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const networksApi = new NetworksApi(alfrescoApi);

const opts = {};

networksApi.getNetworkForPerson(`<personId>`, `<networkId>`, opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
});
```

## listNetworksForPerson

List network membership

You can use the `-me-` string in place of `<personId>` to specify the currently authenticated user.

**Parameters**

| Name           | Type     | Description                                                                                                                                                                                                                                                                                                                                                                                                                             | Notes          |
|----------------|----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------|
| **personId**   | string   | The identifier of a person.                                                                                                                                                                                                                                                                                                                                                                                                             | 
| opts.skipCount | number   | The number of entities that exist in the collection before those included in this list. If not supplied then the default value is 0.                                                                                                                                                                                                                                                                                                    | default to 0   |
| opts.maxItems  | number   | The maximum number of items to return in the list. If not supplied then the default value is 100.                                                                                                                                                                                                                                                                                                                                       | default to 100 |
| opts.fields    | string[] | A list of field names. You can use this parameter to restrict the fields returned within a response if, for example, you want to save on overall bandwidth. The list applies to a returned individual entity or entries within a collection. If the API method also supports the **include** parameter, then the fields specified in the **include** parameter are returned in addition to those specified in the **fields** parameter. |                | 

**Return type**: [PersonNetworkPaging](#PersonNetworkPaging)

**Example**

```javascript
import { AlfrescoApi, NetworksApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const networksApi = new NetworksApi(alfrescoApi);

const opts = {};

networksApi.listNetworksForPerson(`<personId>`, opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
});
```

# Models

## PersonNetworkEntry

**Properties**

| Name  | Type                            |
|-------|---------------------------------|
| entry | [PersonNetwork](#PersonNetwork) |

## PersonNetworkPaging

**Properties**

| Name | Type                                                |
|------|-----------------------------------------------------|
| list | [PersonNetworkPagingList](#PersonNetworkPagingList) |


## PersonNetworkPagingList

**Properties**

| Name       | Type                                        |
|------------|---------------------------------------------|
| pagination | [Pagination](Pagination.md)                 |
| entries    | [PersonNetworkEntry[]](#PersonNetworkEntry) |


## PersonNetwork

**Properties**

| Name              | Type                            | Description               |
|-------------------|---------------------------------|---------------------------|
| **id**            | string                          | This network's unique id  |
| homeNetwork       | boolean                         | Is this the home network? |
| **isEnabled**     | boolean                         |                           |
| createdAt         | Date                            |                           |
| paidNetwork       | boolean                         |                           |
| subscriptionLevel | string                          |                           |
| quotas            | [NetworkQuota[]](#NetworkQuota) |                           |

### PersonNetwork.SubscriptionLevelEnum

* `Free` (value: `'Free'`)
* `Standard` (value: `'Standard'`)
* `Enterprise` (value: `'Enterprise'`)

## NetworkQuota

**Properties**

| Name      | Type   |
|-----------|--------|
| **id**    | string |
| **limit** | number |
| **usage** | number |
