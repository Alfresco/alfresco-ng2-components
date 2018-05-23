---
Added: v2.0.0
Status: Active
Last reviewed: 2018-04-05
---

# Discovery Api service

Gets version and license information for Process Services and Content Services.

## Class members

### Methods

-   **getBpmProductInfo**(): `Observable<any>`<br/>
    Gets product information for Process Services.
    -   **Returns** `Observable<any>` - ProductVersionModel containing product details
-   **getEcmProductInfo**(): `Observable<any>`<br/>
    Gets product information for Content Services.
    -   **Returns** `Observable<any>` - ProductVersionModel containing product details

## Details

The product license and version information is returned using the
classes defined in the [Product Version model](product-version.model.md).
See the
[Alfresco JS API docs](https://github.com/Alfresco/alfresco-js-api/tree/master/src/alfresco-discovery-rest-api)
to learn more about the REST API used by this service.

## See also

-   [Product version model](product-version.model.md)
