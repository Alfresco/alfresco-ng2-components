---
Title: Sites service
Added: v2.0.0
Status: Active
Last reviewed: 2018-11-13
---

# [Sites service](../../../lib/content-services/src/lib/common/services/sites.service.ts "Defined in sites.service.ts")

Accesses and manipulates sites from a Content Services repository.

## Class members

### Methods

-   **approveSiteMembershipRequest**(siteId: `string`, inviteeId: `string`, opts?: `any`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`SiteMembershipRequestWithPersonPaging`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/SiteMembershipRequestWithPersonPaging.md)`>`<br/>
    Accept site membership requests.
    -   _siteId:_ `string`  - The identifier of a site.
    -   _inviteeId:_ `string`  - The invitee user name.
    -   _opts:_ `any`  - (Optional) Options supported by JS-API
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`SiteMembershipRequestWithPersonPaging`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/SiteMembershipRequestWithPersonPaging.md)`>` - Null response notifying when the operation is complete
-   **createSite**(siteBody: `SiteBodyCreate`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`SiteEntry`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/SiteEntry.md)`>`<br/>
    Create a site
    -   _siteBody:_ `SiteBodyCreate`  - SiteBodyCreate to create site
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`SiteEntry`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/SiteEntry.md)`>` - site SiteEntry
-   **createSiteGroupMembership**(siteId: `string`, siteMembershipBodyCreate: [`SiteMembershipBodyCreate`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/SiteMembershipBodyCreate.md)): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`SiteGroupEntry`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/SiteGroupEntry.md)`>`<br/>
    Create a site membership for group
    -   _siteId:_ `string`  - The identifier of a site.
    -   _siteMembershipBodyCreate:_ [`SiteMembershipBodyCreate`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/SiteMembershipBodyCreate.md)  - The Group to add and its role
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`SiteGroupEntry`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/SiteGroupEntry.md)`>` - [Observable](http://reactivex.io/documentation/observable.html)&lt;SiteGroupEntry>
-   **createSiteMembership**(siteId: `string`, siteMembershipBodyCreate: [`SiteMembershipBodyCreate`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/SiteMembershipBodyCreate.md), opts?: `any`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`SiteMemberEntry`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/SiteMemberEntry.md)`>`<br/>
    Creates a site membership for person **personId** on site **siteId**.
    -   _siteId:_ `string`  - The identifier of a site
    -   _siteMembershipBodyCreate:_ [`SiteMembershipBodyCreate`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/SiteMembershipBodyCreate.md)  - The person to add and their role
    -   _opts:_ `any`  - (Optional) Optional parameters
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`SiteMemberEntry`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/SiteMemberEntry.md)`>` - [Observable](http://reactivex.io/documentation/observable.html)&lt;SiteMemberEntry>
-   **deleteSite**(siteId: `string`, permanentFlag: `boolean` = `true`): [`Observable`](http://reactivex.io/documentation/observable.html)`<any>`<br/>
    Deletes a site.
    -   _siteId:_ `string`  - Site to delete
    -   _permanentFlag:_ `boolean`  - True: deletion is permanent; False: site is moved to the trash
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<any>` - Null response notifying when the operation is complete
-   **deleteSiteGroupMembership**(siteId: `string`, groupId: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<void>`<br/>
    Delete a group membership for site
    -   _siteId:_ `string`  - The identifier of a site.
    -   _groupId:_ `string`  - The authorityId of a group.
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<void>` - [`Observable`](http://reactivex.io/documentation/observable.html)&lt;void>
-   **deleteSiteMembership**(siteId: `string`, personId: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<void>`<br/>
    Delete a site membership
    -   _siteId:_ `string`  - The identifier of a site.
    -   _personId:_ `string`  - The identifier of a person.
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<void>` - Null response notifying when the operation is complete
-   **getEcmCurrentLoggedUserName**(): `string`<br/>
    Gets the username of the user currently logged into ACS.
    -   **Returns** `string` - Username string
-   **getSite**(siteId: `string`, opts?: `any`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`SiteEntry`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/SiteEntry.md)`|any>`<br/>
    Gets the details for a site.
    -   _siteId:_ `string`  - ID of the target site
    -   _opts:_ `any`  - (Optional) Options supported by JS-API
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`SiteEntry`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/SiteEntry.md)`|any>` - Information about the site
-   **getSiteContent**(siteId: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`SiteEntry`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/SiteEntry.md)`|any>`<br/>
    Gets a site's content.
    -   _siteId:_ `string`  - ID of the target site
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`SiteEntry`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/SiteEntry.md)`|any>` - Site content
-   **getSiteGroupMembership**(siteId: `string`, groupId: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`SiteGroupEntry`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/SiteGroupEntry.md)`>`<br/>
    Get information about site membership of group
    -   _siteId:_ `string`  - The identifier of a site.
    -   _groupId:_ `string`  - The authorityId of a group.
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`SiteGroupEntry`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/SiteGroupEntry.md)`>` - [Observable](http://reactivex.io/documentation/observable.html)&lt;SiteGroupEntry>
-   **getSiteMembers**(siteId: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`SiteEntry`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/SiteEntry.md)`|any>`<br/>
    Gets a list of all a site's members.
    -   _siteId:_ `string`  - ID of the target site
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`SiteEntry`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/SiteEntry.md)`|any>` - Site members
-   **getSiteMembershipRequests**(opts?: `any`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`SiteMembershipRequestWithPersonPaging`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/SiteMembershipRequestWithPersonPaging.md)`>`<br/>
    Gets a list of site membership requests.
    -   _opts:_ `any`  - (Optional) Options supported by JS-API
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`SiteMembershipRequestWithPersonPaging`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/SiteMembershipRequestWithPersonPaging.md)`>` - Site membership requests
-   **getSiteNameFromNodePath**(node: [`MinimalNode`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/NodeMinimalEntry.md)): `string`<br/>
    Looks for a site inside the path of a Node and returns its guid if it finds one. (return an empty string if no site is found)
    -   _node:_ [`MinimalNode`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/NodeMinimalEntry.md)  - Node to look for parent site
    -   **Returns** `string` - Site guid
-   **getSites**(opts: `any` = `{}`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`SitePaging`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/SitePaging.md)`>`<br/>
    Gets a list of all sites in the repository.
    -   _opts:_ `any`  - Options supported by JS-API
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`SitePaging`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/SitePaging.md)`>` - List of sites
-   **listSiteGroups**(siteId: `string`, opts?: `any`): [`Observable`](http://reactivex.io/documentation/observable.html)`<SiteGroupPaging>`<br/>
    List group membership for site
    -   _siteId:_ `string`  - The identifier of a site.
    -   _opts:_ `any`  - (Optional) Options supported by JS-API
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<SiteGroupPaging>` - [`Observable`](http://reactivex.io/documentation/observable.html)&lt;SiteGroupPaging>
-   **listSiteMemberships**(siteId: `string`, opts: `any`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`SiteMemberPaging`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/SiteMemberPaging.md)`>`<br/>
    Gets a list of all a site's members.
    -   _siteId:_ `string`  - ID of the target site
    -   _opts:_ `any`  - Optional parameters supported by JS-API
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`SiteMemberPaging`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/SiteMemberPaging.md)`>` - [Observable](http://reactivex.io/documentation/observable.html)&lt;SiteMemberPaging>
-   **rejectSiteMembershipRequest**(siteId: `string`, inviteeId: `string`, opts?: `any`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`SiteMembershipRequestWithPersonPaging`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/SiteMembershipRequestWithPersonPaging.md)`>`<br/>
    Reject site membership requests.
    -   _siteId:_ `string`  - The identifier of a site.
    -   _inviteeId:_ `string`  - The invitee user name.
    -   _opts:_ `any`  - (Optional) Options supported by JS-API
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`SiteMembershipRequestWithPersonPaging`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/SiteMembershipRequestWithPersonPaging.md)`>` - Null response notifying when the operation is complete
-   **updateSiteGroupMembership**(siteId: `string`, groupId: `string`, siteMembershipBodyUpdate: [`SiteMembershipBodyUpdate`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/SiteMembershipBodyUpdate.md)): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`SiteGroupEntry`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/SiteGroupEntry.md)`>`<br/>
    Update site membership of group
    -   _siteId:_ `string`  - The identifier of a site.
    -   _groupId:_ `string`  - The authorityId of a group.
    -   _siteMembershipBodyUpdate:_ [`SiteMembershipBodyUpdate`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/SiteMembershipBodyUpdate.md)  - The group new role
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`SiteGroupEntry`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/SiteGroupEntry.md)`>` - [Observable](http://reactivex.io/documentation/observable.html)&lt;SiteGroupEntry>
-   **updateSiteMembership**(siteId: `string`, personId: `string`, siteMembershipBodyUpdate: [`SiteMembershipBodyUpdate`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/SiteMembershipBodyUpdate.md), opts?: `any`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`SiteMemberEntry`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/SiteMemberEntry.md)`>`<br/>
    Update a site membership
    -   _siteId:_ `string`  - The identifier of a site.
    -   _personId:_ `string`  - The identifier of a person.
    -   _siteMembershipBodyUpdate:_ [`SiteMembershipBodyUpdate`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/SiteMembershipBodyUpdate.md)  - The persons new role
    -   _opts:_ `any`  - (Optional) Optional parameters
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`SiteMemberEntry`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/SiteMemberEntry.md)`>` - [Observable](http://reactivex.io/documentation/observable.html)&lt;SiteMemberEntry>

## Details

You can use `getSites` to get a list of all sites in the repository.
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
