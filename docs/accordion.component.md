# Accordion Component

Creates an accordion menu, optionally with a custom header and icon.

<!-- markdown-toc start - Don't edit this section.  npm run toc to generate it-->

<!-- toc -->

<!-- tocstop -->

<!-- markdown-toc end -->

## Basic Usage

```html
<adf-accordion>
    <adf-accordion-group [heading]="titleHeading" [isSelected]="true" [headingIcon]="'assignment'">
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
| heading | string | The header title. |
| isSelected | boolean | Define if the accordion group is selected or not. |
| headingIcon | string | The material design icon. |
| hasAccordionIcon | boolean | Define if the accordion (expand) icon needs to be shown or not, the default value is true |
