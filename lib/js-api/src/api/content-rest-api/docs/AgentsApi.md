# AgentsApi

| Method                            | HTTP request                                 | Description              |
|-----------------------------------|----------------------------------------------|--------------------------|
| [getAgents](#getAgents)           | **GET** /agents                              | Gets all agents.         |

## getAgents

Gets all agents.
A paginated list is returned in the response body. For example:

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
            "id": "Some id",
            "name": "Some name"
        }
      }
    ]
  }
}
```

**Example**

```javascript
import { AlfrescoApi, AgentsApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const agentsApi = new AgentsApi(alfrescoApi);

agentsApi.getAgents().then((agents) => {
  console.log('API called successfully. Returned data: ' + agents);
});
```

**Return type**: [AgentPaging](#AgentPaging)

# Models

## AgentPaging

**Properties**

| Name | Type                                |
|------|-------------------------------------|
| list | [AgentPagingList](#AgentPagingList) |

## AgentPagingList

**Properties**

| Name           | Type                        |
|----------------|-----------------------------|
| **pagination** | [Pagination](Pagination.md) |
| **entries**    | [AgentEntry[]](#AgentEntry) |

## AgentEntry

**Properties**

| Name      | Type            |
|-----------|-----------------|
| **entry** | [Agent](#Agent) |

## Agent

**Properties**

| Name            | Type   |
|-----------------|--------|
| **id**          | string |
| **name**        | string |
| **description** | string |
