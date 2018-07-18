---
Added: v2.0.0
Status: Active
Last reviewed: 2018-04-05
---

# Tag service

Manages tags in Content Services.

## Class members

### Methods

-   **addTag**(nodeId: `string`, tagName: `string`): `any`<br/>
    Adds a tag to a node.
    -   _nodeId:_ `string`  - ID of the target node
    -   _tagName:_ `string`  - Name of the tag to add
    -   **Returns** `any` - TagEntry object (defined in JSAPI) with details of the new tag
-   **getAllTheTags**(): [`Observable`](http://reactivex.io/documentation/observable.html)`<any>`<br/>
    Gets a list of all the tags already defined in the repository.
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<any>` - TagPaging object (defined in JSAPI) containing the tags
-   **getTagsByNodeId**(nodeId: `string`): `any`<br/>
    Gets a list of tags added to a node.
    -   _nodeId:_ `string`  - ID of the target node
    -   **Returns** `any` - TagPaging object (defined in JSAPI) containing the tags
-   **removeTag**(nodeId: `string`, tag: `string`): `any`<br/>
    Removes a tag from a node.
    -   _nodeId:_ `string`  - ID of the target node
    -   _tag:_ `string`  - Name of the tag to remove
    -   **Returns** `any` - Null object when the operation completes

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
service](../content-services/tag.service.md) methods and for the implementation of the REST API the service is
based on.

## See also

-   [Tag list component](tag-list.component.md)
