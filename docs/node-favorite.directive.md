# Node Favorite directive

Selectively toggles nodes as favorite

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

### Properties

| Name              | Type                | Default | Description                 |
| ----------------- | ------------------- | ------- | --------------------------- |
| adf-node-favorite | MinimalNodeEntity[] | []      | Nodes to toggle as favorite |

### Events

| Name                      | Description                                  |
| ------------------------- | -------------------------------------------- |
| toggle                    | emitted when toggle favorite process is done |

## Details

The `NodeFavoriteDirective` instance can be bound to a template variable through **adfFavorite** reference,
which provides a method to help further style the element.

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

The directive performs as follows:

- if there are no favorite nodes in the selection, then all are marked as favorites
- if there is at least one favorite node in the selection, then only those who are not
  are being marked
- if all nodes in the selection are favorites, then they are removed from favorites


See **Demo Shell**
