---
Title: Authentication Service
Added: v2.0.0
Status: Active
Last reviewed: 2019-03-19
---

# [Authentication Service](../../../lib/core/src/lib/auth/services/authentication.service.ts "Defined in authentication.service.ts")

Provides authentication to ACS and APS.

## Class members

### Methods

-   **addTokenToHeader**(headersArg?: `HttpHeaders`): [`Observable`](http://reactivex.io/documentation/observable.html)`<HttpHeaders>`<br/>
    Adds the auth token to an HTTP header using the 'bearer' scheme.
    -   _headersArg:_ `HttpHeaders`  - (Optional) Header that will receive the token
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<HttpHeaders>` - The new header with the token added
-   **getBearerExcludedUrls**()<br/>
    Gets the set of URLs that the token bearer is excluded from.
-   **getBpmLoggedUser**(): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`UserRepresentation`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/activiti-rest-api/docs/UserRepresentation.md)`>`<br/>
    Gets information about the user currently logged into APS.
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`UserRepresentation`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/activiti-rest-api/docs/UserRepresentation.md)`>` - User information
-   **getBpmUsername**(): `string`<br/>
    Gets the BPM username
    -   **Returns** `string` - The BPM username
-   **getEcmUsername**(): `string`<br/>
    Gets the ECM username.
    -   **Returns** `string` - The ECM username
-   **getRedirect**(): `string`<br/>
    Gets the URL to redirect to after login.
    -   **Returns** `string` - The redirect URL
-   **getTicketBpm**(): `string|null`<br/>
    Gets the BPM ticket stored in the Storage.
    -   **Returns** `string|null` - The ticket or `null` if none was found
-   **getTicketEcm**(): `string|null`<br/>
    Gets the ECM ticket stored in the Storage.
    -   **Returns** `string|null` - The ticket or `null` if none was found
-   **getTicketEcmBase64**(): `string|null`<br/>
    Gets the BPM ticket from the Storage in Base 64 format.
    -   **Returns** `string|null` - The ticket or `null` if none was found
-   **getToken**(): `string`<br/>
    Gets the auth token.
    -   **Returns** `string` - Auth token string
-   **handleError**(error: `any`): [`Observable`](http://reactivex.io/documentation/observable.html)`<any>`<br/>
    Prints an error message in the console browser
    -   _error:_ `any`  - Error message
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<any>` - Object representing the error message
-   **isALLProvider**(): `boolean`<br/>
    Does the provider support both ECM and BPM?
    -   **Returns** `boolean` - True if both are supported, false otherwise
-   **isAuthCodeFlow**(): `boolean`<br/>

    -   **Returns** `boolean` - 

-   **isBPMProvider**(): `boolean`<br/>
    Does the provider support BPM?
    -   **Returns** `boolean` - True if supported, false otherwise
-   **isBpmLoggedIn**(): `boolean`<br/>
    Checks if the user is logged in on a BPM provider.
    -   **Returns** `boolean` - True if logged in, false otherwise
-   **isECMProvider**(): `boolean`<br/>
    Does the provider support ECM?
    -   **Returns** `boolean` - True if supported, false otherwise
-   **isEcmLoggedIn**(): `boolean`<br/>
    Checks if the user is logged in on an ECM provider.
    -   **Returns** `boolean` - True if logged in, false otherwise
-   **isImplicitFlow**(): `boolean`<br/>

    -   **Returns** `boolean` - 

-   **isKerberosEnabled**(): `boolean`<br/>
    Does kerberos enabled?
    -   **Returns** `boolean` - True if enabled, false otherwise
-   **isLoggedIn**(): `boolean`<br/>
    Checks if the user logged in.
    -   **Returns** `boolean` - True if logged in, false otherwise
-   **isLoggedInWith**(provider: `string`): `boolean`<br/>

    -   _provider:_ `string`  - 
    -   **Returns** `boolean` - 

-   **isOauth**(): `boolean`<br/>
    Does the provider support OAuth?
    -   **Returns** `boolean` - True if supported, false otherwise
-   **isPublicUrl**(): `boolean`<br/>

    -   **Returns** `boolean` - 

-   **isRememberMeSet**(): `boolean`<br/>
    Checks whether the "remember me" cookie was set or not.
    -   **Returns** `boolean` - True if set, false otherwise
-   **login**(username: `string`, password: `string`, rememberMe: `boolean` = `false`): [`Observable`](http://reactivex.io/documentation/observable.html)`<Function>`<br/>
    Logs the user in.
    -   _username:_ `string`  - Username for the login
    -   _password:_ `string`  - Password for the login
    -   _rememberMe:_ `boolean`  - Stores the user's login details if true
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<Function>` - Object with auth type ("ECM", "BPM" or "ALL") and auth ticket
-   **logout**(): [`Observable`](http://reactivex.io/documentation/observable.html)`<any>`<br/>
    Logs the user out.
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<any>` - Response event called when logout is complete
-   **reset**()<br/>

-   **saveRememberMeCookie**(rememberMe: `boolean`)<br/>
    Saves the "remember me" cookie as either a long-life cookie or a session cookie.
    -   _rememberMe:_ `boolean`  - Enables a long-life cookie
-   **setRedirect**(url?: [`RedirectionModel`](../../../lib/core/src/lib/auth/models/redirection.model.ts))<br/>
    Sets the URL to redirect to after login.
    -   _url:_ [`RedirectionModel`](../../../lib/core/src/lib/auth/models/redirection.model.ts)  - (Optional) URL to redirect to
-   **ssoImplicitLogin**()<br/>
    Logs the user in with SSO

## Details

### Usage example

```ts
import { AuthenticationService } from '@alfresco/adf-core';

@Component({...})
export class AppComponent {
    constructor(authService: AuthenticationService) {
        this.AuthenticationService.login('admin', 'admin').subscribe(
            token => {
                console.log(token);
            },
            error => {
                console.log(error);
            }
        );
    }
}
```

## See also

-   [Login component](../components/login.component.md)
