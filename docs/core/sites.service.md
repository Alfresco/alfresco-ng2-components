---
Added: v2.0.0
Status: Active
Last reviewed: 2018-03-21
---

# Sites service

Accesses and manipulates sites from a Content Services repository.

## Class members

### Methods

-   `deleteSite(siteId: string = null, permanentFlag: boolean = true): Observable<any>`<br/>
    Deletes a site.
    -   `siteId: string = null` -  Site to delete
    -   `permanentFlag: boolean = true` -  True: deletion is permanent; False: site is moved to the trash
    -   **Returns** `Observable<any>` - 
-   `getEcmCurrentLoggedUserName(): string`<br/>
    Gets the username of the user currently logged into ACS.
    -   **Returns** `string` - 
-   `getSite(siteId: string = null, opts?: any = null): Observable<SiteEntry>`<br/>
    Gets the details for a site.
    -   `siteId: string = null` -  ID of the target site
    -   `opts?: any = null` - (Optional) Options supported by JSAPI
    -   **Returns** `Observable<SiteEntry>` - 
-   `getSiteContent(siteId: string = null): Observable<SiteEntry>`<br/>
    Gets a site's content.
    -   `siteId: string = null` -  ID of the target site
    -   **Returns** `Observable<SiteEntry>` - 
-   `getSiteMembers(siteId: string = null): Observable<SiteEntry>`<br/>
    Gets a list of all a site's members.
    -   `siteId: string = null` -  ID of the target site
    -   **Returns** `Observable<SiteEntry>` - 
-   `getSites(opts: any =  {}): Observable<SitePaging>`<br/>
    Gets a list of all sites in the repository.
    -   `opts: any =  {}` -  Options supported by JSAPI
    -   **Returns** `Observable<SitePaging>` -

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

## See also

-   [Site model](site.model.md)
