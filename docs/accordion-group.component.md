# Accordion Group component

Adds a collapsible panel to an [accordion menu](accordion.component.md).

![Accordion menu screenshot](docassets/images/accordion-menu.png)

## Basic Usage

```html
<adf-accordion>
    <adf-accordion-group [heading]="titleHeading" [isSelected]="true" [headingIcon]="'assignment'" [headingIconTooltip]="'Group Tooltip'">
        <my-list></my-list>
    </adf-accordion-group>
</adf-accordion>
```

```ts
@Component({
    selector: 'my-component'
})
export class MyComponent implements OnInit {

    titleHeading: string;

    constructor() {
        this.titleHeading = 'My Group';
    }

}
```

### Properties

| Name | Type | Description |
| --- | --- | --- |
| heading | string | Title heading for the group. |
| isSelected | boolean | Is this group currently selected? |
| headingIcon | string | The material design icon. |
| hasAccordionIcon | boolean | Should the (expanded) accordion icon be shown? Defaults to true |
| headingIconTooltip | string | Tooltip message to be shown for headingIcon |

## Details

Place one or more accordion groups within an [Accordion component](accordion.component.md) to define a menu. 

<!-- Don't edit the See also section. Edit seeAlsoGraph.json and run config/generateSeeAlso.js -->
<!-- seealso start -->
## See also

- [Accordion component](accordion.component.md)
<!-- seealso end -->