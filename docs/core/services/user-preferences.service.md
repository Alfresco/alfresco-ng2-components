---
Title: User Preferences Service
Added: v2.0.0
Status: Active
Last reviewed: 2025-11-20
---

# User Preferences Service

Stores preferences for the app and for individual components.

## Class members

### Methods

-   **get**(property: `string`, defaultValue?: `string`): `string`<br/>
    Gets a preference property.
    -   _property:_ `string`  - Name of the property
    -   _defaultValue:_ `string`  - (Optional) Default to return if the property is not found
    -   **Returns** `string` - Preference property
-   **getDefaultLocale**(): `string`<br/>
    Gets the default locale.
    -   **Returns** `string` - Default locale language code
-   **getPropertyKey**(property: `string`): `string`<br/>
    Gets the full property key with prefix.
    -   _property:_ `string`  - The property name
    -   **Returns** `string` - [Property](../../../lib/content-services/src/lib/content-metadata/interfaces/property.interface.ts) key
-   **getStoragePrefix**(): `string`<br/>
    Gets the active storage prefix for preferences.
    -   **Returns** `string` - Storage prefix
-   **hasItem**(property: `string`): `boolean`<br/>
    Check if an item is present in the storage
    -   _property:_ `string`  - Name of the property
    -   **Returns** `boolean` - True if the item is present, false otherwise
-   **select**(property: `string`): `Observable<any>`<br/>
    Sets up a callback to notify when a property has changed.
    -   _property:_ `string`  - The property to watch
    -   **Returns** `Observable<any>` - Notification callback
-   **set**(property: `string`, value: `any`)<br/>
    Sets a preference property.
    -   _property:_ `string`  - Name of the property
    -   _value:_ `any`  - New value for the property
-   **setStoragePrefix**(value: `string`)<br/>
    Sets the active storage prefix for preferences.
    -   _value:_ `string`  - Name of the prefix
-   **setWithoutStore**(property: `string`, value: `any`)<br/>
    Sets a preference property.
    -   _property:_ `string`  - Name of the property
    -   _value:_ `any`  - New value for the property

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
            this.authService.getUsername()
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
| paginationSize | `number` | `Pagination` size. |
| locale | `string` | Current locale setting. |

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
A set of basic properties is added into the enumeration `UserPreferenceValues` which gives you the key value to access the standard user preference service properties: 

- `PaginationSize`
- `DisableCSRF`
- `Locale`
- `SupportedPageSizes`
- `ExpandedSideNavStatus`

```ts
    userPreferences.disableCSRF = true;
    userPreferences.select(UserPreferenceValues.DisableCSRF).subscribe((CSRFflag) => {
        console.log(CSRFflag); //this will be true;
    });
```

### Convenience Observables and Signals

For commonly accessed preferences like `locale`, the service provides both observables and signals that simplify access patterns.

#### Using Signals (Recommended - No Subscription Needed!)

Signals automatically handle cleanup and don't require manual unsubscription:

```ts
export class MyComponent {
    private userPreferences = inject(UserPreferencesService);
    
    // Signal - automatically reactive, no subscription needed!
    currentLocale = this.userPreferences.localeSignal;
    
    // Use in template or computed values
    displayText = computed(() => `Current locale: ${this.currentLocale()}`);
}
```

Available signals:

- `localeSignal` - Current locale value
- `paginationSizeSignal` - Current pagination size
- `supportedPageSizesSignal` - Supported page sizes array

**Benefits of signals:**

- ✅ No manual subscription/unsubscription needed
- ✅ Automatic cleanup when component is destroyed
- ✅ Better performance with fine-grained reactivity
- ✅ Simpler code - just read the value with `()`

#### Using Observables (For Advanced Cases)

If you need RxJS operators or imperative subscriptions:

```ts
constructor(private userPreferences: UserPreferencesService) {
    // Observable - requires takeUntilDestroyed() to prevent memory leaks
    this.userPreferences.locale$
        .pipe(takeUntilDestroyed())
        .subscribe(locale => {
            this.currentLocale = locale;
        });
}
```

Available observables:
- `locale$` - Observable for locale changes
- `paginationSize$` - Observable for pagination size changes  
- `supportedPageSizes$` - Observable for supported page sizes changes

**Note:** When subscribing to observables from a singleton service in a component, always use `takeUntilDestroyed()` or `takeUntil()` to prevent memory leaks.
