---
Title: JWT helper service
Added: v3.0.0
Status: Active
Last reviewed: 2019-01-09
---

# [JWT helper service](../../../lib/core/services/jwt-helper.service.ts "Defined in jwt-helper.service.ts")

Decodes a JSON Web Token (JWT) to a JavaScript object.

## Class members

globalRoles$ | [`Observable`](http://reactivex.io/documentation/observable.html)`<any>` | It emits the global roles of the user coming from the JWT token<br>
applicationRoles$ | [`Observable`](http://reactivex.io/documentation/observable.html)`<any>` | It emits the roles of the applications of the user coming from the JWT token 

### Methods
-   **initialise**()<br/>
    Initialises the global and application roles Observables
-   **hasApplicationRoles**(appName: `string`, roles: string[]): `boolean`<br/>
    Checks if the user has at least one role for a given app.
    - appName: `string`  - The name of the app
    - roles: `string[]`  - The roles to check
    - **Returns** `boolean` - True if it contains at least one of the given roles for the given app, false otherwise
-   **hasGlobalRoles**(roles: string[]): `boolean`<br/>
    Checks if the user has at least one of the global roles.
    - roles: `string[]`  - The roles to check
    - **Returns** `boolean` - True if it contains at least one of the given roles, false otherwise
-   **decodeToken**(token: `any`): `Object`<br/>
    Decodes a JSON web token into a JS object.
    -   _token:_ `any`  - Token in encoded form
    -   **Returns** `Object` - Decoded token data object
-   **getAccessToken**(): `string`<br/>
    Gets access token
    -   **Returns** `string` - access token
-   **getClientRoles**(clientName: `string`): `string[]`<br/>
    Gets Client roles.
    -   _clientName:_ `string`  - 
    -   **Returns** `string[]` - Array of client roles
-   **getIdToken**(): `string`<br/>
    Gets id token
    -   **Returns** `string` - id token
-   **getRealmRoles**(): `string[]`<br/>
    Gets realm roles.
    -   **Returns** `string[]` - Array of realm roles
-   **getValueFromLocalAccessToken**(key: `string`)<br/>
    Gets a named value from the user access token.
    -   _key:_ `string`  - Key name of the field to retrieve
-   **getValueFromLocalIdToken**(key: `string`)<br/>
    Gets a named value from the user id token.
    -   _key:_ `string`  - Key name of the field to retrieve
-   **getValueFromLocalToken**(key: `string`)<br/>
    Gets a named value from the user access or id token.
    -   _key:_ `string`  - Key name of the field to retrieve
-   **getValueFromToken**(token: `string`, key: `string`)<br/>
    Gets a named value from the user access token.
    -   _token:_ `string`  - 
    -   _key:_ `string`  - Key name of the field to retrieve
-   **hasClientRole**(clientName: `string`, role: `string`): `boolean`<br/>
    Checks for client role.
    -   _clientName:_ `string`  - Targeted client name
    -   _role:_ `string`  - Role name to check
    -   **Returns** `boolean` - True if it contains given role, false otherwise
-   **hasRealmRole**(role: `string`): `boolean`<br/>
    Checks for single realm role.
    -   _role:_ `string`  - Role name to check
    -   **Returns** `boolean` - True if it contains given role, false otherwise
-   **hasRealmRoles**(rolesToCheck: `string[]`): `boolean`<br/>
    Checks for realm roles.
    -   _rolesToCheck:_ `string[]`  - List of role names to check
    -   **Returns** `boolean` - True if it contains at least one of the given roles, false otherwise
-   **hasRealmRolesForClientRole**(clientName: `string`, rolesToCheck: `string[]`): `boolean`<br/>
    Checks for client roles.
    -   _clientName:_ `string`  - Targeted client name
    -   _rolesToCheck:_ `string[]`  - List of role names to check
    -   **Returns** `boolean` - True if it contains at least one of the given roles, false otherwise

## Details

JWT is a standard for sending data securely that ADF uses during the
OAuth2 authentication procedure. See the [JWT website](https://jwt.io/)
for full details of the standard and its uses.

## See also

-   [Identity user service](identity-user.service.md)
