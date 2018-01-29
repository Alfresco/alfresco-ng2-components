# Dropdown Breadcrumb Component

Indicates the current position within a navigation hierarchy using a dropdown menu.

![Dropdown Breadcrumb screenshot](docassets/images/DropdownBreadcrumb.png)

## Basic Usage

```html
<adf-dropdown-breadcrumb  *ngIf="useDropdownBreadcrumb"
    [target]="documentList"
    [folderNode]="documentList.folderNode">
</adf-dropdown-breadcrumb>
```

### Properties

| Name | Type | Description |
| ---- | ---- | ----------- |
| folderNode | `MinimalNodeEntryEntity` | Active node, builds UI based on folderNode.path.elements collection. <br/> Default value: `null` |
| root | `string` | (optional) Name of the root element of the breadcrumb. You can use this property to rename "Company Home" to "Personal Files" for example. You can use an i18n resource key for the property value.<br/> Default value: `null` |
| rootId | `string` | (optional) The id of the root element. You can use this property to set a custom element the breadcrumb should start with.<br/> Default value: `null` |
| target | `DocumentListComponent` | (optional) Document List component to operate with. The list will update when the breadcrumb is clicked. |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| navigate | `EventEmitter<PathElementEntity>` | Emitted when the user clicks on a breadcrumb. |

## See also

-   [Document list component](document-list.component.md)
-   [Breadcrumb component](breadcrumb.component.md)
