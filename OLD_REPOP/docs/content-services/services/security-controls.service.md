---
Title: Security Controls service
Added: v2.0.0
Status: Active
Last reviewed: 2023-02-21
---

# [Security Controls service](../../../lib/content-services/src/lib/security/services/security-controls-groups-marks-security.service.ts "Defined in security-controls-groups-marks-security.service.ts")

Manages security groups & marks in Content Services.

## Class members

### Methods

-   **createSecurityGroup**(input: `SecurityGroupBody`): [`Observable`](http://reactivex.io/documentation/observable.html)`<SecurityGroupEntry>`<br/>
    Create security group
    -   _input:_ `SecurityGroupBody`  - securityGroupBody.
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<SecurityGroupEntry>` - [`Observable`](http://reactivex.io/documentation/observable.html)&lt;SecurityGroupEntry>
-   **createSecurityMarks**(securityGroupId: `string`, input: `SecurityMarkBody[]`): [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)`<SecurityMarkPaging|SecurityMarkEntry>`<br/>
    Create security marks
    -   _securityGroupId:_ `string`  - The key for the security group id.
    -   _input:_ `SecurityMarkBody[]`  - securityMarkBody\[].
    -   **Returns** [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)`<SecurityMarkPaging|SecurityMarkEntry>` - [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)&lt;SecurityMarkPaging | SecurityMarkEntry>
-   **deleteSecurityGroup**(securityGroupId: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<SecurityGroupEntry>`<br/>
    Delete security group
    -   _securityGroupId:_ `string`  - The key for the security group id.
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<SecurityGroupEntry>` - [`Observable`](http://reactivex.io/documentation/observable.html)&lt;SecurityGroupEntry>
-   **deleteSecurityMark**(securityGroupId: `string`, securityMarkId: `string`): [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)`<SecurityMarkEntry>`<br/>
    Delete security mark
    -   _securityGroupId:_ `string`  - The key for the security group id.
    -   _securityMarkId:_ `string`  - The key for the security mark id.
    -   **Returns** [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)`<SecurityMarkEntry>` - [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)&lt;SecurityMarkEntry>
-   **getClearancesForAuthority**(authorityName: `string`, skipCount: `number` = `DEFAULT_SKIP_COUNT`, maxItems: `number` = `this.userPreferencesService.paginationSize`): [`Observable`](http://reactivex.io/documentation/observable.html)`<AuthorityClearanceGroupPaging>`<br/>
    Get the authority clearances for a single user/group
    -   _authorityName:_ `string`  - The name for the authority for which the clearance is to be fetched. Can be left blank in which case it will fetch it for all users with pagination
    -   _skipCount:_ `number`  - The number of entities that exist in the collection before those included in this list.
    -   _maxItems:_ `number`  - The maximum number of items to return in the list. Default is specified by [UserPreferencesService](../../core/services/user-preferences.service.md).
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<AuthorityClearanceGroupPaging>` - [`Observable`](http://reactivex.io/documentation/observable.html)&lt;AuthorityClearanceGroupPaging>
-   **getSecurityGroup**(skipCount: `number` = `DEFAULT_SKIP_COUNT`, maxItems: `number` = `this.userPreferencesService.paginationSize`, include: `string` = `DEFAULT_INCLUDE`): [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)`<`[`SecurityControlsGroupResponse`](../../../lib/content-services/src/lib/security/services/models/security-controls-group-response.interface.ts)`>`<br/>
    Get All security groups
    -   _skipCount:_ `number`  - The number of entities that exist in the collection before those included in this list.
    -   _maxItems:_ `number`  - The maximum number of items to return in the list. Default is specified by [UserPreferencesService](../../core/services/user-preferences.service.md).
    -   _include:_ `string`  - Additional information about the security group
    -   **Returns** [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)`<`[`SecurityControlsGroupResponse`](../../../lib/content-services/src/lib/security/services/models/security-controls-group-response.interface.ts)`>` - [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)&lt;SecurityControlsGroupResponse>
-   **getSecurityMark**(securityGroupId: `string`, skipCount: `number` = `DEFAULT_SKIP_COUNT`, include: `string` = `DEFAULT_INCLUDE`): [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)`<`[`SecurityControlsMarkResponse`](../../../lib/content-services/src/lib/security/services/models/security-controls-mark-response.interface.ts)`>`<br/>
    Get security mark value Gets the value for a selected **securityGroupId**.
    -   _securityGroupId:_ `string`  - The key for the security group id.
    -   _skipCount:_ `number`  - The number of entities that exist in the collection before those included in this list.
    -   _include:_ `string`  - The key for the security mark is in use or not
    -   **Returns** [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)`<`[`SecurityControlsMarkResponse`](../../../lib/content-services/src/lib/security/services/models/security-controls-mark-response.interface.ts)`>` - [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)&lt;SecurityControlsMarkResponse>
-   **reloadSecurityGroups**()<br/>

-   **updateClearancesForAuthority**(authorityName: `string`, securityMarksList: `NodeSecurityMarkBody[]`): [`Observable`](http://reactivex.io/documentation/observable.html)`<SecurityMarkEntry|SecurityMarkPaging>`<br/>
    Updates the authority clearance.
    -   _authorityName:_ `string`  - The name for the authority for which the clearance is to be updated
    -   _securityMarksList:_ `NodeSecurityMarkBody[]`  - NodeSecurityMarkBody\[]
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<SecurityMarkEntry|SecurityMarkPaging>` - [`Observable`](http://reactivex.io/documentation/observable.html)&lt;SecurityMarkEntry | SecurityMarkPaging>
-   **updateSecurityGroup**(securityGroupId: `string`, input: `SecurityGroupBody`, opts?: `any`): [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)`<SecurityGroupEntry>`<br/>
    Update a security groups information
    -   _securityGroupId:_ `string`  - The Key of Security Group id for which info is required
    -   _input:_ `SecurityGroupBody`  - SecurityGroupBody
    -   _opts:_ `any`  - (Optional) additional information about the security group
    -   **Returns** [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)`<SecurityGroupEntry>` - [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)&lt;SecurityGroupEntry>
-   **updateSecurityMark**(securityGroupId: `string`, securityMarkId: `string`, input: `SecurityMarkBody`): [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)`<SecurityMarkEntry>`<br/>
    Updates Security Mark value
    -   _securityGroupId:_ `string`  - The key for the security group id.
    -   _securityMarkId:_ `string`  - The key for the security mark is in use or not.
    -   _input:_ `SecurityMarkBody`  - securityMarkBody.
    -   **Returns** [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)`<SecurityMarkEntry>` - [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)&lt;SecurityMarkEntry>

## Properties

| Name | Type | Description |
| ---- | ---- | ----------- |
| groupsPaginated$ | [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`SecurityControlsGroupResponse`](../../../lib/content-services/src/lib/security/services/models/security-controls-group-response.interface.ts)`>` | Current paginated groups. |
| marksPaginated$ | [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`SecurityControlsMarkResponse`](../../../lib/content-services/src/lib/security/services/models/security-controls-mark-response.interface.ts)`>` | Current paginated marks. |
| reloadSecurityControls$ | [`Observable`](http://reactivex.io/documentation/observable.html)`<void>` |  |
| reloadAuthorityClearance$ | [`Observable`](http://reactivex.io/documentation/observable.html)`<void>` |  |
| loading$ | [`Observable`](http://reactivex.io/documentation/observable.html)`<boolean>` | Current loading state. |
