---
Added: v2.0.0
Status: Deprecated
---

# Renditions service

Manages prearranged conversions of content to different formats.

## Class members

### Methods

-   `convert(nodeId: string = null, encoding: string = null, pollingInterval: number = 1000, retries: number = 5): Observable<any>`<br/>

    -   `nodeId: string = null` -  
    -   `encoding: string = null` -  
    -   `pollingInterval: number = 1000` -  
    -   `retries: number = 5` -  
    -   **Returns** `Observable<any>` - 

-   `createRendition(nodeId: string = null, encoding: string = null): Observable<__type>`<br/>

    -   `nodeId: string = null` -  
    -   `encoding: string = null` -  
    -   **Returns** `Observable<__type>` - 

-   `getRendition(nodeId: string = null, encoding: string = null): Observable<RenditionEntry>`<br/>

    -   `nodeId: string = null` -  
    -   `encoding: string = null` -  
    -   **Returns** `Observable<RenditionEntry>` - 

-   `getRenditionUrl(nodeId: string = null, encoding: string = null): string`<br/>

    -   `nodeId: string = null` -  
    -   `encoding: string = null` -  
    -   **Returns** `string` - 

-   `getRenditionsListByNodeId(nodeId: string = null): Observable<RenditionPaging>`<br/>

    -   `nodeId: string = null` -  
    -   **Returns** `Observable<RenditionPaging>` - 

-   `isConversionPossible(nodeId: string = null, encoding: string = null): Observable<boolean>`<br/>

    -   `nodeId: string = null` -  
    -   `encoding: string = null` -  
    -   **Returns** `Observable<boolean>` - 

-   `isRenditionAvailable(nodeId: string = null, encoding: string = null): Observable<boolean>`<br/>

    -   `nodeId: string = null` -  
    -   `encoding: string = null` -  
    -   **Returns** `Observable<boolean>` -

## Details

**Note:** This service is deprecated from v2.2.0 and may be removed in a future
version of ADF.

ACS allows content items to be converted to other formats for display or delivery.
For example, a raw text file might be converted to HTML to enable better formatting
in a web browser or a PDF might be converted to an equivalent bitmap image. A
_rendition_ is a prearranged conversion that is set up for an item for convenient
repeated use. More information about renditions is available in the
[Content Services documentation](https://docs.alfresco.com/5.2/references/dev-extension-points-content-transformer.html).

In the Renditions service methods, the `nodeId` is a string identifying the content
node that the rendition applies to. This can be obtained from
[Document List component](../content-services/document-list.component.md) events and various other places
in the ADF API. The `encoding` identifies the conversion performed by the rendition.

See the
[Renditions API page](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/RenditionsApi.md#createRendition)
in the Alfresco JS API for more information about the
[RenditionPaging](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/RenditionPaging.md)
class and other implementation details.
