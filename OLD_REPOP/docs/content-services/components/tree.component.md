---
Title: Tree component
Added: v6.0.0.0
Status: Active
Last reviewed: 2023-01-25
---

# [Tree component](../../../lib/content-services/src/lib/tree/components/tree.component.ts "Defined in tree.component.ts")

Shows the nodes in tree structure, each node containing children is collapsible/expandable. Can be integrated with any datasource extending [Tree service](../../../lib/content-services//src/lib/tree/services/tree.service.ts). 

![Tree component screenshot](../../docassets/images/tree.png)

## Basic Usage

```html
<adf-tree
    [displayName]="'Tree display name'"
    [loadMoreSuffix]="'subnodes'"
    [emptyContentTemplate]="emptyContentTemplate"
    [nodeActionsMenuTemplate]="nodeActionsMenuTemplate"
    (paginationChanged)="onPaginationChanged($event)">
</adf-tree>
```

## Class members

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| collapseIcon | `string` | "expand_more" | Icon shown when node is expanded. By default set to expand_more |
| displayName | `string` |  | Tree display name |
| emptyContentTemplate | [`TemplateRef`](https://angular.io/api/core/TemplateRef)`<any>` |  | [TemplateRef](https://angular.io/api/core/TemplateRef) to provide empty template when no nodes are loaded |
| expandIcon | `string` | "chevron_right" | Icon shown when node has children and is collapsed. By default set to chevron_right |
| loadMoreSuffix | `string` |  | Load more suffix for load more button |
| nodeActionsMenuTemplate | [`TemplateRef`](https://angular.io/api/core/TemplateRef)`<any>` |  | [TemplateRef](https://angular.io/api/core/TemplateRef) to provide context menu items for context menu displayed on each row |
| selectableNodes | `boolean` | false | Variable defining if tree nodes should be selectable. By default set to false |
| stickyHeader | `boolean` | false | Variable defining if tree header should be sticky. By default set to false |
| contextMenuOptions | `any[]` |  | Array of context menu options which should be displayed for each row. |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| contextMenuOptionSelected | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<`[`TreeContextMenuResult`](../../../lib/content-services/src/lib/tree/models/tree-context-menu-result.interface.ts)`<>>` | Emitted when any context menu option is selected |
| paginationChanged | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<`[`PaginationModel`](../../../lib/core/src/lib/models/pagination.model.ts)`>` | Emitted when pagination has been changed |

## Details

### Defining your own custom datasource

First of all create custom node interface extending [`TreeNode`](../../../lib/content-services/src/lib/tree/models/tree-node.interface.ts) interface or use [`TreeNode`](../../../lib/content-services/src/lib/tree/models/tree-node.interface.ts) when none extra properties are required.

```ts
export interface CustomNode extends TreeNode
```

Next create custom datasource service extending [`TreeService`](../../../lib/content-services/src/lib/tree/services/tree.service.ts). Datasource service must implement `getSubNodes` method. It has to be able to provide both root level nodes as well as subnodes. If there are more subnodes to load for a given node it should add node with `LoadMoreNode` node type. Example of custom datasource service can be found in [`Category tree datasource service`](../services/category-tree-datasource.service.md).

```ts
@Injectable({...})
export class CustomTreeDatasourceService extends TreeService<TreeNode> {
    ...
    public getSubNodes(parentNodeId: string, skipCount?: number, maxItems?: number): Observable<TreeResponse<TreeNode>> {
        ...
}
```

Final step is to provide your custom datasource service as [tree service](../../../lib/content-services/src/lib/tree/services/tree.service.ts) in component using [`TreeComponent`](../../content-services/components/tree.component.md).

```ts
providers: [
    {
        provide: TreeService,
        useClass: CustomTreeDatasourceService,
    },
]
```

### Enabling nodes selection and listening to selection changes

First step is to provide necessary input value.

```html
<adf-tree
    [displayName]="'Tree display name'"
    [loadMoreSuffix]="'subnodes'"
    [selectableNodes]="true"
    [emptyContentTemplate]="emptyContentTemplate"
    [nodeActionsMenuTemplate]="nodeActionsMenuTemplate"
    (paginationChanged)="onPaginationChanged($event)">
</adf-tree>
```

Next inside your component get the [`TreeComponent`](../../content-services/components/tree.component.md)

```ts
@ViewChild(TreeComponent)
public treeComponent: TreeComponent<TreeNode>;
```

and listen to selection changes.

```ts
this.treeComponent.treeNodesSelection.changed.subscribe(
    (selectionChange: SelectionChange<TreeNode>) => {
        this.onTreeSelectionChange(selectionChange);
    }
);
```
