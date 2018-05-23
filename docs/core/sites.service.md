---
Added: v2.0.0
Status: Active
Last reviewed: 2018-03-21
---

# Sites service

Accesses and manipulates sites from a Content Services repository.

## Class members

### Methods

-   **deleteSite**(siteId: `string` = `null`, permanentFlag: `boolean` = `true`): `Observable<any>`<br/>
    Deletes a site.
    -   _siteId:_ `string`  - Site to delete
    -   _permanentFlag:_ `boolean`  - True: deletion is permanent; False: site is moved to the trash
    -   **Returns** `Observable<any>` - Null response notifying when the operation is complete
-   **getEcmCurrentLoggedUserName**(): `string`<br/>
    Gets the username of the user currently logged into ACS.
    -   **Returns** `string` - Username string
-   **getSite**(siteId: `string` = `null`, opts?: `any` = `null`): `Observable<SiteEntry>`<br/>
    Gets the details for a site.
    -   _siteId:_ `string`  - ID of the target site
    -   _opts:_ `any`  - (Optional) Options supported by JSAPI
    -   **Returns** `Observable<SiteEntry>` - Information about the site
-   **getSiteContent**(siteId: `string` = `null`): `Observable<SiteEntry>`<br/>
    Gets a site's content.
    -   _siteId:_ `string`  - ID of the target site
    -   **Returns** `Observable<SiteEntry>` - Site content
-   **getSiteMembers**(siteId: `string` = `null`): `Observable<SiteEntry>`<br/>
    Gets a list of all a site's members.
    -   _siteId:_ `string`  - ID of the target site
    -   **Returns** `Observable<SiteEntry>` - Site members
-   **getSites**(opts: `any` = `{}`): `Observable<SitePaging>`<br/>
    Gets a list of all sites in the repository.
    -   _opts:_ `any`  - Options supported by JSAPI
    -   **Returns** `Observable<SitePaging>` - List of sites

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
