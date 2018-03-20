---
Added: v2.3.0
Status: Active
---
# Node Share directive

Allows files to be shared (Note the folder can not be shared)

![adf-share](../docassets/images/share-directive.png)

This dialog will generate a link that will be formed as "baseShareUrl + sharedId".
For example if you set the input parameter [baseShareUrl]="http://localhos:8080/myrouteForShareFile/", 
the directive will ask to the Content service to generate a sharedId for the file. This will end up with a url link like :

http://localhos:8080/myrouteForShareFile/NEW_GENERATED_SHAREID

After you will need to implement in your app a logic that throught the router get the NEW_GENERATED_SHAREID and pass it to the ***adf-viewer***

```html
<adf-viewer
    [sharedLinkId]="NEW_GENERATED_SHAREID"
    [allowGoBack]="false">
</adf-viewer>
```

## Basic Usage

```html
<adf-toolbar>
    <button mat-icon-button
            [baseShareUrl]="http://localhos:8080/myrouteForShareFile/"
            [adf-share]="documentList.selection[0]">
            <mat-icon>share</mat-icon>
    </button>
</adf-toolbar>

<adf-document-list #documentList ...>
 ...
</adf-document-list>
```

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| node | `MinimalNodeEntity` |  | Nodes to share.  |
| baseShareUrl | `string` |  | baseShareUrl to add as prefix to the generated link  |


