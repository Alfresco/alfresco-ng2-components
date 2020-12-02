---
Title: Local Preference Cloud Service
Added: v3.4.0
Status: Experimental
Last reviewed: 2019-08-06
---

# [Local Preference Cloud Service](../../../lib/process-services-cloud/src/lib/services/local-preference-cloud.service.ts "Defined in local-preference-cloud.service.ts")

Manages Local Storage preferences.

## Class members

### Methods

*   **createPreference**(\_: `string`, key: `string`, newPreference: `any`): [`Observable`](http://reactivex.io/documentation/observable.html)`<any>`<br/>
    Creates local preference.
    *   *\_:* `string`  - Name of the target app
    *   *key:* `string`  - Key of the target preference
    *   *newPreference:* `any`  - Details of new local preference
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<any>` - Observable of created local preferences
*   **deletePreference**(key: `string`, preferences: `any`): [`Observable`](http://reactivex.io/documentation/observable.html)`<any>`<br/>
    Deletes local preference by given preference key.
    *   *key:* `string`  - Key of the target preference
    *   *preferences:* `any`  - Details of updated preferences
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<any>` - Observable of preferences without deleted preference
*   **getPreferenceByKey**(\_: `string`, key: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<any>`<br/>
    Gets local preference.
    *   *\_:* `string`  - Name of the target app
    *   *key:* `string`  - Key of the target preference
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<any>` - Observable of local preference
*   **getPreferences**(\_: `string`, key: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<any>`<br/>
    Gets local preferences
    *   *\_:* `string`  - Name of the target app
    *   *key:* `string`  - Key of the target preference
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<any>` - List of local preferences
*   **prepareLocalPreferenceResponse**(key: `string`): `any`<br/>

    *   *key:* `string`  -
    *   **Returns** `any` -
*   **updatePreference**(\_: `string`, key: `string`, updatedPreference: `any`): [`Observable`](http://reactivex.io/documentation/observable.html)`<any>`<br/>
    Updates local preference.
    *   *\_:* `string`  - Name of the target app
    *   *key:* `string`  - Key of the target preference
    *   *updatedPreference:* `any`  - Details of updated preference
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<any>` - Observable of updated local preferences

## See also

*   [User preference Cloud Service](user-preference-cloud.service.md)
