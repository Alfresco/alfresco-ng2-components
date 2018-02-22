---
Added: v2.0.0
Status: Active
---
# Shared Links Api service

Finds shared links to Content Services items.

## Methods

-   `getSharedLinks(options: any = {}): Observable<NodePaging>`  
    Gets shared links available to the current user.  
    -   `options` - Options supported by JSAPI

## Details

Content Services allows users to generate URLs that can be shared with
other people, even if they don't have a Content Services account. These
URLs are known as _shared links_.

Use `getSharedLinks` to find all the shared links that are available to
the current user. You can supply a number of `options` to refine the
search; see the
[Alfresco JS API](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/SharedlinksApi.md#findsharedlinks)
for more information.
