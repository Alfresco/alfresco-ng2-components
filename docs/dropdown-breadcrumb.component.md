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
| --- | --- | --- |
| target | DocumentListComponent | (optional) DocumentList component to operate with. Upon clicks will instruct the given component to update. |
| folderNode | [MinimalNodeEntryEntity](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/NodeMinimalEntry.md) | Active node, builds UI based on `folderNode.path.elements` collection. |
| root | string |  (optional) Name of the root element of the breadcrumb. You can use this property to rename "Company Home" to "Personal Files" for example. You can use i18n resource key for the property value. |
| rootId | string | (optional) The id of the root element. You can use this property to set a custom element the breadcrumb should start with. |

### Events

| Name | Returned Type | Description |
| --- | --- | --- |
| navigate | [PathElementEntity](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/PathElementEntity.md) | emitted when user clicks on a breadcrumb  |

<!-- Don't edit the See also section. Edit seeAlsoGraph.json and run config/generateSeeAlso.js -->
<!-- seealso start -->
## See also

- [Document list component](document-list.component.md)
- [Breadcrumb component](breadcrumb.component.md)
<!-- seealso end -->