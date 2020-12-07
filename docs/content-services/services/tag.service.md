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

*   **addTag**(nodeId: `string`, tagName: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TagEntry`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/TagEntry.md)`>`<br/>
    Adds a tag to a node.
    *   *nodeId:* `string`  - ID of the target node
    *   *tagName:* `string`  - Name of the tag to add
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TagEntry`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/TagEntry.md)`>` - TagEntry object (defined in JS-API) with details of the new tag
*   **getAllTheTags**(opts?: `any`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TagPaging`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/TagPaging.md)`>`<br/>
    Gets a list of all the tags already defined in the repository.
    *   *opts:* `any`  - (Optional) Options supported by JS-API
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TagPaging`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/TagPaging.md)`>` - TagPaging object (defined in JS-API) containing the tags
*   **getTagsByNodeId**(nodeId: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TagPaging`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/TagPaging.md)`>`<br/>
    Gets a list of tags added to a node.
    *   *nodeId:* `string`  - ID of the target node
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TagPaging`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/TagPaging.md)`>` - TagPaging object (defined in JS-API) containing the tags
*   **removeTag**(nodeId: `string`, tag: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<any>`<br/>
    Removes a tag from a node.
    *   *nodeId:* `string`  - ID of the target node
    *   *tag:* `string`  - Name of the tag to remove
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<any>` - Null object when the operation completes

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

*   [Tag list component](../components/tag-list.component.md)
