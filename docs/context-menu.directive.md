# Context Menu directive

Adds a context menu to a component.

## Basic Usage

```html
<my-component [context-menu]="menuItems"></my-component>
<context-menu-holder></context-menu-holder>
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

### Properties

| Name | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| showIcons | boolean | false | Render defined icons |

## Details

See **Demo Shell** or **DocumentList** implementation for more details and use cases.
