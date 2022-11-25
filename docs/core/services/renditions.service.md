---
Title: Renditions service
Added: v2.0.0
Status: Active
Last reviewed: 2019-01-23
---

# [Renditions service](../../../lib/core/src/lib/services/renditions.service.ts "Defined in renditions.service.ts")

Manages prearranged conversions of content to different formats.

## Class members

### Methods

-   **convert**(nodeId: `string`, encoding: `string`, pollingInterval: `number` = `1000`, retries: `number` = `5`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`RenditionEntry`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/RenditionEntry.md)`>`<br/>
    Repeatedly attempts to create a rendition, through to success or failure.
    -   _nodeId:_ `string`  - ID of the target node
    -   _encoding:_ `string`  - Name of the rendition encoding
    -   _pollingInterval:_ `number`  - Time interval (in milliseconds) between checks for completion
    -   _retries:_ `number`  - Number of attempts to make before declaring failure
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`RenditionEntry`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/RenditionEntry.md)`>` - True if the rendition was created, false otherwise
-   **createRendition**(nodeId: `string`, encoding: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<any>`<br/>
    Creates a rendition for a node.
    -   _nodeId:_ `string`  - ID of the target node
    -   _encoding:_ `string`  - Name of the rendition encoding
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<any>` - Null response to indicate completion
-   **generateRenditionForNode**(nodeId: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<any>`<br/>
    Generates a rendition for a node using the first available encoding.
    -   _nodeId:_ `string`  - ID of the target node
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<any>` - Null response to indicate completion
-   **getAvailableRenditionForNode**(nodeId: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`RenditionEntry`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/RenditionEntry.md)`>`<br/>
    Gets the first available rendition found for a node.
    -   _nodeId:_ `string`  - ID of the target node
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`RenditionEntry`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/RenditionEntry.md)`>` - Information object for the rendition
-   **getRendition**(nodeId: `string`, encoding: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`RenditionEntry`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/RenditionEntry.md)`>`<br/>
    Gets information about a rendition of a node.
    -   _nodeId:_ `string`  - ID of the target node
    -   _encoding:_ `string`  - Name of the rendition encoding
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`RenditionEntry`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/RenditionEntry.md)`>` - Information object about the rendition
-   **getRenditionUrl**(nodeId: `string`, encoding: `string`): `string`<br/>
    Gets a URL linking to the specified rendition of a node.
    -   _nodeId:_ `string`  - ID of the target node
    -   _encoding:_ `string`  - Name of the rendition encoding
    -   **Returns** `string` - URL string
-   **getRenditionsListByNodeId**(nodeId: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`RenditionPaging`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/RenditionPaging.md)`>`<br/>
    Gets a list of all renditions for a node.
    -   _nodeId:_ `string`  - ID of the target node
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`RenditionPaging`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/RenditionPaging.md)`>` - Paged list of rendition details
-   **isConversionPossible**(nodeId: `string`, encoding: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<boolean>`<br/>
    Checks if the node can be converted using the specified rendition.
    -   _nodeId:_ `string`  - ID of the target node
    -   _encoding:_ `string`  - Name of the rendition encoding
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<boolean>` - True if the node can be converted, false otherwise
-   **isRenditionAvailable**(nodeId: `string`, encoding: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<boolean>`<br/>
    Checks if the specified rendition is available for a node.
    -   _nodeId:_ `string`  - ID of the target node
    -   _encoding:_ `string`  - Name of the rendition encoding
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<boolean>` - True if the rendition is available, false otherwise

## Details

ACS allows content items to be converted to other formats for display or delivery.
For example, a raw text file might be converted to HTML to enable better formatting
in a web browser or a PDF might be converted to an equivalent bitmap image. A
_rendition_ is a prearranged conversion that is set up for an item for convenient
repeated use. More information about renditions is available in the
[Content Services documentation](https://docs.alfresco.com/5.2/references/dev-extension-points-content-transformer.html).

In the [Renditions service](renditions.service.md) methods, the `nodeId` is a string identifying the content
node that the rendition applies to. This can be obtained from
[Document List component](../../content-services/components/document-list.component.md) events and various other places
in the ADF API. The `encoding` identifies the conversion performed by the rendition.

See the
[Renditions API page](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/RenditionsApi.md#createRendition)
in the Alfresco JS API for more information about the
[`RenditionPaging`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/RenditionPaging.md)
class and other implementation details.
