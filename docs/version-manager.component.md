# Version Manager Component

Displays the version history of a node with the ability to upload a new version.

![#f03c15](https://placehold.it/15/f03c15/000000?text=+) `This component is still in experimental phase, it has several limitations which will be resolved soon.`

![Version Manager](docassets/images/version-manager.png)

## Basic Usage

```html
<adf-version-manager [node]="aMinimalNodeEntryEntity"></adf-version-manager>
```

### Properties

| Name | Type | Description |
| --- | --- | --- |
| node | [MinimalNodeEntryEntity](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/NodeMinimalEntry.md) | The node you want to manage the version history of. |

## Details

### Version actions

Each version has a context menu on the right, with the following actions.

| Action   | Versions  | Description |
| ---      | ---       | ---         |
| Restore  | All       | Revert the current version to the selected one with creating a new version of it. |

<!-- Don't edit the See also section. Edit seeAlsoGraph.json and run config/generateSeeAlso.js -->
<!-- seealso start -->
## See also

- [Version list component](version-list.component.md)
- [Document list component](document-list.component.md)
<!-- seealso end -->