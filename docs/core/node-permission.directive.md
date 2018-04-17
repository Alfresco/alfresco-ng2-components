---
Added: v2.0.0
Status: Active
Last reviewed: 2018-04-10
---

# Node Permission directive

Selectively disables an HTML element or Angular component

## Basic Usage

```html
<adf-toolbar title="toolbar example">
    <button mat-icon-button
            adf-node-permission="delete"
            [adf-nodes]="documentList.selection">
        <mat-icon>delete</mat-icon>
    </button>
</adf-toolbar>

<adf-document-list #documentList ...>
 ...
</adf-document-list>
```

## Class members

### Properties

| Name | Type | Default value | Description |
| -- | -- | -- | -- |
| adf-nodes | `MinimalNodeEntity[]` |  \[] | Nodes to check permission for. |
| adf-node-permission | `string` |  null | Node permission to check (create, delete, update, updatePermissions, !create, !delete, !update, !updatePermissions). |

## Details

The Node Permission directive lets you disable an HTML element or Angular component
by taking a collection of `MinimalNodeEntity` instances and checking their permissions.

The decorated element will be disabled if:

-   there are no nodes in the collection
-   at least one of the nodes does not have the required permission

### HTML element example

A typical use case is to bind a [Document List](../content-services/document-list.component.md)
selection property to a toolbar button. In the following example, the "Delete" button should
be disabled if no selection is present or if user does not have permission to delete at least one
node in the selection:

```html
<adf-toolbar title="toolbar example">
    <button mat-icon-button
            adf-node-permission="delete"
            [adf-nodes]="documentList.selection">
        <mat-icon>delete</mat-icon>
    </button>
</adf-toolbar>

<adf-document-list #documentList ...>
 ...
</adf-document-list>
```

The button will be disabled by default and will change state when the user selects or deselects
one or more documents that they have permission to delete.

### Angular component example

You can add the directive to any Angular component that implements the `NodePermissionSubject`
interface (the [Upload Drag Area component](../content-services/upload-drag-area.component.md),
for example). You can also use it in much the same way as you would with an HTML element:

```html
<alfresco-upload-drag-area
        [parentId]="..."
        [versioning]="..."
        [adf-node-permission]="'create'"
        [adf-nodes]="getCurrentDocumentListNode()">
 ...
</alfresco-upload-drag-area>
```

To enable your own component to work with this directive, you need to implement the
`NodePermissionSubject` interface and also define it as an EXTENDIBLE_COMPONENT parent component,
as described in the following sections.

### Implementing the NodePermissionSubject interface

The component must implement the `NodePermissionSubject` interface which means it must have a
boolean `disabled` property. This is the property that will be set by the directive:

```js
import { NodePermissionSubject } from '@alfresco/adf-core';

@Component({...})
export class UploadDragAreaComponent implements NodePermissionSubject {
    public disabled: boolean = false;
}
```

### Defining your component as an EXTENDIBLE_COMPONENT parent component

The directive will look up the component in the dependency injection tree,
up to the `@Host()` component. The host component is typically the component that requests
the dependency. However, when this component is projected into a parent component, the
parent becomes the host. This means you must provide your component with forward referencing
as the `EXTENDIBLE_COMPONENT` and also provide your component as a `viewProvider`:

```js
import { EXTENDIBLE_COMPONENT } from '@alfresco/adf-core';

@Component({
    ...
    viewProviders: [
        { provide: EXTENDIBLE_COMPONENT, useExisting: forwardRef(() => UploadDragAreaComponent)}
    ]
})
export class UploadDragAreaComponent implements NodePermissionSubject { ... }
```

**Note:** the usage of **viewProviders** (instead of **providers**) is very important, especially
if you want to use this directive on a transcluded component.
