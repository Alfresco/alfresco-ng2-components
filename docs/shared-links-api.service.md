# Shared Links Api service

Finds shared links to Content Services items.

## Methods

`getSharedLinks(options: any = {}): Observable<NodePaging>`<br/>
Gets shared links available to the current user.

## Details

Content Services allows users to generate URLs that can be shared with
other people, even if they don't have a Content Services account. These
URLs are known as *shared links*.

Use `getSharedLinks` to find all the shared links that are available to
the current user. You can supply a number of `options` to refine the
search; see the
[Alfresco JS API](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/SharedlinksApi.md#findsharedlinks)
for more information.

<!-- Don't edit the See also section. Edit seeAlsoGraph.json and run config/generateSeeAlso.js -->
<!-- seealso start -->

<!-- seealso end -->