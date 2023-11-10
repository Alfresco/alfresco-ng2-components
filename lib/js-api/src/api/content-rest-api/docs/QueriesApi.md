# QueriesApi

All URIs are relative to *https://localhost/alfresco/api/-default-/public/alfresco/versions/1*

| Method                    | HTTP request            | Description |
|---------------------------|-------------------------|-------------|
| [findNodes](#findNodes)   | **GET** /queries/nodes  | Find nodes  |
| [findPeople](#findPeople) | **GET** /queries/people | Find people |
| [findSites](#findSites)   | **GET** /queries/sites  | Find sites  |

## findNodes

Find nodes

> this endpoint is available in **Alfresco 5.2** and newer versions.

Gets a list of nodes that match the given search criteria.

The search term is used to look for nodes that match against name, title, description, full text content or tags.

The search term:

- must contain a minimum of 3 alphanumeric characters
- allows "quoted term"
- can optionally use `*` for wildcard matching

By default, file and folder types will be searched unless a specific type is provided as a query parameter.

By default, the search will be across the repository unless a specific root node id is provided to start the search from.

You can sort the result list using the **orderBy** parameter. You can specify one or more of the following fields in the **orderBy** parameter:

* name
* modifiedAt
* createdAt

**Parameters**

| Name            | Type     | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
|-----------------|----------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **term**        | string   | The term to search for.                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| opts.rootNodeId | string   | The id of the node to start the search from. Supports the aliases `-my-`, `-root-` and `-shared-`.                                                                                                                                                                                                                                                                                                                                                               |
| opts.skipCount  | number   | Default: 0. The number of entities that exist in the collection before those included in this list. If not supplied then the default value is 0.                                                                                                                                                                                                                                                                                                                 |
| opts.maxItems   | number   | Default: 100. The maximum number of items to return in the list. If not supplied then the default value is 100.                                                                                                                                                                                                                                                                                                                                                  |
| opts.nodeType   | string   | Restrict the returned results to only those of the given node type and its sub-types                                                                                                                                                                                                                                                                                                                                                                             |
| opts.include    | string[] | Returns additional information about the node. The following optional fields can be requested: `allowableOperations`, `aspectNames`, `isLink`, `isFavorite`, `isLocked`, `path`, `properties`                                                                                                                                                                                                                                                                    |
| opts.orderBy    | string[] | A string to control the order of the entities returned in a list. You can use the **orderBy** parameter to sort the list by one or more fields. Each field has a default sort order, which is normally ascending order. Read the API method implementation notes above to check if any fields used in this method have a descending default search order. To sort the entities in a specific order, you can use the **ASC** and **DESC** keywords for any field. |
| opts.fields     | string[] | A list of field names. You can use this parameter to restrict the fields returned within a response if, for example, you want to save on overall bandwidth. The list applies to a returned individual entity or entries within a collection. If the API method also supports the **include** parameter, then the fields specified in the **include** parameter are returned in addition to those specified in the **fields** parameter.                          |

**Return type**: [NodePaging](#NodePaging)

**Example**

```javascript
import { AlfrescoApi, QueriesApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const queriesApi = new QueriesApi(alfrescoApi);
const opts = {};

queriesApi.findNodes(`<term>`, opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
});
```

## findPeople

Find people

> this endpoint is available in **Alfresco 5.2** and newer versions.

Gets a list of people that match the given search criteria.

The search term is used to look for matches against person id, firstname and lastname.

The search term:

- must contain a minimum of 2 alphanumeric characters
- can optionally use '*' for wildcard matching within the term

You can sort the result list using the **orderBy** parameter. You can specify one or more of the following fields in the **orderBy** parameter:

* id
* firstName
* lastName

**Parameters**

| Name           | Type     | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
|----------------|----------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **term**       | string   | The term to search for.                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| opts.skipCount | number   | Default 0. The number of entities that exist in the collection before those included in this list. If not supplied then the default value is 0.                                                                                                                                                                                                                                                                                                                  |
| opts.maxItems  | number   | Default 100. The maximum number of items to return in the list. If not supplied then the default value is 100.                                                                                                                                                                                                                                                                                                                                                   |
| opts.fields    | string[] | A list of field names. You can use this parameter to restrict the fields returned within a response if, for example, you want to save on overall bandwidth. The list applies to a returned individual entity or entries within a collection. If the API method also supports the **include** parameter, then the fields specified in the **include** parameter are returned in addition to those specified in the **fields** parameter.                          |
| opts.orderBy   | string[] | A string to control the order of the entities returned in a list. You can use the **orderBy** parameter to sort the list by one or more fields. Each field has a default sort order, which is normally ascending order. Read the API method implementation notes above to check if any fields used in this method have a descending default search order. To sort the entities in a specific order, you can use the **ASC** and **DESC** keywords for any field. |

**Return type**: [PersonPaging](PersonPaging.md)

**Example**

```javascript
import { AlfrescoApi, QueriesApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const queriesApi = new QueriesApi(alfrescoApi);
const opts = {};

queriesApi.findPeople(`<term>`, opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
});
```

## findSites

Find sites

> this endpoint is available in **Alfresco 5.2** and newer versions.

Gets a list of sites that match the given search criteria.

The search term is used to look for sites that match against site id, title or description.

The search term:

- must contain a minimum of 2 alphanumeric characters
- can optionally use '*' for wildcard matching within the term

The default sort order for the returned list is for sites to be sorted by ascending id.
You can override the default by using the **orderBy** parameter. You can specify one or more of the following fields in the **orderBy** parameter:

* id
* title
* description

**Parameters**

| Name           | Type     | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
|----------------|----------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **term**       | string   | The term to search for.                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| opts.skipCount | number   | Default 0. The number of entities that exist in the collection before those included in this list. If not supplied then the default value is 0.                                                                                                                                                                                                                                                                                                                  |
| opts.maxItems  | number   | Default 100. The maximum number of items to return in the list. If not supplied then the default value is 100.                                                                                                                                                                                                                                                                                                                                                   |
| opts.orderBy   | string[] | A string to control the order of the entities returned in a list. You can use the **orderBy** parameter to sort the list by one or more fields. Each field has a default sort order, which is normally ascending order. Read the API method implementation notes above to check if any fields used in this method have a descending default search order. To sort the entities in a specific order, you can use the **ASC** and **DESC** keywords for any field. |
| opts.fields    | string[] | A list of field names. You can use this parameter to restrict the fields returned within a response if, for example, you want to save on overall bandwidth. The list applies to a returned individual entity or entries within a collection. If the API method also supports the **include** parameter, then the fields specified in the **include** parameter are returned in addition to those specified in the **fields** parameter.                          |

**Return type**: [SitePaging](SitePaging.md)

**Example**

```javascript
import { AlfrescoApi, QueriesApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const queriesApi = new QueriesApi(alfrescoApi);
const opts = {};

queriesApi.findSites(`<term>`, opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
});
```

# Models

## NodePaging

**Properties**

| Name | Type                              |
|------|-----------------------------------|
| list | [NodePagingList](#NodePagingList) |

## NodePagingList

**Properties**

| Name       | Type                        |
|------------|-----------------------------|
| pagination | [Pagination](Pagination.md) |
| entries    | [NodeEntry[]](NodeEntry.md) |
| source     | [Node](Node.md)             |



