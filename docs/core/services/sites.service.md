---
Title: Sites service
Added: v2.0.0
Status: Active
Last reviewed: 2018-11-13
---

# [Sites service](../../../lib/core/services/sites.service.ts "Defined in sites.service.ts")

Accesses and manipulates sites from a Content Services repository.

## Class members

### Methods

*   **approveSiteMembershipRequest**(siteId: `string`, inviteeId: `string`, opts?: `any`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`SiteMembershipRequestWithPersonPaging`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/SiteMembershipRequestWithPersonPaging.md)`>`<br/>
    Accept site membership requests.
    *   *siteId:* `string`  - The identifier of a site.
    *   *inviteeId:* `string`  - The invitee user name.
    *   *opts:* `any`  - (Optional) Options supported by JS-API
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`SiteMembershipRequestWithPersonPaging`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/SiteMembershipRequestWithPersonPaging.md)`>` - Null response notifying when the operation is complete
*   **createSiteGroupMembership**(siteId: `string`, siteMembershipBodyCreate: [`SiteMembershipBodyCreate`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/SiteMembershipBodyCreate.md)): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`SiteGroupEntry`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/SiteGroupEntry.md)`>`<br/>
    Create a site membership for group
    *   *siteId:* `string`  - The identifier of a site.
    *   *siteMembershipBodyCreate:* [`SiteMembershipBodyCreate`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/SiteMembershipBodyCreate.md)  - The Group to add and its role
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`SiteGroupEntry`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/SiteGroupEntry.md)`>` - Observable\<SiteGroupEntry>
*   **createSiteMembership**(siteId: `string`, siteMembershipBodyCreate: [`SiteMembershipBodyCreate`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/SiteMembershipBodyCreate.md), opts?: `any`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`SiteMemberEntry`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/SiteMemberEntry.md)`>`<br/>
    Creates a site membership for person **personId** on site **siteId**.
    *   *siteId:* `string`  - The identifier of a site
    *   *siteMembershipBodyCreate:* [`SiteMembershipBodyCreate`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/SiteMembershipBodyCreate.md)  - The person to add and their role
    *   *opts:* `any`  - (Optional) Optional parameters
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`SiteMemberEntry`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/SiteMemberEntry.md)`>` - Observable\<SiteMemberEntry>
*   **deleteSite**(siteId: `string`, permanentFlag: `boolean` = `true`): [`Observable`](http://reactivex.io/documentation/observable.html)`<any>`<br/>
    Deletes a site.
    *   *siteId:* `string`  - Site to delete
    *   *permanentFlag:* `boolean`  - True: deletion is permanent; False: site is moved to the trash
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<any>` - Null response notifying when the operation is complete
*   **deleteSiteGroupMembership**(siteId: `string`, groupId: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<void>`<br/>
    Delete a group membership for site
    *   *siteId:* `string`  - The identifier of a site.
    *   *groupId:* `string`  - The authorityId of a group.
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<void>` - Observable\<void>
*   **deleteSiteMembership**(siteId: `string`, personId: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<void>`<br/>
    Delete a site membership
    *   *siteId:* `string`  - The identifier of a site.
    *   *personId:* `string`  - The identifier of a person.
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<void>` - Null response notifying when the operation is complete
*   **getEcmCurrentLoggedUserName**(): `string`<br/>
    Gets the username of the user currently logged into ACS.
    *   **Returns** `string` - Username string
*   **getSite**(siteId: `string`, opts?: `any`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`SiteEntry`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/SiteEntry.md)`|Function>`<br/>
    Gets the details for a site.
    *   *siteId:* `string`  - ID of the target site
    *   *opts:* `any`  - (Optional) Options supported by JS-API
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`SiteEntry`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/SiteEntry.md)`|Function>` - Information about the site
*   **getSiteContent**(siteId: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`SiteEntry`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/SiteEntry.md)`|Function>`<br/>
    Gets a site's content.
    *   *siteId:* `string`  - ID of the target site
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`SiteEntry`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/SiteEntry.md)`|Function>` - Site content
*   **getSiteGroupMembership**(siteId: `string`, groupId: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`SiteGroupEntry`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/SiteGroupEntry.md)`>`<br/>
    Get information about site membership of group
    *   *siteId:* `string`  - The identifier of a site.
    *   *groupId:* `string`  - The authorityId of a group.
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`SiteGroupEntry`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/SiteGroupEntry.md)`>` - Observable\<SiteGroupEntry>
*   **getSiteMembers**(siteId: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`SiteEntry`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/SiteEntry.md)`|Function>`<br/>
    Gets a list of all a site's members.
    *   *siteId:* `string`  - ID of the target site
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`SiteEntry`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/SiteEntry.md)`|Function>` - Site members
*   **getSiteMembershipRequests**(opts?: `any`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`SiteMembershipRequestWithPersonPaging`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/SiteMembershipRequestWithPersonPaging.md)`>`<br/>
    Gets a list of site membership requests.
    *   *opts:* `any`  - (Optional) Options supported by JS-API
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`SiteMembershipRequestWithPersonPaging`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/SiteMembershipRequestWithPersonPaging.md)`>` - Site membership requests
*   **getSiteNameFromNodePath**(node: [`MinimalNode`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/NodeMinimalEntry.md)): `string`<br/>
    Looks for a site inside the path of a [Node](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/Node.md) and returns its guid if it finds one. (return an empty string if no site is found)
    *   *node:* [`MinimalNode`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/NodeMinimalEntry.md)  - [Node](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/Node.md) to look for parent site
    *   **Returns** `string` - Site guid
*   **getSites**(opts: `any` = `{}`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`SitePaging`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/SitePaging.md)`>`<br/>
    Gets a list of all sites in the repository.
    *   *opts:* `any`  - Options supported by JS-API
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`SitePaging`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/SitePaging.md)`>` - List of sites
*   **listSiteGroups**(siteId: `string`, opts?: `any`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`SiteGroupPaging`](../../../lib/cli/node_modules/@alfresco/js-api/src/api/content-rest-api/model/siteGroupPaging.ts)`>`<br/>
    List group membership for site
    *   *siteId:* `string`  - The identifier of a site.
    *   *opts:* `any`  - (Optional) Options supported by JS-API
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`SiteGroupPaging`](../../../lib/cli/node_modules/@alfresco/js-api/src/api/content-rest-api/model/siteGroupPaging.ts)`>` - Observable\<SiteGroupPaging>
*   **listSiteMemberships**(siteId: `string`, opts: `any`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`SiteMemberPaging`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/SiteMemberPaging.md)`>`<br/>
    Gets a list of all a site's members.
    *   *siteId:* `string`  - ID of the target site
    *   *opts:* `any`  - Optional parameters supported by JS-API
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`SiteMemberPaging`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/SiteMemberPaging.md)`>` - Observable\<SiteMemberPaging>
*   **rejectSiteMembershipRequest**(siteId: `string`, inviteeId: `string`, opts?: `any`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`SiteMembershipRequestWithPersonPaging`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/SiteMembershipRequestWithPersonPaging.md)`>`<br/>
    Reject site membership requests.
    *   *siteId:* `string`  - The identifier of a site.
    *   *inviteeId:* `string`  - The invitee user name.
    *   *opts:* `any`  - (Optional) Options supported by JS-API
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`SiteMembershipRequestWithPersonPaging`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/SiteMembershipRequestWithPersonPaging.md)`>` - Null response notifying when the operation is complete
*   **updateSiteGroupMembership**(siteId: `string`, groupId: `string`, siteMembershipBodyUpdate: [`SiteMembershipBodyUpdate`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/SiteMembershipBodyUpdate.md)): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`SiteGroupEntry`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/SiteGroupEntry.md)`>`<br/>
    Update site membership of group
    *   *siteId:* `string`  - The identifier of a site.
    *   *groupId:* `string`  - The authorityId of a group.
    *   *siteMembershipBodyUpdate:* [`SiteMembershipBodyUpdate`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/SiteMembershipBodyUpdate.md)  - The group new role
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`SiteGroupEntry`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/SiteGroupEntry.md)`>` - Observable\<SiteGroupEntry>
*   **updateSiteMembership**(siteId: `string`, personId: `string`, siteMembershipBodyUpdate: [`SiteMembershipBodyUpdate`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/SiteMembershipBodyUpdate.md), opts?: `any`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`SiteMemberEntry`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/SiteMemberEntry.md)`>`<br/>
    Update a site membership
    *   *siteId:* `string`  - The identifier of a site.
    *   *personId:* `string`  - The identifier of a person.
    *   *siteMembershipBodyUpdate:* [`SiteMembershipBodyUpdate`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/SiteMembershipBodyUpdate.md)  - The persons new role
    *   *opts:* `any`  - (Optional) Optional parameters
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`SiteMemberEntry`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/SiteMemberEntry.md)`>` - Observable\<SiteMemberEntry>

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
