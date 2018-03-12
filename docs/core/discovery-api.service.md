---
Added: v2.0.0
Status: Active
---
# Discovery Api service

Gets version and license information for Process Services and Content Services.

## Methods

-   `getEcmProductInfo(): any`  
    Gets product information for Content Services.  

-   `getBpmProductInfo(): any`  
    Gets product information for Process Services.  

## Details

The product license and version information is returned using the
classes defined in the [Product Version model](product-version.model.md).
See the
[Alfresco JS API docs](https://github.com/Alfresco/alfresco-js-api/tree/master/src/alfresco-discovery-rest-api)
to learn more about the REST API used by this service.

## See also

-   [Product version model](product-version.model.md)
