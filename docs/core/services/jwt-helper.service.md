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

-   **decodeToken**(token: `any`): `Object`<br/>
    Decodes a JSON web token into a JS object.
    -   _token:_ `any`  - Token in encoded form
    -   **Returns** `Object` - Decoded token data object

## Details

JWT is a standard for sending data securely that ADF uses during the
OAuth2 authentication procedure. See the [JWT website](https://jwt.io/)
for full details of the standard and its uses.

## See also

-   [Identity user service](identity-user.service.md)
