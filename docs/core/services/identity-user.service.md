---
Title: Identity user service
Added: v3.0.0
Status: Active
Last reviewed: 2019-02-08
---

# [Identity user service](../../../lib/process-services-cloud/src/lib/services/identity-user.service.ts "Defined in identity-user.service.ts")

Gets OAuth2 personal details and roles for users.

## Class members

### Methods

-   **findUsersByUsername**(username: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<any>`<br/>
    Finds groups filtered by username.
    -   _username:_ `string`  - Object containing the name filter string
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<any>` - List of users information

## Details

[OAuth2](https://oauth.net/2/) defines an _access token_ (used when
authenticating a user) and a number of _authentication roles_ that the user
can participate in (see
[this page](https://www.digitalocean.com/community/tutorials/an-introduction-to-oauth-2)
for an introduction to OAuth2 and a description of the roles). You can use the
[Identity user service](identity-user.service.md) to access this information for users, including the current user.

## See also

-   [JWT helper service](jwt-helper.service.md)
