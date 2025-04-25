# SearchAiApi

| Method                  | HTTP request               | Description                                |
|-------------------------|----------------------------|--------------------------------------------|
| [ask](#ask)             | **GET** /questions         | Ask a question to the AI.                  |
| [getAnswer](#getAnswer) | **GET** /answers/-default- | Get an answer to specific question.        |
| [getConfig](#getConfig) | **GET** /config/-default-  | Get the knowledge retrieval configuration. |

## ask

Ask a question to the AI.
A list is returned in the response body. For example:

```json
[
    {
        "question": "Some question",
        "questionId": "Some question id",
        "restrictionQuery": "Some restriction query"
    }
]
```

**Example**

```javascript
import { AlfrescoApi, AgentsApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const searchAiApi = new SearchAiApi(alfrescoApi);

searchAiApi.ask([{
    question: 'Some question',
    restrictionQuery: 'Some restriction query',
    agentId: 'Some agent id'
}]).then((questionInformation) => {
  console.log('API called successfully. Returned data: ' + questionInformation);
});
```
**Parameters**

| Name          | Type                                  | Description           |
|---------------|---------------------------------------|-----------------------|
| **questions** | [QuestionRequest](#QuestionRequest)[] | The questions to ask. | 

**Return type**: [QuestionModel](#QuestionModel)[]

## getAnswer

Get an answer to specific question.
A paginated list is returned in the response body. For example:

```json
{
    "entry": {
        "answer": "Some answer",
        "question": "Some question",
        "complete": true,
        "objectReferences": [
            {
                "objectId": "some-object-id",
                "references": [
                    {
                        "referenceId": "some-reference-id1",
                        "rankScore": 0.031,
                        "rank": 2
                    },
                    {
                        "referenceId": "some-reference-id2",
                        "rankScore": 0.031,
                        "rank": 1
                    },
                    {
                        "referenceId": "some-reference-id3",
                        "rankScore": 0.028,
                        "rank": 3
                    }
                ]
            }
        ]
    }
}
```

**Example**

```javascript
import { AlfrescoApi, AgentsApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const searchAiApi = new SearchAiApi(alfrescoApi);

searchAiApi.getAnswer('some question id').then((answer) => {
  console.log('API called successfully. Returned data: ' + answer);
});
```
**Parameters**

| Name           | Type   | Description                                  |
|----------------|--------|----------------------------------------------|
| **questionId** | string | The ID of the question to get an answer for. | 

**Return type**: [AiAnswerEntry](#AiAnswerEntry)

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
import { AlfrescoApi, AgentsApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const searchAiApi = new SearchAiApi(alfrescoApi);

searchAiApi.getConfig().then((answer) => {
  console.log('API called successfully. Returned data: ', answer.entry.knowledgeRetrievalUrl);
});
```

**Return type**: [KnowledgeRetrievalConfigEntry](#KnowledgeRetrievalConfigEntry)

# Models

## AiAnswerEntry

**Properties**

| Name      | Type                  |
|-----------|-----------------------|
| **entry** | [AiAnswer](#AiAnswer) |

## AiAnswer

**Properties**

| Name                 | Type                                                  |
|----------------------|-------------------------------------------------------|
| **answer**           | string                                                |
| **question**         | string                                                |
| **complete**         | boolean                                               |
| **objectReferences** | [AiAnswerObjectReference](#AiAnswerObjectReference)[] |

## AiAnswerObjectReference

**Properties**

| Name           | Type                                      |
|----------------|-------------------------------------------|
| **objectId**   | string                                    |
| **references** | [AiAnswerReference](#AiAnswerReference)[] |

## AiAnswerReference

**Properties**

| Name            | Type   |
|-----------------|--------|
| **referenceId** | string |
| **rankScore**   | number |
| **rank**        | number |

## QuestionModel

**Properties**

| Name                 | Type             |
|----------------------|------------------|
| **question**         | string           |
| **questionId**       | string           |
| **restrictionQuery** | RestrictionQuery |

## RestrictionQuery

**Properties**

| Name         | Type     |
|--------------|----------|
| **nodesIds** | string[] |

## QuestionRequest

**Properties**

| Name         | Type     |
|--------------|----------|
| **question** | string   |
| **nodeIds**  | string[] |
| **agentId**  | string   |

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
