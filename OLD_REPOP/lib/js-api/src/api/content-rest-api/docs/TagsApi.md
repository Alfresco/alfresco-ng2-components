# TagsApi

All URIs are relative to *https://localhost/alfresco/api/-default-/public/alfresco/versions/1*

| Method                                  | HTTP request                            | Description                                                                                                               |
|-----------------------------------------|-----------------------------------------|---------------------------------------------------------------------------------------------------------------------------|
| [createTagForNode](#createTagForNode)   | **POST** /nodes/{nodeId}/tags           | Create a tag for a node                                                                                                   |
| [deleteTagFromNode](#deleteTagFromNode) | **DELETE** /nodes/{nodeId}/tags/{tagId} | Delete a tag from a node                                                                                                  |
| [getTag](#getTag)                       | **GET** /tags/{tagId}                   | Get a tag                                                                                                                 |
| [listTags](#listTags)                   | **GET** /tags                           | List tags                                                                                                                 |
| [listTagsForNode](#listTagsForNode)     | **GET** /nodes/{nodeId}/tags            | List tags for a node                                                                                                      |
| [updateTag](#updateTag)                 | **PUT** /tags/{tagId}                   | Update a tag                                                                                                              |
| [deleteTag](#deleteTag)                 | **DELETE** /tags/{tagId}                | Completely deletes a tag                                                                                                  |
| [createTags](#createTags)               | **POST** /tags                          | Create list of tags                                                                                                       |
| [assignTagsToNode](#assignTagsToNode)   | **POST** /nodes/{nodeId}/tags           | Assign tags to node. If tag is new then tag is also created additionally, if tag already exists then it is just assigned. |

## createTagForNode

Creates a tag on the node **nodeId**. You specify the tag in a JSON body like this:

```json
{
  "tag":"test-tag-1"
}
```

**Note:** You can create more than one tag by
specifying a list of tags in the JSON body like this:

```json
[
  {
    "tag": "test-tag-1"
  },
  {
    "tag": "test-tag-2"
  }
]
```

If you specify a list as input, then a paginated list rather than an entry is returned in the response body. For example:

```json
{
  "list": {
    "pagination": {
      "count": 2,
      "hasMoreItems": false,
      "totalItems": 2,
      "skipCount": 0,
      "maxItems": 100
    },
    "entries": [
      {
        "entry": {
        }
      },
      {
        "entry": {
        }
      }
    ]
  }
}
```

**Example**

```javascript
import { AlfrescoApi, TagsApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const tagsApi = new TagsApi(alfrescoApi);
const tagBodyCreate = {};
const opts = {};

tagsApi.createTagForNode(nodeId, tagBodyCreate, opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
});
```

**Parameters**

| Name              | Type                | Description                                                                                                                                                                                                                                                                                                                                                                                                                             |
|-------------------|---------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **nodeId**        | string              | The identifier of a node.                                                                                                                                                                                                                                                                                                                                                                                                               | 
| **tagBodyCreate** | [TagBody](#TagBody) | The new tag                                                                                                                                                                                                                                                                                                                                                                                                                             | 
| opts.fields       | string[]            | A list of field names. You can use this parameter to restrict the fields returned within a response if, for example, you want to save on overall bandwidth. The list applies to a returned individual entity or entries within a collection. If the API method also supports the **include** parameter, then the fields specified in the **include** parameter are returned in addition to those specified in the **fields** parameter. | 

**Return type**: [TagEntry](#TagEntry)

## deleteTagFromNode

Delete a tag from a node

**Parameters**

| Name       | Type   | Description               |
|------------|--------|---------------------------|
| **nodeId** | string | The identifier of a node. | 
| **tagId**  | string | The identifier of a tag.  |

**Example**

```javascript
import { AlfrescoApi, TagsApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const tagsApi = new TagsApi(alfrescoApi);

tagsApi.deleteTagFromNode(`<nodeId>`, `<tagId>`).then(() => {
  console.log('API called successfully.');
});
```

## getTag

Get a tag

**Parameters**

| Name        | Type     | Description                                                                                                                                                                                                                                                                                                                                                                                                                             |
|-------------|----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **tagId**   | string   | The identifier of a tag.                                                                                                                                                                                                                                                                                                                                                                                                                |  
| opts.fields | string[] | A list of field names. You can use this parameter to restrict the fields returned within a response if, for example, you want to save on overall bandwidth. The list applies to a returned individual entity or entries within a collection. If the API method also supports the **include** parameter, then the fields specified in the **include** parameter are returned in addition to those specified in the **fields** parameter. | | 

**Return type**: [TagEntry](#TagEntry)

**Example**

```javascript
import { AlfrescoApi, TagsApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const tagsApi = new TagsApi(alfrescoApi);
const opts = {};

tagsApi.getTag(`<tagId>`, opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
});
```

## listTags

Gets a list of tags in this repository.

You can use the **include** parameter to return additional **values** information.
You can also use **name** parameter to return tags only for specified name.

**Parameters**

| Name           | Type     | Description                                                                                                                                                                                                                                                                                                                                                                                                                             | Notes          |
|----------------|----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------|
| opts.skipCount | number   | The number of entities that exist in the collection before those included in this list. If not supplied then the default value is 0.                                                                                                                                                                                                                                                                                                    | default to 0   |
| opts.maxItems  | number   | The maximum number of items to return in the list. If not supplied then the default value is 100.                                                                                                                                                                                                                                                                                                                                       | default to 100 |
| opts.fields    | string[] | A list of field names. You can use this parameter to restrict the fields returned within a response if, for example, you want to save on overall bandwidth. The list applies to a returned individual entity or entries within a collection. If the API method also supports the **include** parameter, then the fields specified in the **include** parameter are returned in addition to those specified in the **fields** parameter. |                | 
| opts.include   | string[] | Returns additional information about the tag. The following optional fields can be requested: `count`                                                                                                                                                                                                                                                                                                                                   |                | 

**Return type**: [TagPaging](#TagPaging)

**Example**

```javascript
import { AlfrescoApi, TagsApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const tagsApi = new TagsApi(alfrescoApi);
const opts = {};

tagsApi.listTags(opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
});
```

## listTagsForNode

List tags for a node

**Parameters**

| Name           | Type     | Description                                                                                                                                                                                                                                                                                                                                                                                                                             | Notes          |
|----------------|----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------|
| **nodeId**     | string   | The identifier of a node.                                                                                                                                                                                                                                                                                                                                                                                                               |                |
| opts.skipCount | number   | The number of entities that exist in the collection before those included in this list. If not supplied then the default value is 0.                                                                                                                                                                                                                                                                                                    | default to 0   |
| opts.maxItems  | number   | The maximum number of items to return in the list. If not supplied then the default value is 100.                                                                                                                                                                                                                                                                                                                                       | default to 100 |
| opts.fields    | string[] | A list of field names. You can use this parameter to restrict the fields returned within a response if, for example, you want to save on overall bandwidth. The list applies to a returned individual entity or entries within a collection. If the API method also supports the **include** parameter, then the fields specified in the **include** parameter are returned in addition to those specified in the **fields** parameter. |                |

**Return type**: [TagPaging](#TagPaging)

**Example**

```javascript
import { AlfrescoApi, TagsApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const tagsApi = new TagsApi(alfrescoApi);
const opts = {};

tagsApi.listTagsForNode(`<nodeId>`, opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
});
```

## updateTag

Update a tag

**Parameters**

| Name              | Type                | Description                                                                                                                                                                                                                                                                                                                                                                                                                             |
|-------------------|---------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **tagId**         | string              | The identifier of a tag.                                                                                                                                                                                                                                                                                                                                                                                                                |
| **tagBodyUpdate** | [TagBody](#TagBody) | The updated tag                                                                                                                                                                                                                                                                                                                                                                                                                         | 
| opts.fields       | string[]            | A list of field names. You can use this parameter to restrict the fields returned within a response if, for example, you want to save on overall bandwidth. The list applies to a returned individual entity or entries within a collection. If the API method also supports the **include** parameter, then the fields specified in the **include** parameter are returned in addition to those specified in the **fields** parameter. |

**Return type**: [TagEntry](#TagEntry)

**Example**

```javascript
import { AlfrescoApi, TagsApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const tagsApi = new TagsApi(alfrescoApi);
const tagBodyUpdate = {};
const opts = {};

tagsApi.updateTag(`<tagId>`, tagBodyUpdate, opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
});
```

## createTags

Create specified by **tags** list of tags.

**Parameters**

| Name     | Type                  | Description             |
|----------|-----------------------|-------------------------|
| **tags** | [TagBody[]](#TagBody) | List of tags to create. |

**Return type**: [TagEntry](#TagEntry) | [TagPaging](#TagPaging)

**Example**

```javascript
import { AlfrescoApi, TagsApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const tagsApi = new TagsApi(alfrescoApi);
const tags = [];

tagsApi.createTags(tags).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
});
```

## deleteTag

Deletes the tag with **tagId**. This will cause the tag to be removed from all nodes.

> You must have admin rights to delete a tag.

**Parameters**

| Name      | Type   | Description              |
|-----------|--------|--------------------------|
| **tagId** | string | The identifier of a tag. |

**Example**

```javascript
import { AlfrescoApi, TagsApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const tagsApi = new TagsApi(alfrescoApi);

tagsApi.deleteTag(`<tagId>`).then(() => {
  console.log('API called successfully.');
});
```

## assignTagsToNode

Assign tags to node. If tag is new then tag is also created additionally, if tag already exists then it is just assigned.

**Parameters**

| Name       | Type                  | Description                                                             | Notes |
|------------|-----------------------|-------------------------------------------------------------------------|-------|
| **nodeId** | string                | Id of node to which tags should be assigned.                            |
| **tags**   | [TagBody[]](#TagBody) | List of tags to create and assign or just assign if they already exist. |

**Return type**: [TagPaging](#TagPaging) | [TagEntry](#TagEntry)

**Example**

```javascript
import { AlfrescoApi, TagsApi, TagBody } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const tagsApi = new TagsApi(alfrescoApi);

const tag1 = new TagBody({ tag: 'tag-test-1' });
const tag2 = new TagBody({ tag: 'tag-test-2' });

tagsApi.assignTagsToNode('someNodeId', [tag1, tag2]).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
});
```

# Models

## TagPaging

**Properties**

| Name | Type                            |
|------|---------------------------------|
| list | [TagPagingList](#TagPagingList) |

## TagPagingList

**Properties**

| Name           | Type                        |
|----------------|-----------------------------|
| **pagination** | [Pagination](Pagination.md) |
| **entries**    | [TagEntry[]](#TagEntry)     |

## TagEntry

**Properties**

| Name      | Type        |
|-----------|-------------|
| **entry** | [Tag](#Tag) |

## TagBody

**Properties**

| Name    | Type   |
|---------|--------|
| **tag** | string |

## Tag

**Properties**

| Name    | Type   |
|---------|--------|
| **id**  | string |
| **tag** | string |
| count   | number |





