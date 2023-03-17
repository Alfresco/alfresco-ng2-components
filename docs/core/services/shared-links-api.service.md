---
Title: Shared Links Api service
Added: v2.0.0
Status: Active
Last reviewed: 2018-06-08
---

# [Shared Links Api service](../../../lib/content-services/src/lib/content-node-share/services/shared-links-api.service.ts "Defined in shared-links-api.service.ts")

Finds shared links to Content Services items.

## Class members

### Methods

-   **createSharedLinks**(nodeId: `string`, options: `any` = `{}`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`SharedLinkEntry`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/SharedLinkEntry.md)`>`<br/>
    Creates a shared link available to the current user.
    -   _nodeId:_ `string`  - ID of the node to link to
    -   _options:_ `any`  - Options supported by JS-API
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`SharedLinkEntry`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/SharedLinkEntry.md)`>` - The shared link just created
-   **deleteSharedLink**(sharedId: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<any|Error>`<br/>
    Deletes a shared link.
    -   _sharedId:_ `string`  - ID of the link to delete
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<any|Error>` - Null response notifying when the operation is complete
-   **getSharedLinks**(options: `any` = `{}`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`NodePaging`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/NodePaging.md)`>`<br/>
    Gets shared links available to the current user.
    -   _options:_ `any`  - Options supported by JS-API
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`NodePaging`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/NodePaging.md)`>` - List of shared links

## Details

Content Services allows users to generate URLs that can be shared with
other people, even if they don't have a Content Services account. These
URLs are known as _shared links_.

Use `getSharedLinks` to find all the shared links that are available to
the current user. You can supply a number of `options` to refine the
search; see the
[Alfresco JS API](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/SharedlinksApi.md#findsharedlinks)
for more information.
