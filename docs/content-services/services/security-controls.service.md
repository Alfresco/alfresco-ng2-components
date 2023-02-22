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

-   **getSecurityGroup**(skipCount?: `number`, maxItems?: `number`, include?: `string`): [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)`<SecurityControlsGroupResponse>`<br/>
    Get security groups.
    -   _skipCount:_ `number`  - The number of entities that exist in the collection before those included in this list.
    -   _maxItems:_ `number`  - The maximum number of items to return in the list.
    -   _include:_ `string`  - Additional information about the security group.
    -   **Returns** [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)`<SecurityControlsGroupResponse>`
-   **createSecurityGroup**(input: `SecurityGroupBody`): [`Observable`](http://reactivex.io/documentation/observable.html)`<SecurityGroupEntry>`<br/>
    Creates a security group.
    -   _input:_ `SecurityGroupBody`  - Security group.
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<SecurityGroupEntry>` 
-   **createSecurityMarks**(securityGroupId: `string`, input: `SecurityMarkBody[]`): [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)`<any>`<br/>
    Create security marks.
    -   _securityGroupId:_ `string`  - The key for the security group id.
    -   _SecurityMarkBody:_ `SecurityMarkBody[]` - Node security marks list.
    -   **Returns** [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)`<any>`
-   **getSecurityMark**(securityGroupId: `string`, skipCount?: `number`, include?: `string`): [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)`<SecurityControlsMarkResponse>`<br/>
    Get security mark value.
    -   _securityGroupId:_ `string`  - The key for the security group id.
    -   _skipCount:_ `number`  - The number of entities that exist in the collection before those included in this list.
    -   _include:_ `string`  - The key for the security mark is in use or not.
    -   **Returns** [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)`<SecurityControlsMarkResponse>` 
-   **updateSecurityGroup**(securityGroupId: `string`, input: `SecurityGroupBody`, opts?: `any`): [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)`<SecurityGroupEntry>`<br/>
    Update a security groups information.
    -   _securityGroupId:_ `string`  - The key of security group id for which info is required.
    -   _input:_ `SecurityGroupBody`  - Security group.
    -   _opts:_ `any`  - (Optional) Extra options supported by JS-API.
    -   **Returns** [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)`<SecurityGroupEntry>` 
-   **updateSecurityMark**(securityGroupId: `string`, securityMarkId: `string`, input: `SecurityMarkBody`): [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)`<SecurityMarkEntry>`<br/>
    Updates Security Mark value.
    -   _securityGroupId:_ `string`  - The key for the security group id.
    -   _securityMarkId:_ `string`  - The key for the security mark is in use or not.
    -   _input:_ `SecurityMarkBody`  - Security mark.
    -   **Returns** [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)`<SecurityMarkEntry>`
-   **deleteSecurityGroup**(securityGroupId: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<SecurityGroupEntry>`<br/>
    Delete security group.
    -   _securityGroupId:_ `string`  - The key for the security group id.
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<SecurityGroupEntry>` 
-   **deleteSecurityMark**(securityGroupId: `string`, securityMarkId: `string`): [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)`<SecurityMarkEntry>`<br/>
    Delete security mark.
    -   _securityGroupId:_ `string`  - The key for the security group id.
    -   _securityMarkId:_ `string`  - The key for the security mark id.
    -   **Returns** [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)`<SecurityMarkEntry>`
-   **getClearancesForAuthority**(authorityName: `string`, skipCount?: `number`, maxItems?: `number`): [`Observable`](http://reactivex.io/documentation/observable.html)`<AuthorityClearanceGroupPaging>`<br/>
    Get the authority clearances for a single user/group.
    -   _authorityName:_ `string`  - The name for the authority for which the clearance is to be fetched.
    -   _skipCount:_ `number`  - The number of entities that exist in the collection before those included in this list.
    -   _maxItems:_ `number`  - The maximum number of items to return in the list.
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<AuthorityClearanceGroupPaging>` 
-   **updateClearancesForAuthority**(authorityName: `string`, securityMarksList: `NodeSecurityMarkBody[]`): [`Observable`](http://reactivex.io/documentation/observable.html)`<SecurityMarkEntry | SecurityMarkPaging>`<br/>
    Updates the authority clearance.
    -   _authorityName:_ `string`  - The name for the authority for which the clearance is to be updated.
    -   _securityMarksList:_ `NodeSecurityMarkBody[]` - Node security marks list.
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<SecurityMarkEntry | SecurityMarkPaging>` 


## Properties

| Name | Type | Description              |
| ---- | ---- |--------------------------|
| groupsPaginated$ | [`Observable`](http://reactivex.io/documentation/observable.html)`<SecurityControlsGroupResponse>` | Current paginated groups. |
| marksPaginated$ | [`Observable`](http://reactivex.io/documentation/observable.html)`<SecurityControlsMarkResponse>` | Current paginated marks. |
| reloadSecurityControls$ | [`Observable`](http://reactivex.io/documentation/observable.html)`<void>` |         |
| reloadAuthorityClearance$ | [`Observable`](http://reactivex.io/documentation/observable.html)`<void>` |     |
| loading$ | [`Observable`](http://reactivex.io/documentation/observable.html)`<boolean>` | Current loading state.   |
