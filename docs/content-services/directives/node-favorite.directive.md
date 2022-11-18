---
Title: Node Favorite directive
Added: v2.0.0
Status: Active
Last reviewed: 2018-11-13
---

# [Node Favorite directive](../../../lib/content-services/src/lib/directives/node-favorite.directive.ts "Defined in node-favorite.directive.ts")

Selectively toggles nodes as favorites.

## Basic Usage

```html
<adf-toolbar>
    <button mat-icon-button
            (toggle)="done()"
            [adf-node-favorite]="documentList.selection">
    </button>
</adf-toolbar>

<adf-document-list #documentList ...>
 ...
</adf-document-list>
```

```ts
@Component({
    selector: 'my-component'
})
export class MyComponent {

    done() {
        // ...
    }

}
```

## Class members

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| selection | [`NodeEntry`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/NodeEntry.md)`[]` | \[] | Array of nodes to toggle as favorites. |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| error | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<any>` | Emitted when the favorite setting fails. |
| toggle | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<any>` | Emitted when the favorite setting is complete. |

## Details

You can bind the directive instance to a template variable through the **adfFavorite** reference,
which also lets you add extra styling to the element:

<!-- {% raw %} -->

```html
<button
    mat-menu-item
    #selection="adfFavorite"
    [ngClass]="{ 'icon-highlight': selection.hasFavorites() }"
    [adf-node-favorite]="documentList.selection">
    <mat-icon [ngClass]="{ 'icon-highlight': selection.hasFavorites() }">
        {{ selection.hasFavorites() ? 'star' : 'star_border' }}
    </mat-icon>
</button>
```

<!-- {% endraw %} -->

The directive behaves as follows:

-   If there are no favorite nodes in the selection, then all are marked as favorites
-   If there are one or more favorite nodes in the selection, then only those that are not
    favorites are marked
-   If all nodes in the selection are favorites, then they all have their favorite status removed

See the **Demo Shell** for examples of usage.
