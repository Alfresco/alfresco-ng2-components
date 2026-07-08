# SearchAiApi

| Method                  | HTTP request              | Description                                |
|-------------------------|---------------------------|--------------------------------------------|
| [getConfig](#getconfig) | **GET** /config/-default- | Get the knowledge retrieval configuration. |

## getConfig

Get the knowledge retrieval configuration. For example:

```json
{
    "entry": {
        "knowledgeRetrievalUrl": "https://some-url"
    }
}
```

**Example**

```javascript
import { AlfrescoApi, SearchAiApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const searchAiApi = new SearchAiApi(alfrescoApi);

searchAiApi.getConfig().then((answer) => {
  console.log('API called successfully. Returned data: ', answer.entry.knowledgeRetrievalUrl);
});
```

**Return type**: [KnowledgeRetrievalConfigEntry](#KnowledgeRetrievalConfigEntry)

# Models

## KnowledgeRetrievalConfigEntry

**Properties**

| Name  | Type                                                  |
|-------|-------------------------------------------------------|
| entry | [KnowledgeRetrievalConfig](#KnowledgeRetrievalConfig) |

## KnowledgeRetrievalConfig

**Properties**

| Name                  | Type   |
|-----------------------|--------|
| knowledgeRetrievalUrl | string |
