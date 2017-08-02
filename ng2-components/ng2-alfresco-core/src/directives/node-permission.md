# Node Permission Directive

The `NodePermissionDirective` allows you to disable an HTML element or Angular component
by taking a collection of the `MinimalNodeEntity` instances and checking the particular permission.

The decorated element will be disabled if:

- there are no nodes in the collection
- at least one of the nodes has no expected permission

## Basic example

The best example to show `NodePermissionDirective` in action is by binding DocumentList selection property to a toolbar button.

For example the "Delete" button should be disabled if no selection is present or if user has no rights to delete at least one node in the selection.

```html
<adf-toolbar title="toolbar example">
    <button md-icon-button
            adf-node-permission="delete"
            [adf-nodes]="documentList.selection">
        <md-icon>delete</md-icon>
    </button>
</adf-toolbar>

<adf-document-list #documentList ...>
 ...
</adf-document-list>
```

The button will become disabled by default, and is going to change its state once user selects/unselects one or multiple documents that current user has permission to delete.

## Properties

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| adf-node-permission | string | null | Node permission to check |
| adf-nodes | MinimalNodeEntity[] | [] | Nodes to check permission for |