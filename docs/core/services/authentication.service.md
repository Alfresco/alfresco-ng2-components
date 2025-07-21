---
Title: Authentication Service
Added: v2.0.0
Status: Active
Last reviewed: 2025-06-12
---

# Authentication Service

Provides authentication to ACS and APS.

## Class members

### Methods

-   **addTokenToHeader**(requestUrl: `string`, headersArg?: `HttpHeaders`): [`Observable`](http://reactivex.io/documentation/observable.html)`<HttpHeaders>`<br/>
    Adds the auth token to an HTTP header using the 'bearer' scheme.
    -   _requestUrl:_ `string`  - The URL of the request for which to set authentication headers.
    -   _headersArg:_ `HttpHeaders`  - (Optional) Header that will receive the token
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<HttpHeaders>` - The new header with the token added
-   **getToken**(): `string`<br/>
    Gets the auth token.
    -   **Returns** `string` - Auth token string
-   **getUsername**(): `string`<br/>
    Gets the username of the authenticated user.
    -   **Returns** `string` - Username of the authenticated user
-   **getAuthHeaders**(requestUrl: `string`, headers: `HttpHeaders`): `HttpHeaders`<br/>
    Gets and sets the necessary authentication headers for a given request URL.
    -   _requestUrl:_ `string`  - The URL of the request for which to obtain authentication headers.
    -   _headers:_ `HttpHeaders`  - The existing HTTP headers to which authentication details might be added.
    -   **Returns** `HttpHeaders` - The HTTP headers object, potentially updated with authentication tokens.
-   **isALLProvider**(): `boolean`<br/>
    Does the provider support both ECM and BPM?
    -   **Returns** `boolean` - True if both are supported, false otherwise
-   **isBPMProvider**(): `boolean`<br/>
    Does the provider support BPM?
    -   **Returns** `boolean` - True if supported, false otherwise
-   **isECMProvider**(): `boolean`<br/>
    Does the provider support ECM?
    -   **Returns** `boolean` - True if supported, false otherwise
-   **isKerberosEnabled**(): `boolean`<br/>
    Does kerberos enabled?
    -   **Returns** `boolean` - True if enabled, false otherwise
-   **isLoggedIn**(): `boolean`<br/>
    Checks if the user logged in.
    -   **Returns** `boolean` - True if logged in, false otherwise
-   **isOauth**(): `boolean`<br/>
    Does the provider support OAuth?
    -   **Returns** `boolean` - True if supported, false otherwise
-   **login**(username: `string`, password: `string`, rememberMe?: `boolean`): [`Observable`](http://reactivex.io/documentation/observable.html)`<{ type: string; ticket: any }>`<br/>
    Logs the user in.
    -   _username:_ `string`  - Username for the login
    -   _password:_ `string`  - Password for the login
    -   _rememberMe:_ `boolean`  - (Optional) Stores the user's login details if true
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<{ type: string; ticket: any }>` - An Observable that emits an object containing the authentication type (`type`) and the authentication ticket (`ticket`) upon successful login.
-   **logout**(): [`Observable`](http://reactivex.io/documentation/observable.html)`<any>`<br/> Logs the user out.
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<any>` - Response event called when logout is complete
-   **reset**(): `void`<br/>Resets the authentication state of the service.
-   **on**(event: `string`, listener: `Function`): `void`<br/> Adds an event listener for the specified event.
-   **off**(event: `string`, listener?: `Function`): `void`<br/> Removes an event listener for the specified event.
-   **once**(event: `string`, listener: `Function`): `void`<br/> Adds a one-time event listener for the specified event.
-   **emit**(event: `string`, ...args: `any[]`): `void`<br/> Emits an event with optional arguments.
-   **onLogin**: [`Subject`](https://reactivex.io/documentation/subject)`<any>`<br/> Emitted when the user logs in successfully.
-   **onLogout**: [`Subject`](https://reactivex.io/documentation/subject)`<any>`<br/> Emitted when the user logs out.
-   **onTokenReceived**: [`Subject`](https://reactivex.io/documentation/subject)`<any>`<br/> Emitted when an authentication token is received.
-   **onError**: [`Observable`](http://reactivex.io/documentation/observable.html)`<any>`<br/> An Observable that emits an error object when an authentication-related error occurs.

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
