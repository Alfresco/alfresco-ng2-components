---
Title: User access service
Added: v1.0.0
Status: Active
Last reviewed: 2022-06-05
---

# [User access service](../../../lib/core/src/lib/auth/services/user-access.service.ts "Defined in user-access.service.ts")

Checks the global and application access of a user

## Class members

### Methods

-   **fetchUserAccess**(): [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)`<void>`<br/>
      Fetches the global and application access of the user
    -   **Returns** [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)`<void>` - 
-   **hasApplicationAccess**(appName: `string`, rolesToCheck: `string[]`): `boolean`<br/>
    Checks for global roles access.
    -   _appName:_ `string`  - The app name
    -   _rolesToCheck:_ `string[]`  - List of the roles to check
    -   **Returns** `boolean` - True if it contains at least one of the given roles, false otherwise
-   **hasGlobalAccess**(rolesToCheck: `string[]`): `boolean`<br/>
    Checks for global roles access.
    -   _rolesToCheck:_ `string[]`  - List of the roles to check
    -   **Returns** `boolean` - True if it contains at least one of the given roles, false otherwise
-   **resetAccess**()<br/>
    Resets the cached user access
