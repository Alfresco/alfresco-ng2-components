# CommentsApi

All URIs are relative to *https://localhost/alfresco/api/-default-/public/alfresco/versions/1*

| Method                          | HTTP request                                    | Description      |
|---------------------------------|-------------------------------------------------|------------------|
| [createComment](#createComment) | **POST** /nodes/{nodeId}/comments               | Create a comment |
| [deleteComment](#deleteComment) | **DELETE** /nodes/{nodeId}/comments/{commentId} | Delete a comment |
| [listComments](#listComments)   | **GET** /nodes/{nodeId}/comments                | List comments    |
| [updateComment](#updateComment) | **PUT** /nodes/{nodeId}/comments/{commentId}    | Update a comment |

## createComment

Create a comment

You specify the comment in a JSON body like this:

```json
{
  "content": "This is a comment"
}
```

**Note:** You can create more than one comment by specifying a list of comments in the JSON body like this:

```json
[
  {
    "content": "This is a comment"
  },
  {
    "content": "This is another comment"
  }
]
```

If you specify a list as input, then a paginated list rather than an entry is returned in the response body. 
For example:

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
        "entry": {}
      },
      {
        "entry": {}
      }
    ]
  }
}
```

**Parameters**

| Name                  | Type                        | Description                                                                                                                                                                                                                                                                                                                                                                                                                             |
|-----------------------|-----------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **nodeId**            | string                      | The identifier of a node.                                                                                                                                                                                                                                                                                                                                                                                                               |
| **commentBodyCreate** | [CommentBody](#CommentBody) | The comment text. Note that you can also provide a list of comments.                                                                                                                                                                                                                                                                                                                                                                    | 
| opts.fields           | string[]                    | A list of field names. You can use this parameter to restrict the fields returned within a response if, for example, you want to save on overall bandwidth. The list applies to a returned individual entity or entries within a collection. If the API method also supports the **include** parameter, then the fields specified in the **include** parameter are returned in addition to those specified in the **fields** parameter. | 

**Return type**: [CommentEntry](#CommentEntry)

**Example**

```javascript
import { AlfrescoApi, CommentsApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const commentsApi = new CommentsApi(alfrescoApi);
const opts = {};
const commentBodyCreate = {};

commentsApi.createComment(`<nodeId>`, commentBodyCreate, opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
});
```

## deleteComment

Delete a comment

**Parameters**

| Name          | Type   | Description                  |
|---------------|--------|------------------------------|
| **nodeId**    | string | The identifier of a node.    |  
| **commentId** | string | The identifier of a comment. |

**Example**

```javascript
import { AlfrescoApi, CommentsApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const commentsApi = new CommentsApi(alfrescoApi);

commentsApi.deleteComment(`<nodeId>`, `<commentId>`).then(() => {
  console.log('API called successfully.');
});
```

## listComments

Gets a list of comments for the node **nodeId**, sorted chronologically with the newest comment first.

**Parameters**

| Name           | Type     | Description                                                                                                                                                                                                                                                                                                                                                                                                                              | Notes          |
|----------------|----------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------|
| **nodeId**     | string   | The identifier of a node.                                                                                                                                                                                                                                                                                                                                                                                                                |                |
| opts.skipCount | number   | The number of entities that exist in the collection before those included in this list. If not supplied then the default value is 0.                                                                                                                                                                                                                                                                                                     | default to 0   |
| opts.maxItems  | number   | The maximum number of items to return in the list. If not supplied then the default value is 100.                                                                                                                                                                                                                                                                                                                                        | default to 100 |
| opts.fields    | string[] | A list of field names. You can use this parameter to restrict the fields returned within a response if, for example, you want to save on overall bandwidth. The list applies to a returned individual  entity or entries within a collection. If the API method also supports the **include** parameter, then the fields specified in the **include** parameter are returned in addition to those specified in the **fields** parameter. |                |

**Return type**: [CommentPaging](#CommentPaging)

**Example**

```javascript
import { AlfrescoApi, CommentsApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const commentsApi = new CommentsApi(alfrescoApi);
const opts = {};

commentsApi.listComments(`<nodeId>`, opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
});
```

## updateComment

Update a comment

**Parameters**

| Name                  | Type                        | Description                                                                                                                                                                                                                                                                                                                                                                                                                             |
|-----------------------|-----------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **nodeId**            | string                      | The identifier of a node.                                                                                                                                                                                                                                                                                                                                                                                                               |
| **commentId**         | string                      | The identifier of a comment.                                                                                                                                                                                                                                                                                                                                                                                                            |
| **commentBodyUpdate** | [CommentBody](#CommentBody) | The JSON representing the comment to be updated.                                                                                                                                                                                                                                                                                                                                                                                        |
| opts.fields           | string[]                    | A list of field names. You can use this parameter to restrict the fields returned within a response if, for example, you want to save on overall bandwidth. The list applies to a returned individual entity or entries within a collection. If the API method also supports the **include** parameter, then the fields specified in the **include** parameter are returned in addition to those specified in the **fields** parameter. |

**Return type**: [CommentEntry](#CommentEntry)

**Example**

```javascript
import { AlfrescoApi, CommentsApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const commentsApi = new CommentsApi(alfrescoApi);
const commentBodyUpdate = {};
const opts = {};

commentsApi.updateComment(`<nodeId>`, `<commentId>`, commentBodyUpdate, opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
});
```

# Models

## CommentBody

**Properties**

| Name        | Type   |
|-------------|--------|
| **content** | string |

## CommentPaging

**Properties**

| Name | Type                                    |
|------|-----------------------------------------|
| list | [CommentPagingList](#CommentPagingList) |

## CommentPagingList

**Properties**

| Name       | Type                            |
|------------|---------------------------------|
| pagination | [Pagination](Pagination.md)     |
| entries    | [CommentEntry[]](#CommentEntry) |

## CommentEntry

**Properties**

| Name      | Type                |
|-----------|---------------------|
| **entry** | [Comment](#Comment) |

## Comment

**Properties**

| Name           | Type                |
|----------------|---------------------|
| **id**         | string              |
| **title**      | string              |
| **content**    | string              |
| **createdBy**  | [Person](Person.md) |
| **createdAt**  | Date                |
| **edited**     | boolean             |
| **modifiedBy** | [Person](Person.md) |
| **modifiedAt** | Date                |
| **canEdit**    | boolean             |
| **canDelete**  | boolean             |