# Version Manager Component

The Version manager component displays the version history of a node with the ability to upload a new version.

![#f03c15](https://placehold.it/15/f03c15/000000?text=+) `This component is still in experimental phase, it has several limitations which will be resolved soon.`

![Version Manager](docassets/images/version-manager.png)

## Basic Usage

```html
<adf-version-manager [node]="aMinimalNodeEntryEntity"></adf-version-manager>
```

### Properties

| Name | Type | Description |
| --- | --- | --- |
| node | [MinimalNodeEntryEntity](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/NodeMinimalEntry.md) | The node you want to see the version history of. |


## Version List component

Inside the version manager component, there is the underlying VersionListComponent

## Basic Usage

```html
<adf-version-list [node]="aMinimalNodeEntryEntity"></adf-version-list>
```

### Properties

| Name | Type | Description |
| --- | --- | --- |
| node | [MinimalNodeEntryEntity](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/NodeMinimalEntry.md) | The node you want to see the version history of. |

<!-- Don't edit the See also section. Edit seeAlsoGraph.json and run config/generateSeeAlso.js -->
<!-- seealso start -->
## See also
<!-- seealso end -->