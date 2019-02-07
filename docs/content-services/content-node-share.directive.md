---
Title: Node Public File Share Directive
Added: v2.3.0
Status: Active
Last reviewed: 2018-09-13
---

# [Node Public File Share Directive](../../lib/content-services/content-node-share/content-node-share.directive.ts "Defined in content-node-share.directive.ts")

Creates and manages public shared links for files.

![adf-share](../docassets/images/share-directive.png)

## Basic Usage

```html
<adf-toolbar>
    <button mat-icon-button
            #shared="adfShare"
            [disabled]="!shared.isFile"
            [baseShareUrl]="http://localhost:8080/myrouteForShareFile/"
            [adf-share]="documentList.selection[0]">
            <mat-icon>share</mat-icon>
    </button>
</adf-toolbar>

<adf-document-list #documentList ...>
 ...
</adf-document-list>
```

## Class members

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| baseShareUrl | `string` |  | Prefix to add to the generated link. |
| node | [`NodeEntry`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/NodeEntry.md) |  | [Node](https://github.com/Alfresco/alfresco-js-api/blob/development/src/api/content-rest-api/docs/Node.md) to share. |

## Details

This dialog will generate a link with the form "baseShareUrl + sharedId".
For example, if you set the input parameter as follows:

    [baseShareUrl]="http://localhost:8080/myrouteForShareFile/"

...or through `app.config.json`:

    {
        ...
        "baseShareUrl": 'http://external/url',
        ...
    }

...then the directive will ask the [Content service](../core/content.service.md) to generate
a `sharedId` for the file. This will create a URL like the following:

    http://localhost:8080/myrouteForShareFile/NEW_GENERATED_SHAREID

To use this, you will need to implement some code that gets the `NEW_GENERATED_SHAREID` with the router
and passes it to a [Viewer component](../core/viewer.component.md):

```html
<adf-viewer
    [sharedLinkId]="NEW_GENERATED_SHAREID"
    [allowGoBack]="false">
</adf-viewer>
```
