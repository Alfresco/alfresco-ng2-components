# Node Permission Directive

<!-- markdown-toc start - Don't edit this section.  npm run toc to generate it-->

<!-- toc -->

- [Properties](#properties)
- [HTML element example](#html-element-example)
- [Angular component example](#angular-component-example)
  * [Implementing the NodePermissionSubject interface](#implementing-the-nodepermissionsubject-interface)
  * [Defining your components as an EXTENDIBLE_COMPONENT parent component](#defining-your-components-as-an-extendible_component-parent-component)

<!-- tocstop -->

<!-- markdown-toc end -->

The `NodePermissionDirective` allows you to disable an HTML element or Angular component
by taking a collection of the `MinimalNodeEntity` instances and checking the particular permission.

The decorated element will be disabled if:

- there are no nodes in the collection
- at least one of the nodes has no expected permission

## Properties

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| adf-node-permission | [Permissions](https://github.com/Alfresco/alfresco-ng2-components/blob/master/ng2-components/ng2-alfresco-core/src/models/permissions.enum.ts) | null | Node permission to check (create, delete, update, updatePermissions, !create, !delete, !update, !updatePermissions)|
| adf-nodes | MinimalNodeEntity[] | [] | Nodes to check permission for |

## HTML element example

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

## Angular component example

You can apply the directive on any angular component which implements the NodePermissionSubject interface. The upload drag area component can be a good candidate, since this one implements that interface. Applying the directive on an angular component is pretty much the same as applying it on an html element.

```html
<alfresco-upload-drag-area
        [parentId]="..."
        [versioning]="..."
        [adf-node-permission]="'create'"
        [adf-nodes]="getCurrentDocumentListNode()">
 ...
</alfresco-upload-drag-area>
```

When designing a component you want to work this directive with, you have two important things to care about.

### Implementing the NodePermissionSubject interface

The component has to implement the NodePermissionSubject interface which basically means it has to have a boolean **disabled** property. This is the property which will be set by the directive.

```js
import { NodePermissionSubject } from 'ng2-alfresco-core';

@Component({...})
export class UploadDragAreaComponent implements NodePermissionSubject {
    public disabled: boolean = false;
}
```

### Defining your components as an EXTENDIBLE_COMPONENT parent component

The directive will look up the component in the dependency injection tree, up to at most one step above the current DI level (@Host). Because of this, you have to provide your component with forward referencing as the EXTENDIBLE_COMPONENT.

```js
import { EXTENDIBLE_COMPONENT } from 'ng2-alfresco-core';

@Component({
    ...
    providers: [
        { provide: EXTENDIBLE_COMPONENT, useExisting: forwardRef(() => UploadDragAreaComponent)}
    ]
})
export class UploadDragAreaComponent implements NodePermissionSubject { ... }
```
