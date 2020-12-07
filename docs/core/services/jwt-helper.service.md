---
Title: JWT helper service
Added: v3.0.0
Status: Active
Last reviewed: 2019-01-09
---

# [JWT helper service](../../../lib/core/services/jwt-helper.service.ts "Defined in jwt-helper.service.ts")

Decodes a JSON Web Token (JWT) to a JavaScript object.

## Class members

### Methods

*   **decodeToken**(token: `any`): `Object`<br/>
    Decodes a JSON web token into a JS object.
    *   *token:* `any`  - Token in encoded form
    *   **Returns** `Object` - Decoded token data object
*   **getAccessToken**(): `string`<br/>
    Gets access token
    *   **Returns** `string` - access token
*   **getClientRoles**(clientName: `string`): `string[]`<br/>
    Gets Client roles.
    *   *clientName:* `string`  -
    *   **Returns** `string[]` - Array of client roles
*   **getRealmRoles**(): `string[]`<br/>
    Gets realm roles.
    *   **Returns** `string[]` - Array of realm roles
*   **getValueFromLocalAccessToken**(key: `string`)<br/>
    Gets a named value from the user access token.
    *   *key:* `string`  - Key name of the field to retrieve
*   **getValueFromToken**(accessToken: `string`, key: `string`)<br/>
    Gets a named value from the user access token.
    *   *accessToken:* `string`  - your SSO access token where the value is encode
    *   *key:* `string`  - Key name of the field to retrieve
*   **hasClientRole**(clientName: `string`, role: `string`): `boolean`<br/>
    Checks for client role.
    *   *clientName:* `string`  - Targeted client name
    *   *role:* `string`  - Role name to check
    *   **Returns** `boolean` - True if it contains given role, false otherwise
*   **hasRealmRole**(role: `string`): `boolean`<br/>
    Checks for single realm role.
    *   *role:* `string`  - Role name to check
    *   **Returns** `boolean` - True if it contains given role, false otherwise
*   **hasRealmRoles**(rolesToCheck: `string[]`): `boolean`<br/>
    Checks for realm roles.
    *   *rolesToCheck:* `string[]`  - List of role names to check
    *   **Returns** `boolean` - True if it contains at least one of the given roles, false otherwise
*   **hasRealmRolesForClientRole**(clientName: `string`, rolesToCheck: `string[]`): `boolean`<br/>
    Checks for client roles.
    *   *clientName:* `string`  - Targeted client name
    *   *rolesToCheck:* `string[]`  - List of role names to check
    *   **Returns** `boolean` - True if it contains at least one of the given roles, false otherwise

## Details

JWT is a standard for sending data securely that ADF uses during the
OAuth2 authentication procedure. See the [JWT website](https://jwt.io/)
for full details of the standard and its uses.

## See also

*   [Identity user service](identity-user.service.md)
