---
Added: v2.0.0
Status: Active
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
-   `getDifferentPageSizes(): number[]`  
    Gets an array containing the available page sizes.   

-   `getDefaultLocale(): string`  
    Gets the default locale.   


## Details

The preferences are bound to a particular `prefix` so the application can switch between different profiles on demand.

For example upon login you can set the `prefix` as current username:

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

As soon as you assign the storage prefix all settings that you get or set via the `UserPreferencesService` will be saved to dedicated profile.

You can import the service in your controller and use its APIs like below:

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
