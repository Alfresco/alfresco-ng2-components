# Node Favorite directive

Selectively toggle nodes as favorite

<!-- markdown-toc start - Don't edit this section.  npm run toc to generate it-->

<!-- toc -->

- [Basic Usage](#basic-usage)
  * [Properties](#properties)
  * [Events](#events)
- [Details](#details)

<!-- tocstop -->

<!-- markdown-toc end -->

## Basic Usage

```html
<adf-toolbar>
    <button md-icon-button
            (adf-toggle-favorite)="done()"
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
| selection-toggle-favorite | emitted when toggle favorite process is done |

## Details

The `NodeFavoriteDirective` instance can be bound to a template variable through **adfFavorite** reference,
wich provides a method to help further style the element.

```html
<button
    md-menu-item
    #selection="adfFavorite"
    [ngClass]="{ 'icon-highlight': selection.hasFavorites() }"
    [adf-node-favorite]="documentList.selection">
    <md-icon [ngClass]="{ 'icon-highlight': selection.hasFavorites() }">
        {{ selection.hasFavorites() ? 'star' : 'star_border' }}
    </md-icon>
</button>
```

The directive performs as follows:

- if there are no favorite nodes in the selection, then all are marked as favorites
- if there is at least one favorite node in the selection, then only those who are not
  are being marked
- if all nodes in the selection are favorites, then they are removed from favorites


See **Demo Shell**
