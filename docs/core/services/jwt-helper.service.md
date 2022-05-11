---
Title: JWT helper service
Added: v3.0.0
Status: Active
Last reviewed: 2022-05-11
---

# [JWT helper service](../../../lib/core/services/jwt-helper.service.ts "Defined in jwt-helper.service.ts")

Decodes a JSON Web Token (JWT) to a JavaScript object.

## Class members

### Methods

-   **getClientRoles**(clientName: `string`): `string[]`<br/>
    Gets Client roles.
    -   _clientName:_ `string`  - 
    -   **Returns** `string[]` - Array of client roles
-   **getRealmRoles**(): `string[]`<br/>
    Gets realm roles.
    -   **Returns** `string[]` - Array of realm roles
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

This service extends the [Base JWT helper service](base-jwt-helper.service.md) 
which is responsible for reading the token value from the local storage and decoding it. 
It can be used to check the realm and resource access defined in a JWT token.

## See also

-   [Identity user service](identity-user.service.md)
