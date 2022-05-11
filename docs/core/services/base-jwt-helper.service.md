---
Title: Base JWT helper service
Added: v4.11.0
Status: Active
Last reviewed: 2022-05-11
---

# [Base JWT helper service](../../../lib/core/services/authentication/base-jwt-helper.service.ts "Defined in base-jwt-helper.service.ts")

Decodes a JSON Web Token (JWT) to a JavaScript object.

## Class members

### Methods

-   **decodeToken**(token: `any`): `Object`<br/>
    Decodes a JSON web token into a JS object.
    - _token:_ `any`  - Token in encoded form
    - **Returns** `Object` - Decoded token data object
-   **urlBase64Decode**(token: `any`): `String`<br/>
    Decodes a base64 token to String.
    - _token:_ `any`  - Token in encoded form
    - **Returns** `String` - Decoded String token
-   **getAccessToken**(): `string`<br/>
    Gets access token
    -   **Returns** `string` - access token
-   **getIdToken**(): `string`<br/>
    Gets id token
    -   **Returns** `string` - id token
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

## Details

JWT is a standard for sending data securely that ADF uses during the
OAuth2 authentication procedure. See the [JWT website](https://jwt.io/)
for full details of the standard and its uses.

## See also

-   [Identity user service](identity-user.service.md)
