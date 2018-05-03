---
Added: v2.0.0
Status: Active
Last reviewed: 2018-03-21
---

# Sites service

Accesses and manipulates sites from a Content Services repository.

## Class members

### Methods

-   `getSites(opts: any = {}): Observable<SitePaging>`  
    Gets a list of all sites in the repository.  
    -   `opts` - Options supported by JSAPI
-   `getSite(siteId: string, opts?: any): Observable<SiteEntry>`  
    Gets the details for a site.  
    -   `siteId` - ID of the target site
    -   `opts` - (Optional) Options supported by JSAPI
-   `deleteSite(siteId: string, permanentFlag: boolean = true): Observable<any>`  
    Deletes a site.  
    -   `siteId` - Site to delete
    -   `permanentFlag` - True: deletion is permanent; False: site is moved to the trash
-   `getSiteContent(siteId: string): Observable<SiteEntry>`  
    Gets a site's content.  
    -   `siteId` - ID of the target site
-   `getSiteMembers(siteId: string): Observable<SiteEntry>`  
    Gets a list of all a site's members.  
    -   `siteId` - ID of the target site
-   `getEcmCurrentLoggedUserName(): string`  
    Gets the username of the user currently logged into ACS.  

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
