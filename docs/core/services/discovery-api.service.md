---
Title: Discovery Api service
Added: v2.0.0
Status: Active
Last reviewed: 2018-11-19
---

# [Discovery Api service](../../../lib/content-services/src/lib/common/services/discovery-api.service.ts "Defined in discovery-api.service.ts")

Gets version and license information for Process Services and Content Services.

## Class members

### Methods

-   **getBPMSystemProperties**(): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`SystemPropertiesRepresentation`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/activiti-rest-api/docs/SystemPropertiesRepresentation.md)`>`<br/>

    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`SystemPropertiesRepresentation`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/activiti-rest-api/docs/SystemPropertiesRepresentation.md)`>` - 

-   **getBpmProductInfo**(): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`BpmProductVersionModel`](../../../lib/core/src/lib/models/product-version.model.ts)`>`<br/>
    Gets product information for Process Services.
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`BpmProductVersionModel`](../../../lib/core/src/lib/models/product-version.model.ts)`>` - ProductVersionModel containing product details
-   **getEcmProductInfo**(): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`RepositoryInfo`](../../../lib/core/src/lib/about/about-repository-info/repository-info.interface.ts)`>`<br/>
    Gets product information for Content Services.
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`RepositoryInfo`](../../../lib/core/src/lib/about/about-repository-info/repository-info.interface.ts)`>` - ProductVersionModel containing product details

## Details

The product license and version information is returned using the
classes defined in the [Product Version model](../models/product-version.model.md).
See the
[Alfresco JS API docs](https://github.com/Alfresco/alfresco-js-api/tree/master/src/alfresco-discovery-rest-api)
to learn more about the REST API used by this service.

## See also

-   [Product version model](../models/product-version.model.md)
