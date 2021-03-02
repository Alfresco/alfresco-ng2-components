---
Title: User Preference Cloud Service
Added: v3.4.0
Status: Experimental
Last reviewed: 2019-08-06
---

# [User Preference Cloud Service](../../../lib/process-services-cloud/src/lib/services/user-preference-cloud.service.ts "Defined in user-preference-cloud.service.ts")

Manages user preferences.

## Class members

### Methods

-   **createPreference**(appName: `string`, key: `string`, newPreference: `any`): [`Observable`](http://reactivex.io/documentation/observable.html)`<any>`<br/>
    Creates user preference.
    -   _appName:_ `string`  - Name of the target app
    -   _key:_ `string`  - Key of the target preference
    -   _newPreference:_ `any`  - 
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<any>` - Observable of created user preferences
-   **deletePreference**(appName: `string`, key: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<any>`<br/>
    Deletes user preference by given preference key.
    -   _appName:_ `string`  - Name of the target app
    -   _key:_ `string`  - Key of the target preference
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<any>` - Observable of delete operation status
-   **getBasePath**(appName: `string`): `string`<br/>

    -   _appName:_ `string`  - 
    -   **Returns** `string` - 

-   **getPreferenceByKey**(appName: `string`, key: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<any>`<br/>
    Gets user preference.
    -   _appName:_ `string`  - Name of the target app
    -   _key:_ `string`  - Key of the target preference
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<any>` - Observable of user preference
-   **getPreferences**(appName: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<any>`<br/>
    Gets user preferences
    -   _appName:_ `string`  - Name of the target app
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<any>` - List of user preferences
-   **updatePreference**(appName: `string`, key: `string`, updatedPreference: `any`): [`Observable`](http://reactivex.io/documentation/observable.html)`<any>`<br/>
    Updates user preference.
    -   _appName:_ `string`  - Name of the target app
    -   _key:_ `string`  - Key of the target preference
    -   _updatedPreference:_ `any`  - Details of updated preference
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<any>` - Observable of updated user preferences

## See also

-   [Local preference Cloud Service](local-preference-cloud.service.md)
