---
Title: User Preferences Service
Added: v2.0.0
Status: Active
Last reviewed: 2019-01-16
---

# [User Preferences Service](../../../lib/core/services/user-preferences.service.ts "Defined in user-preferences.service.ts")

Stores preferences for the app and for individual components.

## Class members

### Methods

*   **get**(property: `string`, defaultValue?: `string`): `string`<br/>
    Gets a preference property.
    *   *property:* `string`  - Name of the property
    *   *defaultValue:* `string`  - (Optional) Default to return if the property is not found
    *   **Returns** `string` - Preference property
*   **getDefaultLocale**(): `string`<br/>
    Gets the default locale.
    *   **Returns** `string` - Default locale language code
*   **getPropertyKey**(property: `string`): `string`<br/>
    Gets the full property key with prefix.
    *   *property:* `string`  - The property name
    *   **Returns** `string` - [Property](../../../lib/content-services/src/lib/content-metadata/interfaces/property.interface.ts) key
*   **getStoragePrefix**(): `string`<br/>
    Gets the active storage prefix for preferences.
    *   **Returns** `string` - Storage prefix
*   **hasItem**(property: `string`): `boolean`<br/>
    Check if an item is present in the storage
    *   *property:* `string`  - Name of the property
    *   **Returns** `boolean` - True if the item is present, false otherwise
*   **select**(property: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<any>`<br/>
    Sets up a callback to notify when a property has changed.
    *   *property:* `string`  - The property to watch
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<any>` - Notification callback
*   **set**(property: `string`, value: `any`)<br/>
    Sets a preference property.
    *   *property:* `string`  - Name of the property
    *   *value:* `any`  - New value for the property
*   **setStoragePrefix**(value: `string`)<br/>
    Sets the active storage prefix for preferences.
    *   *value:* `string`  - Name of the prefix
*   **setWithoutStore**(property: `string`, value: `any`)<br/>
    Sets a preference property.
    *   *property:* `string`  - Name of the property
    *   *value:* `any`  - New value for the property

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

As soon as you assign the storage prefix, all settings that you get or set via the [`UserPreferencesService`](../../core/services/user-preferences.service.md) will be saved to a dedicated profile.

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

| Name           | Type      | Description                                                                                        |
| -------------- | --------- | -------------------------------------------------------------------------------------------------- |
| authType       | `string`  | Authorization type (can be "ECM", "BPM" or "ALL").                                                 |
| disableCSRF    | `boolean` | Prevents the CSRF Token from being submitted if true. Only valid for Process Services.             |
| paginationSize | `number`  | [`Pagination`](../../../lib/content-services/document-list/models/document-library.model.ts) size. |
| locale         | `string`  | Current locale setting.                                                                            |

## User Preference onChange Stream

Whenever a property is set with the [user preferences service,](user-preferences.service.md) an `onChange` event is sent with the
whole set of user properties. This is useful when a component needs to react to a property change:

```ts
    userPreferences.paginationSize = 10;
    userPreferences.onChange().subscribe((userStatusValues) => {
        console.log(userStatusValues.PAGINATION_SIZE); //this will be 10
    });
```

You can also use the `select` method to get notification when a particular property is changed.
A set of basic properties is added into the enumeration [`UserPreferenceValues`](../../../lib/core/services/user-preferences.service.ts) which gives you the key value to access the standard user preference service properties : **PaginationSize**, **DisableCSRF**, **Locale**, **SupportedPageSizes** and **ExpandedSideNavStatus**.

```ts
    userPreferences.disableCSRF = true;
    userPreferences.select(UserPreferenceValues.DisableCSRF).subscribe((CSRFflag) => {
        console.log(CSRFflag); //this will be true;
    });
```
