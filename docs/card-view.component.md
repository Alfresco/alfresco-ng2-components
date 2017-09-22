# Card View component

Displays a configurable property list renderer.

![adf-custom-view](docassets/images/adf-custom-view.png)

<!-- markdown-toc start - Don't edit this section.  npm run toc to generate it-->

<!-- toc -->

- [Basic Usage](#basic-usage)
  * [Properties](#properties)
- [Details](#details)
  * [Editing](#editing)
  * [Defining properties](#defining-properties)
    + [Card Text Item](#card-text-item)
    + [Card Map Item](#card-map-item)
    + [Card Date Item](#card-date-item)
  * [Defining your custom card Item](#defining-your-custom-card-item)
    + [1. Define the model for the custom type](#1-define-the-model-for-the-custom-type)
    + [2. Define the component for the custom type](#2-define-the-component-for-the-custom-type)
    + [3. Add you custom component to your module's entryComponents list](#3-add-you-custom-component-to-your-modules-entrycomponents-list)

<!-- tocstop -->

<!-- markdown-toc end -->

## Basic Usage

```html
<adf-card-view
    [properties]="[{label: 'My Label', value: 'My value'}]"
    [editable]="false">
</adf-card-view>

```

### Properties

| Name | Type | Description |
| --- | --- | --- |
| properties | [CardViewItem](#cardviewitem)[] | (**required**) The custom view to render |
| editable | boolean | If the component editable or not |

## Details

You define the property list, the CardViewComponent does the rest. Each property represents a card view item (a row) in the card view component. At the time of writing two different kind of card view item (property type) is supported out of the box ([text](#card-text-item) item and [date](#card-date-item) item) but you can define your own custom types as well.

### Editing

The card view can optionally allow its properties to be edited. You can control the editing of the properties in two level.
- **global level** - *via the editable parameter of the card-view.component*
- **property level** -  *in each property via the editable attribute*

If you set the global editable parameter to false, no properties can be edited regardless of what is set inside the property.

### Defining properties

Properties is an array of models which one by one implements the CardViewItem interface.

```js
export interface CardViewItem {
    label: string;
    value: any;
    key: string;
    default?: any;
    type: string;
    displayValue: string;
    editable?: boolean;
}
```

At the moment three models are defined out of the box:

- **CardViewTextItemModel** - *for text items*
- **CardViewMapItemModel** - *for map items*
- **CardViewDateItemModel** - *for date items*

Each of them extends the abstract CardViewBaseItemModel class to add some custom functionality to the basic behaviour.

```js
 this.properties = [
    new CardViewTextItemModel({
        label: 'Name',
        value: 'Spock',
        key: 'name',
        default: 'default bar' ,
        multiline: false
    }),
    new CardViewMapItemModel({
        label: 'My map',
        value: new Map([['999', 'My Value']]),
        key: 'map',
        default: 'default map value' ,
        clickable: true
    }),
    new CardViewDateItemModel({
        label: 'Birth of date',
        value: someDate,
        key: 'birth-of-date',
        default: new Date(),
        format: '<any format that momentjs accepts>',
        editable: true
    }),
    ...
]
```

#### Card Text Item

CardViewTextItemModel is a property type for text properties.

```js
const textItemProperty = new CardViewTextItemModel(options);
```

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| label* | string | --- | The label to render |
| value* | any | --- | The original value |
| key* | string | --- | the key of the property. Have an important role when editing the property. |
| default | any | --- | The default value to render in case the value is empty |
| displayValue* | string | --- | The value to render |
| editable | boolean | false | Whether the property editable or not |
| clickable | boolean | false | Whether the property clickable or not |
| multiline | string | false | Single or multiline text |

#### Card Map Item

CardViewMapItemModel is a property type for map properties.

```js
const mapItemProperty = new CardViewMapItemModel(options);
```

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| label* | string | --- | The label to render |
| value* | Map | --- | A map that contains the key value pairs |
| key* | string | --- | the key of the property. Have an important role when editing the property. |
| default | any | --- | The default value to render in case the value is empty |
| displayValue* | string | --- | The value to render |
| clickable | boolean | false | Whether the property clickable or not |

#### Card Date Item

CardViewDateItemModel is a property type for date properties.

```js
const dateItemProperty = new CardViewDateItemModel(options);
```

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| label* | string | --- | The label to render |
| value* | any | --- | The original value |
| key* | string | --- | the key of the property. Have an important role when editing the property. |
| default | any | --- | The default value to render in case the value is empty |
| displayValue* | string | --- | The value to render |
| editable | boolean | false | Whether the property editable or not |
| format | boolean | "MMM DD YYYY" | any format that momentjs accepts |

### Defining your custom card Item

Card item components are loaded dynamically, which makes you able to define your own custom component for the custom card item type.

Let's consider you want to have a **stardate** type to display Captain Picard's birthday (47457.1). For this, you need to do the following steps.

#### 1. Define the model for the custom type

Your model has to extend the CardViewBaseItemModel and implement the CardViewItem interface.
*(You can check how the CardViewTextItemModel is implemented for further guidance.)*

```js
export class CardViewStarDateItemModel extends CardViewBaseItemModel implements CardViewItem {
    type: string = 'star-date';

    get displayValue() {
        return this.convertToStarDate(this.value) || this.default;
    }

    private convertToStarDate(starTimeStamp: number): string {
        // Do the magic
    }
}
```

The most important part of this model is the value of the **type** attribute. This is how the Card View component will be able to recognise which component is needed to render it dynamically.

The type is a **hyphen-separated-lowercase-words** string (just like how I wrote it). This will be converted to a PascalCase (or UpperCamelCase) string to find the right component. In our case the Card View component will look for the CardView**StarDate**ItemComponent.

#### 2. Define the component for the custom type

As discussed in the previous step the only important thing here is the naming of your component class ( **CardViewStarDateItemComponent**). Since the selector is not used in this case, you can give any selector name to it, but it makes sense to follow the angular standards.

```js
@Component({
    selector: 'card-view-stardateitem' // For example
    ...
})
export class CardViewStarDateItemComponent {
    @Input()
    property: CardViewStarDateItemModel;

    @Input()
    editable: boolean;

    constructor(private cardViewUpdateService: CardViewUpdateService) {}

    isEditble() {
        return this.editable && this.property.editable;
    }

    showStarDatePicker() {
        ...
    }
}

```
To make your component editable, you can have a look on either the CardViewTextItemComponent' or on the CardViewDateItemComponent's source.

#### 3. Add you custom component to your module's entryComponents list

For Angular to be able to load your custom component dynamically, you have to register your component in your modules entryComponents.

```js
@NgModule({
    imports: [...],
    declarations: [
        CardViewStarDateItemComponent
    ],
    entryComponents: [
        CardViewStarDateItemComponent
    ],
    exports: [...]
})
export class MyModule {}
```
