---
Added: v2.0.0
Status: Active
Last reviewed: 2018-03-13
---

# Authentication Service

Provides authentication to ACS and APS.

## Methods

-   `isLoggedIn(): boolean`  
    Checks if the user logged in.  

-   `login(username: string, password: string, rememberMe: boolean = false): Observable<{ type: string; ticket: any; }>`  
    Logs the user in.  
    -   `username` - Username for the login
    -   `password` - Password for the login
    -   `rememberMe` - Stores the user's login details if true
-   `isRememberMeSet(): boolean`  
    Checks whether the "remember me" cookie was set or not.  

-   `logout(): any`  
    Logs the user out.  

-   `removeTicket()`  
    Removes the login ticket from Storage.  

-   `getTicketEcm(): string`  
    Gets the ECM ticket stored in the Storage.  

-   `getTicketBpm(): string`  
    Gets the BPM ticket stored in the Storage.  

-   `getTicketEcmBase64(): string`  
    Gets the BPM ticket from the Storage in Base 64 format.   

-   `saveTickets()`  
    Saves the ECM and BPM ticket in the Storage.  

-   `saveTicketEcm()`  
    Saves the ECM ticket in the Storage.  

-   `saveTicketBpm()`  
    Saves the BPM ticket in the Storage.  

-   `saveTicketAuth()`  
    Saves the AUTH ticket in the Storage.  

-   `isEcmLoggedIn(): boolean`  
    Checks if the user is logged in on an ECM provider.  

-   `isBpmLoggedIn(): boolean`  
    Checks if the user is logged in on a BPM provider.  

-   `getEcmUsername(): string`  
    Gets the ECM username.  

-   `getBpmUsername(): string`  
    Gets the BPM username  

-   `setRedirectUrl(url: RedirectionModel)`  
    Sets the URL to redirect to after login.  
    -   `url` - URL to redirect to
-   `getRedirectUrl(provider: string): string`  
    Gets the URL to redirect to after login.  
    -   `provider` - Service provider. Can be "ECM", "BPM" or "ALL".
-   `handleError(error: any): Observable<any>`  
    Prints an error message in the console browser  
    -   `error` - Error message

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
