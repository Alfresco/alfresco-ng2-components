---
Added: v2.0.0
Status: Deprecated
---
# Renditions service

Manages prearranged conversions of content to different formats.

## Class members

### Methods

`isRenditionAvailable(nodeId: string, encoding: string): Observable<boolean>`<br/>
Has the specified rendition been set up for this item?

`isConversionPossible(nodeId: string, encoding: string): Observable<boolean>`<br/>
Is it possible to convert this item to the specified format?

`getRenditionUrl(nodeId: string, encoding: string): string`<br/>
Gets a URL linking to a rendition.

`getRenditionsListByNodeId(nodeId: string): Observable<RenditionPaging>`<br/>
Gets all available renditions for an item.

`convert(nodeId: string, encoding: string, pollingInterval: number = 1000)`<br/>
Performs a format conversion on an item directly.

## Details

**Note:** This service is deprecated from v2.2.0 and may be removed in a future
version of ADF.

ACS allows content items to be converted to other formats for display or delivery.
For example, a raw text file might be converted to HTML to enable better formatting
in a web browser or a PDF might be converted to an equivalent bitmap image. A
*rendition* is a prearranged conversion that is set up for an item for convenient
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
