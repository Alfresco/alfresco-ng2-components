---
Title: Context Menu directive
Added: v2.0.0
Status: Active
Last reviewed: 2018-11-20
---

# [Context Menu directive](../../../lib/core/context-menu/context-menu.directive.ts "Defined in context-menu.directive.ts")

Adds a context menu to a component.

## Basic Usage

```html
<my-component [adf-context-menu]="menuItems"></my-component>
<adf-context-menu-holder></context-menu-holder>
```

```ts
@Component({
    selector: 'my-component'
})
export class MyComponent implements OnInit {

    menuItems: any[];

    constructor() {
        this.menuItems = [
            { title: 'Item 1', subject: new Subject() },
            { title: 'Item 2', subject: new Subject() },
            { title: 'Item 3', subject: new Subject() }
        ];
    }

    ngOnInit() {
        this.menuItems.forEach(l => l.subject.subscribe(item => this.commandCallback(item)));
    }

    commandCallback(item) {
        alert(`Executing ${item.title} command.`);
    }

}
```

## Class members

### Properties

| Name | Type | Default value | Description |
| --- | --- | --- | --- |
| enabled | `boolean` | false | Is the menu enabled? |
| links | `any[]` |  | Items for the menu. |

## Details

See the [Demo Shell](../../../demo-shell/README.md)
or [Document List component](../../content-services/components/document-list.component.md) implementation for more details and use cases.
