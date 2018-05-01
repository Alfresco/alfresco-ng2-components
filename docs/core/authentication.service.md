---
Added: v2.0.0
Status: Active
Last reviewed: 2018-03-29
---

# Authentication Service

Provides authentication to ACS and APS.

## Class members

### Methods

-   `getBpmUsername(): string`<br/>
    Gets the BPM username
    -   **Returns** `string` - The BPM username
-   `getEcmUsername(): string`<br/>
    Gets the ECM username.
    -   **Returns** `string` - The ECM username
-   `getRedirectUrl(provider: string = null): string`<br/>
    Gets the URL to redirect to after login.
    -   `provider: string = null` -  Service provider. Can be "ECM", "BPM" or "ALL".
    -   **Returns** `string` - The redirect URL
-   `getTicketBpm(): string | null`<br/>
    Gets the BPM ticket stored in the Storage.
    -   **Returns** `string | null` - The ticket or `null` if none was found
-   `getTicketEcm(): string | null`<br/>
    Gets the ECM ticket stored in the Storage.
    -   **Returns** `string | null` - The ticket or `null` if none was found
-   `getTicketEcmBase64(): string | null`<br/>
    Gets the BPM ticket from the Storage in Base 64 format.
    -   **Returns** `string | null` - The ticket or `null` if none was found
-   `handleError(error: any = null): Observable<any>`<br/>
    Prints an error message in the console browser
    -   `error: any = null` -  Error message
    -   **Returns** `Observable<any>` - Object representing the error message
-   `isBpmLoggedIn(): boolean`<br/>
    Checks if the user is logged in on a BPM provider.
    -   **Returns** `boolean` - True if logged in, false otherwise
-   `isEcmLoggedIn(): boolean`<br/>
    Checks if the user is logged in on an ECM provider.
    -   **Returns** `boolean` - True if logged in, false otherwise
-   `isLoggedIn(): boolean`<br/>
    Checks if the user logged in.
    -   **Returns** `boolean` - True if logged in, false otherwise
-   `isRememberMeSet(): boolean`<br/>
    Checks whether the "remember me" cookie was set or not.
    -   **Returns** `boolean` - True if set, false otherwise
-   `login(username: string = null, password: string = null, rememberMe: boolean = false): Observable<object>`<br/>
    Logs the user in.
    -   `username: string = null` -  Username for the login
    -   `password: string = null` -  Password for the login
    -   `rememberMe: boolean = false` -  Stores the user's login details if true
    -   **Returns** `Observable<object>` - Object with auth type ("ECM", "BPM" or "ALL") and auth ticket
-   `logout(): Observable<any>`<br/>
    Logs the user out.
    -   **Returns** `Observable<any>` - Response event called when logout is complete
-   `removeTicket()`<br/>
    Removes the login ticket from Storage.
-   `saveTicketAuth()`<br/>
    Saves the AUTH ticket in the Storage.
-   `saveTicketBpm()`<br/>
    Saves the BPM ticket in the Storage.
-   `saveTicketEcm()`<br/>
    Saves the ECM ticket in the Storage.
-   `saveTickets()`<br/>
    Saves the ECM and BPM ticket in the Storage.
-   `setRedirectUrl(url: RedirectionModel = null)`<br/>
    Sets the URL to redirect to after login.
-   `url: RedirectionModel = null` -  URL to redirect to

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
