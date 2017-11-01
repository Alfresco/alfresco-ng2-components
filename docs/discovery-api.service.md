# Discovery Api service

Gets version and license information for Process Services and Content Services.

## Methods

`public getEcmProductInfo(): Observable<EcmProductVersionModel>`<br/>
Gets product information for Content Services.

`public getBpmProductInfo(): Observable<BpmProductVersionModel>`<br/>
Gets product information for Process Services.

## Details

The product license and version information is returned using the
classes defined in the [Product Version model](product-version.model.md).
See the
[Alfresco JS API docs](https://github.com/Alfresco/alfresco-js-api/tree/master/src/alfresco-discovery-rest-api)
to learn more about the REST API used by this service.

<!-- Don't edit the See also section. Edit seeAlsoGraph.json and run config/generateSeeAlso.js -->
<!-- seealso start -->
## See also

- [Product version model](product-version.model.md)
<!-- seealso end -->



