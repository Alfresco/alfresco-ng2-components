---
Added: v2.0.0
Status: Active
Last reviewed: 2018-03-29
---

# Authentication Service

Provides authentication to ACS and APS.

## Class members

### Methods

-   **getBpmLoggedUser**(): [`Observable`](http://reactivex.io/documentation/observable.html)`<UserRepresentation>`<br/>

    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<UserRepresentation>` - 

-   **getBpmUsername**(): `string`<br/>
    Gets the BPM username
    -   **Returns** `string` - The BPM username
-   **getEcmUsername**(): `string`<br/>
    Gets the ECM username.
    -   **Returns** `string` - The ECM username
-   **getRedirect**(provider: `string`): `string`<br/>
    Gets the URL to redirect to after login.
    -   _provider:_ `string`  - Service provider. Can be "ECM", "BPM" or "ALL".
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
-   **handleError**(error: `any`): [`Observable`](http://reactivex.io/documentation/observable.html)`<any>`<br/>
    Prints an error message in the console browser
    -   _error:_ `any`  - Error message
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<any>` - Object representing the error message
-   **isALLProvider**(): `boolean`<br/>

    -   **Returns** `boolean` - 

-   **isBPMProvider**(): `boolean`<br/>

    -   **Returns** `boolean` - 

-   **isBpmLoggedIn**(): `boolean`<br/>
    Checks if the user is logged in on a BPM provider.
    -   **Returns** `boolean` - True if logged in, false otherwise
-   **isECMProvider**(): `boolean`<br/>

    -   **Returns** `boolean` - 

-   **isEcmLoggedIn**(): `boolean`<br/>
    Checks if the user is logged in on an ECM provider.
    -   **Returns** `boolean` - True if logged in, false otherwise
-   **isLoggedIn**(): `boolean`<br/>
    Checks if the user logged in.
    -   **Returns** `boolean` - True if logged in, false otherwise
-   **isOauth**(): `boolean`<br/>

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
-   **setRedirect**(url: [`RedirectionModel`](../../lib/core/models/redirection.model.ts))<br/>
    Sets the URL to redirect to after login.
    -   _url:_ [`RedirectionModel`](../../lib/core/models/redirection.model.ts)  - URL to redirect to
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

-   [Login component](login.component.md)
