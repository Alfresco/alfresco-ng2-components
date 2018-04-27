---
Added: v2.0.0
Status: Active
Last reviewed: 2018-04-16
---

# User Preferences Service

Stores preferences for components.

## Class members

### Methods

-   `get(property: string = null, defaultValue?: string = null): string`<br/>
    Gets a preference property.
    -   `property: string = null` -  Name of the property
    -   `defaultValue?: string = null` - (Optional) Default to return if the property is not found
    -   **Returns** `string` - 
-   `getDefaultLocale(): string`<br/>
    Gets the default locale.
    -   **Returns** `string` - 
-   `getDefaultPageSizes(): number[]`<br/>
    Gets an array containing the available page sizes.
    -   **Returns** `number[]` - 
-   `getPropertyKey(property: string = null): string`<br/>
    Gets the full property key with prefix.
    -   `property: string = null` -  The property name
    -   **Returns** `string` - 
-   `getStoragePrefix(): string`<br/>
    Gets the active storage prefix for preferences.
    -   **Returns** `string` - 
-   `select(property: string = null): Observable<any>`<br/>

    -   `property: string = null` -  
    -   **Returns** `Observable<any>` - 

-   `set(property: string = null, value: any = null)`<br/>
    Sets a preference property.
    -   `property: string = null` -  Name of the property
    -   `value: any = null` -  New value for the property
-   `setStoragePrefix(value: string = null)`<br/>
    Sets the active storage prefix for preferences.
-   `value: string = null` -  Name of the prefix

## Details

The preferences are bound to a particular `prefix` so the application can switch between different profiles on demand.

For example, upon login you can set the `prefix` to the current username:

```ts
import { UserPreferencesService, AuthenticationService } from '@alfresco/adf-core';

@Component({...})
class AppComponent {
    constructor(private userPreferences: UserPreferencesService,
                private authService: AuthenticationService) {
    }

    onLoggedIn() {
        this.userPreferences.setStoragePrefix(
            this.authService.getEcmUsername()
        );
    }
}
```

As soon as you assign the storage prefix, all settings that you get or set via the `UserPreferencesService` will be saved to a dedicated profile.

You can import the service into your controller and use its APIs as shown below:

```ts
@Component({...})
class AppComponent {
    constructor(userPreferences: UserPreferencesService) {

        userPreferences.set('myProperty1', 'value1');
        userPreferences.set('myProperty2', 'value2');

        console.log(
            userPreferences.get('myProperty1')
        );
    }
}
```

The service also provides quick access to a set of the "known" properties used across ADF components:

| Name | Type | Description |
| ---- | ---- | ----------- |
| authType | `string` | Authorization type (can be "ECM", "BPM" or "ALL"). |
| disableCSRF | `boolean` | Prevents the CSRF Token from being submitted if true. Only valid for Process Services. |
| paginationSize | `number` | Pagination size. |
| locale | `string` | Current locale setting. |

## User Preference onChange Stream

Whenever a property is set with the user preference service, an `onChange` event is sent with the
whole set of user properties. This is useful when a component needs to react to a property change:

```ts
    userPreferences.paginationSize = 10;
    userPreferences.onChange().subscribe((userStatusValues) => {
        console.log(userStatusValues.PAGINATION_SIZE); //this will be 10
    });
```

You can also use the `select` method to get notification when a particular property is changed.
A set of basic properties is added into the enumeration `UserPreferenceValues` which gives you the key value to access the standard user preference service properties : **PaginationSize**, **DisableCSRF**, **Locale** and **SupportedPageSizes**.

```ts
    userPreferences.disableCSRF = true;
    userPreferences.select(UserPreferenceValues.DisableCSRF).subscribe((CSRFflag) => {
        console.log(CSRFflag); //this will be true;
    });
```
