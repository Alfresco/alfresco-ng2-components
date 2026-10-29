---
Title: Cascading Dictionary service
Added: v8.0.0
Status: Active
Last reviewed: 2026-10-26
---

# [Cascading Dictionary service](../../../lib/content-services/src/lib/cascading-dictionary/services/cascading-dictionary.service.ts "Defined in cascading-dictionary.service.ts")

Manages cascading dictionaries in Content Services.

## Details

Cascading dictionaries are versioned, hierarchical lookup tables that automatically populate a node's
properties from a single key property. Each dictionary is backed by an aspect extending
`cd:classifiable` and is identified by that aspect's prefixed name, e.g. `cdict:account`.

The underlying endpoints are available in **Alfresco Enterprise 26.2 and newer**. Read operations are
available to any authenticated user; create, update and delete require admin rights and return `403`
otherwise.

## Class members

### Methods

-   **listCascadingDictionaries**(skipCount?: `number`, maxItems?: `number`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`CascadingDictionaryList`](https://github.com/Alfresco/alfresco-ng2-components/blob/develop/lib/js-api/src/api/content-rest-api/docs/CascadingDictionariesApi.md)`>`<br/>
    Lists cascading dictionaries registered in the system, with their latest version.
    -   _skipCount:_ `number`  - Number of cascading dictionaries to skip
    -   _maxItems:_ `number`  - Maximum number of cascading dictionaries to return
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`CascadingDictionaryList`](https://github.com/Alfresco/alfresco-ng2-components/blob/develop/lib/js-api/src/api/content-rest-api/docs/CascadingDictionariesApi.md)`>` - CascadingDictionaryList object (defined in JS-API) with the dictionary paging list
-   **getCascadingDictionary**(aspectId: `string`, includeData: `boolean` = `false`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`CascadingDictionaryEntry`](https://github.com/Alfresco/alfresco-ng2-components/blob/develop/lib/js-api/src/api/content-rest-api/docs/CascadingDictionariesApi.md)`>`<br/>
    Gets the latest version of the cascading dictionary registered for an aspect.
    -   _aspectId:_ `string`  - The prefixed name of the aspect, e.g. 'cdict:account'
    -   _includeData:_ `boolean`  - Whether the dictionary entries should be returned alongside the metadata
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`CascadingDictionaryEntry`](https://github.com/Alfresco/alfresco-ng2-components/blob/develop/lib/js-api/src/api/content-rest-api/docs/CascadingDictionariesApi.md)`>` - CascadingDictionaryEntry object (defined in JS-API) containing the dictionary
-   **getCascadingDictionaryVersion**(aspectId: `string`, versionId: `string`, includeData: `boolean` = `false`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`CascadingDictionaryEntry`](https://github.com/Alfresco/alfresco-ng2-components/blob/develop/lib/js-api/src/api/content-rest-api/docs/CascadingDictionariesApi.md)`>`<br/>
    Gets a specific version of the cascading dictionary registered for an aspect.
    -   _aspectId:_ `string`  - The prefixed name of the aspect, e.g. 'cdict:account'
    -   _versionId:_ `string`  - The version label, e.g. '1.0'
    -   _includeData:_ `boolean`  - Whether the dictionary entries should be returned alongside the metadata
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`CascadingDictionaryEntry`](https://github.com/Alfresco/alfresco-ng2-components/blob/develop/lib/js-api/src/api/content-rest-api/docs/CascadingDictionariesApi.md)`>` - CascadingDictionaryEntry object (defined in JS-API) containing the dictionary at that version
-   **createCascadingDictionary**(payload: [`CascadingDictionaryBodyCreate`](https://github.com/Alfresco/alfresco-ng2-components/blob/develop/lib/js-api/src/api/content-rest-api/docs/CascadingDictionariesApi.md)): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`CascadingDictionaryCreateEntry`](https://github.com/Alfresco/alfresco-ng2-components/blob/develop/lib/js-api/src/api/content-rest-api/docs/CascadingDictionariesApi.md)`>`<br/>
    Creates a cascading dictionary definition. Requires admin rights. The response carries only the creation timestamp, so call `getCascadingDictionary` to read the created dictionary back.
    -   _payload:_ [`CascadingDictionaryBodyCreate`](https://github.com/Alfresco/alfresco-ng2-components/blob/develop/lib/js-api/src/api/content-rest-api/docs/CascadingDictionariesApi.md)  - The cascading dictionary information to create
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`CascadingDictionaryCreateEntry`](https://github.com/Alfresco/alfresco-ng2-components/blob/develop/lib/js-api/src/api/content-rest-api/docs/CascadingDictionariesApi.md)`>` - CascadingDictionaryCreateEntry object (defined in JS-API) containing the creation timestamp
-   **updateCascadingDictionary**(aspectId: `string`, payload: [`CascadingDictionaryBodyUpdate`](https://github.com/Alfresco/alfresco-ng2-components/blob/develop/lib/js-api/src/api/content-rest-api/docs/CascadingDictionariesApi.md)): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`CascadingDictionaryUpdateEntry`](https://github.com/Alfresco/alfresco-ng2-components/blob/develop/lib/js-api/src/api/content-rest-api/docs/CascadingDictionariesApi.md)`>`<br/>
    Updates the metadata of a cascading dictionary definition. Requires admin rights. The response carries only the modification timestamp, so call `getCascadingDictionary` to read the updated dictionary back.
    -   _aspectId:_ `string`  - The prefixed name of the aspect, e.g. 'cdict:account'
    -   _payload:_ [`CascadingDictionaryBodyUpdate`](https://github.com/Alfresco/alfresco-ng2-components/blob/develop/lib/js-api/src/api/content-rest-api/docs/CascadingDictionariesApi.md)  - The cascading dictionary information to update
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`CascadingDictionaryUpdateEntry`](https://github.com/Alfresco/alfresco-ng2-components/blob/develop/lib/js-api/src/api/content-rest-api/docs/CascadingDictionariesApi.md)`>` - CascadingDictionaryUpdateEntry object (defined in JS-API) containing the modification timestamp
-   **createCascadingDictionaryContent**(aspectId: `string`, content: [`CascadingDictionaryContentBody`](https://github.com/Alfresco/alfresco-ng2-components/blob/develop/lib/js-api/src/api/content-rest-api/docs/CascadingDictionariesApi.md), majorVersion: `boolean` = `false`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`CascadingDictionaryEntry`](https://github.com/Alfresco/alfresco-ng2-components/blob/develop/lib/js-api/src/api/content-rest-api/docs/CascadingDictionariesApi.md)`>`<br/>
    Uploads a new content version of a cascading dictionary. Requires admin rights.
    -   _aspectId:_ `string`  - The prefixed name of the aspect, e.g. 'cdict:account'
    -   _content:_ [`CascadingDictionaryContentBody`](https://github.com/Alfresco/alfresco-ng2-components/blob/develop/lib/js-api/src/api/content-rest-api/docs/CascadingDictionariesApi.md)  - The levels and entries of the cascading dictionary
    -   _majorVersion:_ `boolean`  - Whether a major version should be created instead of a minor one
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`CascadingDictionaryEntry`](https://github.com/Alfresco/alfresco-ng2-components/blob/develop/lib/js-api/src/api/content-rest-api/docs/CascadingDictionariesApi.md)`>` - CascadingDictionaryEntry object (defined in JS-API) containing the new version of the dictionary
-   **deleteCascadingDictionary**(aspectId: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<void>`<br/>
    Deletes a cascading dictionary definition and all of its content versions. Requires admin rights.
    -   _aspectId:_ `string`  - The prefixed name of the aspect, e.g. 'cdict:account'
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<void>` - [`Observable`](http://reactivex.io/documentation/observable.html)&lt;void>

## See also

-   [Cascading Dictionaries REST API](https://github.com/Alfresco/alfresco-ng2-components/blob/develop/lib/js-api/src/api/content-rest-api/docs/CascadingDictionariesApi.md)
