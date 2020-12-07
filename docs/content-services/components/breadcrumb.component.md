---
Title: Breadcrumb Component
Added: v2.0.0
Status: Active
Last reviewed: 2019-01-16
---

# [Breadcrumb Component](../../../lib/content-services/src/lib/breadcrumb/breadcrumb.component.ts "Defined in breadcrumb.component.ts")

Indicates the current position within a navigation hierarchy.

![Breadcrumb](../../docassets/images/breadcrumb.png)

## Basic Usage

```html
<adf-breadcrumb
    [target]="documentList">
</adf-breadcrumb>
```

## Class members

### Properties

| Name | Type | Default value | Description |
| --- | --- | --- | --- |
| folderNode | [`Node`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/Node.md) | null | Active node, builds UI based on folderNode.path.elements collection. |
| maxItems | `number` |  | Maximum number of nodes to display before wrapping them with a dropdown element. |
| root | `string` | null | (optional) Name of the root element of the breadcrumb. You can use this property to rename "Company Home" to "Personal Files" for example. You can use an i18n resource key for the property value. |
| rootId | `string` | null | (optional) The id of the root element. You can use this property to set a custom element the breadcrumb should start with. |
| target | [`DocumentListComponent`](../../content-services/components/document-list.component.md) |  | (optional) [Document List component](../../content-services/components/document-list.component.md) to operate with. The list will update when the breadcrumb is clicked. |
| transform | `Function` |  | Transformation to be performed on the chosen/folder node before building the breadcrumb UI. Can be useful when custom formatting is needed for the breadcrumb. You can change the path elements from the node that are used to build the breadcrumb using this function. |

### Events

| Name | Type | Description |
| --- | --- | --- |
| navigate | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<`[`PathElement`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/PathElement.md)`>` | Emitted when the user clicks on a breadcrumb. |

## Details

The `maxItems` property sets the maximum number of "crumbs" in the breadcrumb trail. If
the actual path contains more nodes than this then the earliest items in the path will be
removed and kept in a menu as with the
[Dropdown breadcrumb component](dropdown-breadcrumb.component.md).

### Using the transform function

The function supplied in the `transform` property lets you modify the [`Node`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/Node.md) object that the component
uses to find the "crumbs" for the list. You can use this, for example, to remove unwanted items from
the list by altering the node's `path.elements` property.

Below is an example of how you might do this with the
[Content Node Selector component](content-node-selector.component.md). In this case, you pass the
transform function via the `breadcrumbTransform` property of [`ContentNodeSelectorComponentData`](../../../lib/content-services/src/lib/content-node-selector/content-node-selector.component-data.interface.ts) during
initialization:

```ts
    const data: ContentNodeSelectorComponentData = {
        title: title,
        actionName: action,
        currentFolderId: contentEntry.parentId,
        imageResolver: this.imageResolver.bind(this),
        rowFilter : this.rowFilter.bind(this, contentEntry.id),
        isSelectionValid: this.hasEntityCreatePermission.bind(this),
        breadcrumbTransform: this.changeBreadcrumbPath.bind(this), // here is the transform function
        select: select
    };

    this.openContentNodeDialog(data, 'adf-content-node-selector-dialog', '630px');
```

A transform function to remove the "Sites" folder from the path would look something like this:

```ts
    private changeBreadcrumbPath(node: Node) {

        if (node && node.path && node.path.elements) {
            const elements = node.path.elements;

            if (elements.length > 1) {
                if (elements[1].name === 'Sites') {
                    elements.splice(1, 1);
                }
            }
        }

        return node;
    }
```

Below, the breadcrumb is shown before and after the transform function is applied:

![Content Node Selector breadcrumbTransform before/after screenshot](../../docassets/images/breadcrumbTransform.png)

## See also

*   [Document list component](document-list.component.md)
*   [Dropdown breadcrumb component](dropdown-breadcrumb.component.md)
