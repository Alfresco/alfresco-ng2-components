---
Added: v2.0.0
Status: Active
---
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

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| folderNode | `MinimalNodeEntryEntity` | `null` | Active node, builds UI based on folderNode.path.elements collection.  |
| root | `string` | `null` | (optional) Name of the root element of the breadcrumb. You can use this property to rename "Company Home" to "Personal Files" for example. You can use an i18n resource key for the property value. |
| rootId | `string` | `null` | (optional) The id of the root element. You can use this property to set a custom element the breadcrumb should start with. |
| target | `DocumentListComponent` |  | (optional) Document List component to operate with. The list will update when the breadcrumb is clicked. |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| navigate | `EventEmitter<PathElementEntity>` | Emitted when the user clicks on a breadcrumb. |

## See also

-   [Document list component](document-list.component.md)
-   [Breadcrumb component](breadcrumb.component.md)
