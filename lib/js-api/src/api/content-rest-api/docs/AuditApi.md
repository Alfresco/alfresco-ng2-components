**# AuditApi

All URIs are relative to *https://localhost/alfresco/api/-default-/public/alfresco/versions/1*

| Method                                                          | HTTP request                                                                     | Description                                               |
|-----------------------------------------------------------------|----------------------------------------------------------------------------------|-----------------------------------------------------------|
| [deleteAuditEntriesForAuditApp](#deleteAuditEntriesForAuditApp) | **DELETE** /audit-applications/{auditApplicationId}/audit-entries                | Permanently delete audit entries for an audit application |
| [deleteAuditEntry](#deleteAuditEntry)                           | **DELETE** /audit-applications/{auditApplicationId}/audit-entries/{auditEntryId} | Permanently delete an audit entry                         |
| [getAuditApp](#getAuditApp)                                     | **GET** /audit-applications/{auditApplicationId}                                 | Get audit application info                                |
| [getAuditEntry](#getAuditEntry)                                 | **GET** /audit-applications/{auditApplicationId}/audit-entries/{auditEntryId}    | Get audit entry                                           |
| [listAuditApps](#listAuditApps)                                 | **GET** /audit-applications                                                      | List audit applications                                   |
| [listAuditEntriesForAuditApp](#listAuditEntriesForAuditApp)     | **GET** /audit-applications/{auditApplicationId}/audit-entries                   | List audit entries for an audit application               |
| [listAuditEntriesForNode](#listAuditEntriesForNode)             | **GET** /nodes/{nodeId}/audit-entries                                            | List audit entries for a node                             |
| [updateAuditApp](#updateAuditApp)                               | **PUT** /audit-applications/{auditApplicationId}                                 | Update audit application info                             |

## deleteAuditEntriesForAuditApp

Permanently delete audit entries for an audit application

> this endpoint is available in **Alfresco 5.2.2** and newer versions.

The **where** clause must be specified, either with an inclusive time period or for
an inclusive range of ids. The deletion is within the context of the given audit application.

For example:

- `where=(createdAt BETWEEN ('2017-06-02T12:13:51.593+01:00', '2017-06-04T10:05:16.536+01:00')`
- `where=(id BETWEEN ('1234', '4321')`

You must have admin rights to delete audit information.

**Parameters**

| Name                   | Type   | Description                                                                                                                                                                                                                                                     |
|------------------------|--------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **auditApplicationId** | string | The identifier of an audit application.                                                                                                                                                                                                                         | 
| **where**              | string | Audit entries to permanently delete for an audit application, given an inclusive time period or range of ids. For example: `where=(createdAt BETWEEN ('2017-06-02T12:13:51.593+01:00' , '2017-06-04T10:05:16.536+01:00')`, `where=(id BETWEEN ('1234', '4321')` |

**Example**

```javascript
import { AlfrescoApi, AuditApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*...*/);
const auditApi = new AuditApi(alfrescoApi);

auditApi.deleteAuditEntriesForAuditApp('<auditApplicationId>', '<where>').then(() => {
  console.log('API called successfully.');
});
```

## deleteAuditEntry

Permanently delete an audit entry

> this endpoint is available in **Alfresco 5.2.2** and newer versions.  
> You must have admin rights to delete audit information.

**Parameters**

| Name                   | Type   | Description                             |
|------------------------|--------|-----------------------------------------|
| **auditApplicationId** | string | The identifier of an audit application. | 
| **auditEntryId**       | string | The identifier of an audit entry.       | 

**Example**

```javascript
import { AlfrescoApi, AuditApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*...*/);
const auditApi = new AuditApi(alfrescoApi);

auditApi.deleteAuditEntry('<auditApplicationId>', '<auditEntryId>').then(() => {
  console.log('API called successfully.');
});
```

## getAuditApp

Get audit application info

> **Note:** this endpoint is available in Alfresco 5.2.2 and newer versions.  
> You must have admin rights to retrieve audit information.

You can use the **include** parameter to return the minimum and/or maximum audit record id for the application.

**Parameters**

| Name                   | Type     | Description                                                                                                                                                                                                                                                                                                                                                                                                                             |
|------------------------|----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **auditApplicationId** | string   | The identifier of an audit application.                                                                                                                                                                                                                                                                                                                                                                                                 | 
| opts.fields            | string[] | A list of field names. You can use this parameter to restrict the fields returned within a response if, for example, you want to save on overall bandwidth. The list applies to a returned individual entity or entries within a collection. If the API method also supports the **include** parameter, then the fields specified in the **include** parameter are returned in addition to those specified in the **fields** parameter. |  
| opts.include           | string[] | Also include the current minimum and/or maximum audit entry ids for the application. The following optional fields can be requested: `max`, `min`                                                                                                                                                                                                                                                                                       | 

**Return type**: [AuditApp](#AuditApp)

**Example**

```javascript
import { AlfrescoApi, AuditApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*...*/);
const auditApi = new AuditApi(alfrescoApi);
const opts = {};

auditApi.getAuditApp(`<auditApplicationId>`, opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
});
```

## getAuditEntry

Get audit entry

> this endpoint is available in **Alfresco 5.2.2** and newer versions.  
> You must have admin rights to access audit information.

**Parameters**

| Name                   | Type     | Description                                                                                                                                                                                                                                                                                                                                                                                                                             |
|------------------------|----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **auditApplicationId** | string   | The identifier of an audit application.                                                                                                                                                                                                                                                                                                                                                                                                 | 
| **auditEntryId**       | string   | The identifier of an audit entry.                                                                                                                                                                                                                                                                                                                                                                                                       | 
| opts.fields            | string[] | A list of field names. You can use this parameter to restrict the fields returned within a response if, for example, you want to save on overall bandwidth. The list applies to a returned individual entity or entries within a collection. If the API method also supports the **include** parameter, then the fields specified in the **include** parameter are returned in addition to those specified in the **fields** parameter. |

**Return type**: [AuditEntryEntry](#AuditEntryEntry)

**Example**

```javascript
import { AlfrescoApi, AuditApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*...*/);
const auditApi = new AuditApi(alfrescoApi);
const opts = {};

auditApi.getAuditEntry('<auditApplicationId>', '<auditEntryId>', opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
});
```

## listAuditApps

List audit applications

> this endpoint is available in **Alfresco 5.2.2** and newer versions.  
> You must have admin rights to retrieve audit information.

Gets a list of audit applications in this repository.
This list may include pre-configured audit applications, if enabled, such as:

* alfresco-access
* CMISChangeLog
* Alfresco Tagging Service
* Alfresco Sync Service (used by Enterprise Cloud Sync)

**Parameters**

| Name           | Type     | Description                                                                                                                                                                                                                                                                                                                                                                                                                             | Notes                                                     |
|----------------|----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------|
| opts.skipCount | number   | The number of entities that exist in the collection before those included in this list.                                                                                                                                                                                                                                                                                                                                                 | If not supplied then the default value is 0. default to 0 |
| opts.maxItems  | number   | The maximum number of items to return in the list. If not supplied then the default value is 100.                                                                                                                                                                                                                                                                                                                                       | default to 100                                            |
| opts.fields    | string[] | A list of field names. You can use this parameter to restrict the fields returned within a response if, for example, you want to save on overall bandwidth. The list applies to a returned individual entity or entries within a collection. If the API method also supports the **include** parameter, then the fields specified in the **include** parameter are returned in addition to those specified in the **fields** parameter. |                                                           | 

**Return type**: [AuditAppPaging](#AuditAppPaging)

**Example**

```javascript
import { AlfrescoApi, AuditApi} from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*...*/);
const auditApi = new AuditApi(alfrescoApi);
const opts = {};

auditApi.listAuditApps(opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
});
```

## listAuditEntriesForAuditApp

List audit entries for an audit application

> this endpoint is available in **Alfresco 5.2.2** and newer versions.  
> You must have admin rights to retrieve audit information.

You can use the **include** parameter to return additional **values** information.

The list can be filtered by one or more of:

* **createdByUser** person id
* **createdAt** inclusive time period
* **id** inclusive range of ids
* **valuesKey** audit entry values contains the exact matching key
* **valuesValue** audit entry values contains the exact matching value

The default sort order is **createdAt** ascending, but you can use an optional **ASC** or **DESC**
modifier to specify an ascending or descending sort order.

For example, specifying `orderBy=createdAt DESC` returns audit entries in descending **createdAt** order.

**Example**

```javascript
import { AlfrescoApi, AuditApi} from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*...*/);
const auditApi = new AuditApi(alfrescoApi);
const opts = {};

auditApi.listAuditEntriesForAuditApp(`<auditApplicationId>`, opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
});
```

**Parameters**

| Name                   | Type   | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                      | Notes          |
|------------------------|--------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------|
| **auditApplicationId** | string | The identifier of an audit application.                                                                                                                                                                                                                                                                                                                                                                                                                          | 
| opts.skipCount         | number | The number of entities that exist in the collection before those included in this list. If not supplied then the default value is 0.                                                                                                                                                                                                                                                                                                                             | default to 0   |
| opts.orderBy           | string | A string to control the order of the entities returned in a list. You can use the **orderBy** parameter to sort the list by one or more fields. Each field has a default sort order, which is normally ascending order. Read the API method implementation notes above to check if any fields used in this method have a descending default search order. To sort the entities in a specific order, you can use the **ASC** and **DESC** keywords for any field. |                |
| opts.maxItems          | number | The maximum number of items to return in the list. If not supplied then the default value is 100.                                                                                                                                                                                                                                                                                                                                                                | default to 100 |
| opts.where             | string | Optionally filter the list.                                                                                                                                                                                                                                                                                                                                                                                                                                      |                |
| opts.include           | string | Returns additional information about the audit entry. The following optional fields can be requested: `values`                                                                                                                                                                                                                                                                                                                                                   |                |          
| opts.fields            | string | A list of field names. You can use this parameter to restrict the fields returned within a response if, for example, you want to save on overall bandwidth. The list applies to a returned individual  entity or entries within a collection. If the API method also supports the **include** parameter, then the fields specified in the **include** parameter are returned in addition to those specified in the **fields** parameter.                         |                |

**where** examples:

* `where=(createdByUser='jbloggs')`
* `where=(id BETWEEN ('1234', '4321')`
* `where=(createdAt BETWEEN ('2017-06-02T12:13:51.593+01:00', '2017-06-04T10:05:16.536+01:00')`
* `where=(createdByUser='jbloggs' and createdAt BETWEEN ('2017-06-02T12:13:51.593+01:00', '2017-06-04T10:05:16.536+01:00')`
* `where=(valuesKey='/alfresco-access/login/user')`
* `where=(valuesKey='/alfresco-access/transaction/action' and valuesValue='DELETE')`

**Return type**: [AuditEntryPaging](#AuditEntryPaging)

## listAuditEntriesForNode

List audit entries for a node

> this endpoint is available in Alfresco 5.2.2 and newer versions.

Gets a list of audit entries for node **nodeId**.

The list can be filtered by **createdByUser** and for a given inclusive time period.

The default sort order is **createdAt** ascending, but you can use an optional **ASC** or **DESC**
modifier to specify an ascending or descending sort order.

For example, specifying `orderBy=createdAt DESC` returns audit entries in descending **createdAt** order.

This relies on the pre-configured 'alfresco-access' audit application.

**Parameters**

| Name           | Type     | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                      | Notes          |
|----------------|----------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------|
| **nodeId**     | string   | The identifier of a node.                                                                                                                                                                                                                                                                                                                                                                                                                                        |                |
| opts.skipCount | number   | The number of entities that exist in the collection before those included in this list. If not supplied then the default value is 0.                                                                                                                                                                                                                                                                                                                             | default to 0   |
| opts.orderBy   | string[] | A string to control the order of the entities returned in a list. You can use the **orderBy** parameter to sort the list by one or more fields. Each field has a default sort order, which is normally ascending order. Read the API method implementation notes above to check if any fields used in this method have a descending default search order. To sort the entities in a specific order, you can use the **ASC** and **DESC** keywords for any field. |                |
| opts.maxItems  | number   | The maximum number of items to return in the list. If not supplied then the default value is 100.                                                                                                                                                                                                                                                                                                                                                                | default to 100 |
| opts.where     | string   | Optionally filter the list.                                                                                                                                                                                                                                                                                                                                                                                                                                      |                |
| opts.include   | string[] | Returns additional information about the audit entry. The following optional fields can be requested: `values`                                                                                                                                                                                                                                                                                                                                                   |                |
| opts.fields    | string[] | A list of field names. You can use this parameter to restrict the fields returned within a response if, for example, you want to save on overall bandwidth. The list applies to a returned individual entity or entries within a collection. If the API method also supports the **include** parameter, then the fields specified in the **include** parameter are returned in addition to those specified in the **fields** parameter.                          |                | 

**where* examples:

- `where=(createdByUser='-me-')`
- `where=(createdAt BETWEEN ('2017-06-02T12:13:51.593+01:00' , '2017-06-04T10:05:16.536+01:00')`
- `where=(createdByUser='jbloggs' and createdAt BETWEEN ('2017-06-02T12:13:51.593+01:00' , '2017-06-04T10:05:16.536+01:00')`

**Return type**: [AuditEntryPaging](#AuditEntryPaging)

**Example**

```javascript
import { AlfrescoApi, AuditApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*...*/);
const auditApi = new AuditApi(alfrescoApi);
const opts = {};

auditApi.listAuditEntriesForNode(`<nodeId>`, opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
});
```

## updateAuditApp

Update audit application info

> this endpoint is available in **Alfresco 5.2.2** and newer versions.  
> You must have admin rights to update audit application.

Disable or re-enable the audit application **auditApplicationId**.

New audit entries will not be created for a disabled audit application until
it is re-enabled (and system-wide auditing is also enabled).

> it is still possible to query &/or delete any existing audit entries even
if auditing is disabled for the audit application.

**Parameters**

| Name                   | Type                                | Description                                                                                                                                                                                                                                                                                                                                                                                                                              |
|------------------------|-------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **auditApplicationId** | string                              | The identifier of an audit application.                                                                                                                                                                                                                                                                                                                                                                                                  | 
| **auditAppBodyUpdate** | [AuditBodyUpdate](#AuditBodyUpdate) | The audit application to update.                                                                                                                                                                                                                                                                                                                                                                                                         | 
| opts.fields            | string[]                            | A list of field names. You can use this parameter to restrict the fields returned within a response if, for example, you want to save on overall bandwidth. The list applies to a returned individual entity or entries within a collection. If the API method also supports the **include** parameter, then the fields specified in the **include** parameter are returned in addition to those specified in the **fields** parameter.  | 

**Return type**: [AuditApp](#AuditApp)

**Example**

```javascript
import { AlfrescoApi, AuditApi} from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*...*/);
const auditApi = new AuditApi(alfrescoApi);
const auditAppBodyUpdate = {};
const opts = {};

auditApi.updateAuditApp(`<auditApplicationId>`, auditAppBodyUpdate, opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
});
```

# Models

## AuditApp

**Properties**

| Name       | Type    |
|------------|---------|
| **id**     | string  |
| name       | string  |
| isEnabled  | boolean |
| maxEntryId | number  |
| minEntryId | number  |

## AuditAppPaging

**Properties**

| Name | Type                                      |
|------|-------------------------------------------|
| list | [AuditAppPagingList](#AuditAppPagingList) |


## AuditAppPagingList

**Properties**

| Name       | Type                              |
|------------|-----------------------------------|
| pagination | [Pagination](Pagination.md)       |
| entries    | [AuditAppEntry[]](#AuditAppEntry) |

## AuditAppEntry

**Properties**

| Name  | Type                  |
|-------|-----------------------|
| entry | [AuditApp](#AuditApp) |

## AuditApp

**Properties**

| Name       | Type    |
|------------|---------|
| **id**     | string  |
| name       | string  |
| isEnabled  | boolean |
| maxEntryId | number  |
| minEntryId | number  |

## AuditBodyUpdate

| Name      | Type    |
|-----------|---------|
| isEnabled | boolean |

## AuditEntryPaging

**Properties**

| Name | Type                                          |
|------|-----------------------------------------------|
| list | [AuditEntryPagingList](#AuditEntryPagingList) |

## AuditEntryPagingList

**Properties**

| Name       | Type                                  |
|------------|---------------------------------------|
| pagination | [Pagination](Pagination.md)           |
| entries    | [AuditEntryEntry[]](#AuditEntryEntry) |

## AuditEntryEntry

**Properties**

| Name  | Type                      |
|-------|---------------------------|
| entry | [AuditEntry](#AuditEntry) |

## AuditEntry

**Properties**

| Name                   | Type                    |
|------------------------|-------------------------|
| **id**                 | string                  |
| **auditApplicationId** | string                  |
| **createdByUser**      | [UserInfo](UserInfo.md) |
| **createdAt**          | Date                    |
| values                 | any                     |


