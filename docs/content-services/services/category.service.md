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

-   **createSubcategory**(parentCategoryId: `string`, payload: `CategoryBody`): [`Observable`](http://reactivex.io/documentation/observable.html)`<CategoryEntry>`<br/>
    Creates subcategory under category with provided categoryId
    -   _parentCategoryId:_ `string`  - The identifier of a parent category.
    -   _payload:_ `CategoryBody`  - Created category body
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<CategoryEntry>` - [`Observable`](http://reactivex.io/documentation/observable.html)&lt;CategoryEntry>
-   **deleteCategory**(categoryId: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<void>`<br/>
    Deletes category
    -   _categoryId:_ `string`  - The identifier of a category.
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<void>` - [`Observable`](http://reactivex.io/documentation/observable.html)&lt;void>
-   **getSubcategories**(parentCategoryId: `string`, skipCount?: `number`, maxItems?: `number`): [`Observable`](http://reactivex.io/documentation/observable.html)`<CategoryPaging>`<br/>
    Get subcategories of a given parent category
    -   _parentCategoryId:_ `string`  - The identifier of a parent category.
    -   _skipCount:_ `number`  - (Optional) Number of top categories to skip.
    -   _maxItems:_ `number`  - (Optional) Maximum number of subcategories returned from [Observable](http://reactivex.io/documentation/observable.html).
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<CategoryPaging>` - [`Observable`](http://reactivex.io/documentation/observable.html)&lt;CategoryPaging>
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

## Details

See the
[Categories API](https://github.com/Alfresco/alfresco-js-api/blob/master/src/api/content-rest-api/docs/CategoriesApi.md)
in the Alfresco JS API for more information about the types returned by [Category
service](category.service.md) methods and for the implementation of the REST API the service is
based on.
