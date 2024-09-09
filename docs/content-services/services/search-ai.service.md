---
Title: Search Ai service
Added: v6.9.1
Status: Active
Last reviewed: 2024-07-12
---

# [Search Ai service](../../../lib/content-services/src/lib/search-ai/services/search-ai.service.ts "Defined in search-ai.service.ts")

Manages search AI in Content Services.

## Class members

### Methods

-   **updateSearchAiInputState**(state: `SearchAiInputState`): `void`<br/>
    Update the state of the search AI input.
    -   _state:_ `SearchAiInputState` - The new state of the search AI input.
-   **ask**(question: [`QuestionRequest`](../../../lib/js-api/src/api/content-rest-api/docs/SearchAiApi.md#questionrequest)): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`QuestionModel`](../../../lib/js-api/src/api/content-rest-api/docs/SearchAiApi.md#questionmodel)`>`<br/>
    Ask a question to the AI.
    -   _question:_ [`QuestionRequest`](../../../lib/js-api/src/api/content-rest-api/docs/SearchAiApi.md#questionrequest) - The question to ask.
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`QuestionModel`](../../../lib/js-api/src/api/content-rest-api/docs/SearchAiApi.md#questionmodel)`>` - QuestionModel object containing information about questions.
-   **getAnswer**(questionId: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`AiAnswerEntry`](../../../lib/js-api/src/api/content-rest-api/docs/SearchAiApi.md#aianswerentry)`>`<br/>
    Get an answer to specific question.
    -   _questionId:_ `string` - The ID of the question to get an answer for.
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`AiAnswerEntry`](../../../lib/js-api/src/api/content-rest-api/docs/SearchAiApi.md#aianswerentry)`>` - AiAnswerEntry object containing the answer.
-   **getConfig**(): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`KnowledgeRetrievalConfigEntry`](../../../lib/js-api/src/api/content-rest-api/docs/SearchAiApi.md#knowledgeretrievalconfigentry)`>`<br/>
    Get the knowledge retrieval configuration.
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`KnowledgeRetrievalConfigEntry`](../../../lib/js-api/src/api/content-rest-api/docs/SearchAiApi.md#knowledgeretrievalconfigentry)`>` - KnowledgeRetrievalConfigEntry object containing the configuration.
-   **checkSearchAvailability**(selectedNodesState: `SelectionState`, maxSelectedNodes: `number`): `string`<br/>
    Check if using of search is possible (if all conditions are met).
    -   _selectedNodesState:_ `SelectionState` - information about selected nodes.
    -   _maxSelectedNodes:_ `number` - max number of selected nodes. Default 100.
    -   **Returns** `string` - string with error if any condition is not met, empty string otherwise.

## Details

See the
[Search Ai API](../../../lib/js-api/src/api/content-rest-api/docs/SearchAiApi.md) for more information about the types returned by [Search Ai
service](search-ai.service.md) methods and for the implementation of the REST API the service is
based on.
