---
Added: v2.0.0
Status: Active
Last reviewed: 2018-04-16
---

# User Preferences Service

Stores preferences for components.

## Methods

-   `get(property: string, defaultValue?: string): string`  
    Gets a preference property.  
    -   `property` - Name of the property
    -   `defaultValue` - (Optional) Default to return if the property is not found
-   `set(property: string, value: any)`  
    Sets a preference property.  
    -   `property` - Name of the property
    -   `value` - New value for the property
-   `getStoragePrefix(): string`  
    Gets the active storage prefix for preferences.   

-   `setStoragePrefix(value: string)`  
    Sets the active storage prefix for preferences.  
    -   `value` - Name of the prefix
-   `getPropertyKey(property: string): string`  
    Gets the full property key with prefix.  
    -   `property` - The property name
-   `getDefaultPageSizes(): number[]`  
    Gets an array containing the available page sizes.   

-   `getDefaultLocale(): string`  
    Gets the default locale.   

-   `select(property: string) : Observable`
    Return the value for the user status property changed
    -   `property` - The property name to query


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

