---
Added: v2.0.0
Status: Active
---

# Shared Links Api service

Finds shared links to Content Services items.

## Class members

### Methods

-   `createSharedLinks(nodeId: string = null, options: any =  {}): Observable<SharedLinkEntry>`<br/>
    Create a shared links available to the current user.
    -   `nodeId: string = null` -  
    -   `options: any =  {}` -  Options supported by JSAPI
    -   **Returns** `Observable<SharedLinkEntry>` - 
-   `deleteSharedLink(sharedId: string = null): Observable<SharedLinkEntry>`<br/>
    delete shared links
    -   `sharedId: string = null` -  to delete
    -   **Returns** `Observable<SharedLinkEntry>` - 
-   `getSharedLinks(options: any =  {}): Observable<NodePaging>`<br/>
    Gets shared links available to the current user.
    -   `options: any =  {}` -  Options supported by JSAPI
    -   **Returns** `Observable<NodePaging>` -

## Details

Content Services allows users to generate URLs that can be shared with
other people, even if they don't have a Content Services account. These
URLs are known as _shared links_.

Use `getSharedLinks` to find all the shared links that are available to
the current user. You can supply a number of `options` to refine the
search; see the
[Alfresco JS API](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/SharedlinksApi.md#findsharedlinks)
for more information.
