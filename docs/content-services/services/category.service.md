---
Title: Category service
Added: v6.0.0.0
Status: Active
Last reviewed: 2023-01-25
---

# [Category service](../../../lib/content-services/src/lib/category/services/category.service.ts "Defined in category.service.ts")

Manages categories in Content Services.

## Class members

### Methods

-   **getSubcategories**(parentCategoryId: `string`, skipCount?: `number`, maxItems?: `number`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`CategoryPaging`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/api/content-rest-api/docs/CategoryPaging.md)`>`<br/>
    Gets subcategories of a given parent category.
    -   _parentCategoryId:_ `string`  - Identifier of a parent category
    -   _skipCount:_ `number`  - Number of top categories to skip
    -   _maxItems:_ `number`  - Maximum number of subcategories returned from Observable
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`CategoryPaging`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/api/content-rest-api/docs/CategoryPaging.md)`>` - CategoryPaging object (defined in JS-API) with category paging list
-   **getCategory**(categoryId: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`CategoryEntry`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/api/content-rest-api/docs/CategoryEntry.md)`>`<br/>
    Gets a specific category by categoryId.
    -   _categoryId:_ `string`  - The identifier of a category
    -   _opts:_ `any`  - Optional parameters
    -   _opts.fields_ `string[]` - A list of field names
    -   _opts.include_ `string[]` - Returns additional information about the category. The following optional fields can be requested: count, path
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`CategoryEntry`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/api/content-rest-api/docs/CategoryEntry.md)`>` - CategoryEntry object (defined in JS-API) containing information about the category.
-   **createSubcategories**(parentCategoryId: `string`, payload: [`CategoryBody[]`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/api/content-rest-api/docs/CategoryBody.md)): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`CategoryPaging`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/api/content-rest-api/docs/CategoryPaging.md) | [`CategoryEntry`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/api/content-rest-api/docs/CategoryEntry.md)`>`<br/>
    Creates subcategories under category with provided categoryId.
    -   _parentCategoryId:_ `string`  - Identifier of a parent category
    -   _payload:_ [`CategoryBody[]`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/api/content-rest-api/docs/CategoryBody.md)  - List of categories to be created
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`CategoryPaging`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/api/content-rest-api/docs/CategoryPaging.md) | [`CategoryEntry`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/api/content-rest-api/docs/CategoryEntry.md)`>` - CategoryEntry object (defined in JS-API) containing the category
-   **updateCategory**(categoryId: `string`, payload: [`CategoryBody`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/api/content-rest-api/docs/CategoryBody.md)): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`CategoryEntry`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/api/content-rest-api/docs/CategoryEntry.md)`>`<br/>
    Updates category.
    -   _categoryId:_ `string`  - Identifier of a category
    -   _payload:_ [`CategoryBody`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/api/content-rest-api/docs/CategoryBody.md)  - Created category body
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`CategoryEntry`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/api/content-rest-api/docs/CategoryEntry.md)`>` - CategoryEntry object (defined in JS-API) containing the category
-   **deleteCategory**(categoryId: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<void>`<br/>
    Deletes category
    -   _categoryId:_ `string`  - The identifier of a category.
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<void>` - [`Observable`](http://reactivex.io/documentation/observable.html)&lt;void>
-   **searchCategories**(name: `string`, skipCount: `number` = `0`, maxItems?: `number`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`ResultSetPaging`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/search-rest-api/docs/ResultSetPaging.md)`>`<br/>
    Searches categories by their name.
    -   _name:_ `string`  - Value for name which should be used during searching categories.
    -   _skipCount:_ `number`  - Specify how many first results should be skipped. Default 0.
    -   _maxItems:_ `number`  - (Optional) Specify max number of returned categories. Default is specified by [UserPreferencesService](../../core/services/user-preferences.service.md).
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`ResultSetPaging`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/search-rest-api/docs/ResultSetPaging.md)`>` - [`Observable`](http://reactivex.io/documentation/observable.html)&lt;ResultSetPaging> Found categories which name contains searched name.
-   **updateCategory**(categoryId: `string`, payload: `CategoryBody`): [`Observable`](http://reactivex.io/documentation/observable.html)`<CategoryEntry>`<br/>
    Updates category
    -   _categoryId:_ `string`  - The identifier of a category.
    -   _payload:_ `CategoryBody`  - Updated category body
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<CategoryEntry>` - [`Observable`](http://reactivex.io/documentation/observable.html)&lt;CategoryEntry>
-   **getCategoryLinksForNode**(nodeId: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`CategoryPaging`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/api/content-rest-api/docs/CategoryPaging.md)`>`<br/>
    Provides list of categories that node is linked to.
    -   _nodeId:_ `string`  - Id of a node that is linked to categories
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`CategoryPaging`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/api/content-rest-api/docs/CategoryPaging.md)`>` - Found categories that node is linked to.
-   **unlinkNodeFromCategory**(nodeId: `string`, categoryId: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<void>`<br/>
    Unlinks category from a node.
    -   _nodeId:_ `string`  - The identifier of a node.
    -   _categoryId:_ `string`  - The identifier of a category.
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<void>`
-   **linkNodeToCategory**(nodeId: `string`, categoryLinkBodyCreate: `CategoryLinkBody[]`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`CategoryPaging`]((https://github.com/Alfresco/alfresco-js-api/blob/master/src/api/content-rest-api/docs/CategoryPaging.md))` | `[`CategoryEntry`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/api/content-rest-api/docs/CategoryEntry.md)`>`<br/>
    Links node to a category.
    -   _nodeId:_ `string`  - The identifier of a node.
    -   _categoryLinkBodyCreate:_ [`CategoryLinkBody[]`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/api/content-rest-api/docs/CategoryLinkBody.md)  - Categories that node will be linked to.
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`CategoryPaging`]((https://github.com/Alfresco/alfresco-js-api/blob/master/src/api/content-rest-api/docs/CategoryPaging.md))` | `[`CategoryEntry`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/api/content-rest-api/docs/CategoryEntry.md)`>` - Categories that node has been linked to.

## Details

See the
[Categories API](https://github.com/Alfresco/alfresco-js-api/blob/master/src/api/content-rest-api/docs/CategoriesApi.md)
in the Alfresco JS API for more information about the types returned by [Category
service](category.service.md) methods and for the implementation of the REST API the service is
based on.
