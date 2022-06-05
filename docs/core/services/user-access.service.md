---
Title: User access service
Added: v1.0.0
Status: Active
Last reviewed: 2022-06-05
---

# [User access service](../../../lib/core/services/user-access.service.ts "Defined in user-access.service.ts")

Checks the global and application access of a user

## Class members

### Methods
- **fetchUserAccess**()<br/>
    Fetches the global and application access of the user
- **hasApplicationAccess**(appName: `string`, rolesToCheck: string[]): `boolean`<br/>
    Checks if the user has at least one of the roles to check for a given app.
    - appName: `string`  - The name of the app
    - rolesToCheck: `string[]`  - The roles to check
    - **Returns** `boolean` - True if it contains at least one of the given roles to check for the given app, false otherwise
- **hasGlobalAccess**(rolesToCheck: string[]): `boolean`<br/>
    Checks if the user has at least one of the given roles to check in the global roles.
    - rolesToCheck: `string[]`  - The roles to check
    - **Returns** `boolean` - True if it contains at least one of the given roles to check, false otherwise
- **resetAccess**() <br>
    Resets the cached access of the user
