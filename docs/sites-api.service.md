# Sites Api service

Accesses and manipulates sites from a Content Services repository.

## Methods

`getSites(opts: any = {}): any`<br/>
Gets a list of all sites in the repository.

`getSite(siteId: string, opts?: any): any`<br/>
Gets the details for a site.

`deleteSite(siteId: string, permanentFlag: boolean = true): any`<br/>
Deletes a site.

`getSiteContent(siteId: string): Observable<any>`<br/>
Gets a site's content.

`getSiteMembers(siteId: string): Observable<any>`<br/>
Gets a list of all a site's members.

## Details

You can use `getSites` to get a list of all sites in the repository.
The sites are returned as `Observable<SiteModel[]>` (see
[Site Model](site.model.md) for more information about this class).
If you are only interested in a single site and you have its ID, you
can use `getSite` to access it. Alternatively, you can use `getSiteContent`
or `getSiteMembers` to extract just the `contents` and `members` properties
of the site.

You can also delete a site using `deleteSite`. If the `permanentFlag` parameter
is set to false then the site will be moved to the trash rather than being
deleted immediately.

Both `getSite` and `getSites` have an `opts` parameter to supply extra
options. See the Alfresco JS API docs about
[getSites](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/SitesApi.md#getSites)
and
[getSite](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/SitesApi.md#getSite)
for more information about the available options.

<!-- Don't edit the See also section. Edit seeAlsoGraph.json and run config/generateSeeAlso.js -->
<!-- seealso start -->
## See also

- [Site model](site.model.md)
<!-- seealso end -->



