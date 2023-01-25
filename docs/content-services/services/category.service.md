---
Title: Category service
Added: v6.0.0-A.1
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
-   **createSubcategory**(parentCategoryId: `string`, payload: [`CategoryBody`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/api/content-rest-api/docs/CategoryBody.md)): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`CategoryEntry`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/api/content-rest-api/docs/CategoryEntry.md)`>`<br/>
    Creates subcategory under category with provided categoryId.
    -   _parentCategoryId:_ `string`  - Identifier of a parent category
    -   _payload:_ [`CategoryBody`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/api/content-rest-api/docs/CategoryBody.md)  - Created category body
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`CategoryEntry`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/api/content-rest-api/docs/CategoryEntry.md)`>` - CategoryEntry object (defined in JS-API) containing the category
-   **updateCategory**(categoryId: `string`, payload: [`CategoryBody`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/api/content-rest-api/docs/CategoryBody.md)): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`CategoryEntry`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/api/content-rest-api/docs/CategoryEntry.md)`>`<br/>
    Updates category.
    -   categoryId:_ `string`  - Identifier of a category
    -   _payload:_ [`CategoryBody`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/api/content-rest-api/docs/CategoryBody.md)  - Created category body
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`CategoryEntry`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/api/content-rest-api/docs/CategoryEntry.md)`>` - CategoryEntry object (defined in JS-API) containing the category
-   **deleteCategory**(categoryId: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<void>`<br/>
    Deletes category.
    -   _categoryId:_ `string`  - Identifier of a category
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<void>` - Null object when the operation completes

## Details

See the
[Categories API](https://github.com/Alfresco/alfresco-js-api/blob/master/src/api/content-rest-api/docs/CategoriesApi.md)
in the Alfresco JS API for more information about the types returned by [Category
service](category.service.md) methods and for the implementation of the REST API the service is
based on.
