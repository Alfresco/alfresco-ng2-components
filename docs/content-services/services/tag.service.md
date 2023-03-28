---
Title: Tag service
Added: v2.0.0
Status: Active
Last reviewed: 2018-11-13
---

# [Tag service](../../../lib/content-services/src/lib/tag/services/tag.service.ts "Defined in tag.service.ts")

Manages tags in Content Services.

## Class members

### Methods

-   **addTag**(nodeId: `string`, tagName: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TagEntry`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/TagEntry.md)`>`<br/>
    Adds a tag to a node.
    -   _nodeId:_ `string`  - ID of the target node
    -   _tagName:_ `string`  - Name of the tag to add
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TagEntry`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/TagEntry.md)`>` - TagEntry object (defined in JS-API) with details of the new tag
-   **getAllTheTags**(opts?: `any`, includedCounts?: `boolean`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TagPaging`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/TagPaging.md)`>`<br/>
    Gets a list of all the tags already defined in the repository.
    -   _opts:_ `any`  - (Optional) Options supported by JS-API
    -   _includedCounts:_ `boolean`  - (Optional) True if count field should be included in response object for each tag, false otherwise.
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TagPaging`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/TagPaging.md)`>` - TagPaging object (defined in JS-API) containing the tags
-   **getTagsByNodeId**(nodeId: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TagPaging`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/TagPaging.md)`>`<br/>
    Gets a list of tags added to a node.
    -   _nodeId:_ `string`  - ID of the target node
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TagPaging`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/TagPaging.md)`>` - TagPaging object (defined in JS-API) containing the tags
-   **removeTag**(nodeId: `string`, tag: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<any>`<br/>
    Removes a tag from a node.
    -   _nodeId:_ `string`  - ID of the target node
    -   _tag:_ `string`  - Name of the tag to remove
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<any>` - Null object when the operation completes
-   **deleteTag**(tagId: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<void>`<br/>
    Completely deletes a tag, this will cause the tag to be removed from all the nodes.
    -   _tagId:_ `string`  - ID of the tag to remove
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<void>` - Null object when the operation completes
-   **createTags**(tags: `TagBody[]`): [`Observable`](http://reactivex.io/documentation/observable.html)`<TagEntry[]>`<br/>
    Creates tags.
    -   _tags:_ `TagBody[]`  - List of tags to create.
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<TagEntry[]>` - List of created tags.
-   **updateTag**(tagId: `string`, tagBody: `TagBody`): [`Observable`](http://reactivex.io/documentation/observable.html)`<TagEntry>`<br/>
    Updates a tag.
    -   _tagId:_ `string`  - The identifier of a tag.
    -   _tagBody:_ `TagBody`  - The updated tag.
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<TagEntry>` - Updated tag.
-   **searchTags**(name: `string`, sorting?: `{ orderBy: string, direction: string }`, includedCounts?: `boolean`, skipCount: `number`): [`Observable`](http://reactivex.io/documentation/observable.html)`<ResultSetPaging>`<br/>
    Find tags which name contains searched name.
    -   _name:_ `string` - Value for name which should be used during searching tags.
    -   _sorting:_ `{ orderBy: string, direction: string }` - Object which configures sorting. OrderBy field specifies field used for sorting, direction specified ascending or descending direction. Default sorting is ascending by tag field.
    -   _includedCounts:_ `boolean` - True if count field should be included in response object for each tag, false otherwise.
    -   _skipCount:_ `number` - Specify how many first results should be skipped. Default 0.
    -   _maxItems:_ `number` - Specify max number of returned tags. Default is specified by UserPreferencesService.
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<ResultSetPaging>` - Found tags which name contains searched name.
-   **getCountersForTags**(tags: `string[]`): [`Observable`](http://reactivex.io/documentation/observable.html)`<ResultSetContextFacetQueries[]>`<br/>
    Get usage counters for passed tags.
    -   _tags:_ `string[]`  - Array of tags names for which there should be returned counters.
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<ResultSetContextFacetQueries[]>` - Array of usage counters for specified tags.
-   **findTagByName**(name: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<TagEntry>`<br/>
    Find tag which name matches exactly to passed name.
    -   _name:_ `string`  - Value for name which should be used during finding exact tag.
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<TagEntry>` - Found tag which name matches exactly to passed name.
-   **assignTagsToNode**(nodeId: `string`, tags: `TagBody[]`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TagPaging`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/TagPaging.md)`>`<br/>
    Assign tags to node. If tag is new then tag is also created additionally, if tag already exists then it is just assigned.
    -   _nodeId:_ `string`  - Id of node to which tags should be assigned.
    -   _tags:_ `TagBody[]`  - List of tags to create and assign or just assign if they already exist.
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TagPaging`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/TagPaging.md)`|`[`TagEntry`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/TagEntry.md)`>` - Just linked tags to node or single tag if linked only one tag.

## Details

Content Services supports
[tagging](http://docs.alfresco.com/5.2/tasks/site-content-tag.html)
of file and folder nodes to assist with searches. A tag is a short
text string added to an item, rather like a hashtag in social media.

Usually, it is wise to let the user see a list of existing tags and let
them choose one by clicking. If they type a tag name with incorrect spelling
then it will be treated as a new tag, even though that was not intended.
Use `getAllTheTags` to find all tags in the repository when you need to
construct a list like this.

See the
[Tags API](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/TagsApi.md)
in the Alfresco JS API for more information about the types returned by [Tag
service](tag.service.md) methods and for the implementation of the REST API the service is
based on.

## See also

-   [Tag list component](../components/tag-list.component.md)
