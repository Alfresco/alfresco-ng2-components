# Form Rendering service

Maps an APS form field type string onto the corresponding form widget component type.

## Methods

`getComponentTypeResolver(fieldType: string, defaultValue: Type<{}> = UnknownWidgetComponent): ComponentTypeResolver`<br/>
Gets the currently active ComponentTypeResolver function for a field type.

`setComponentTypeResolver(fieldType: string, resolver: ComponentTypeResolver, override: boolean = false)`<br/>
Sets or optionally replaces a ComponentTypeResolver function for a field type.

`resolveComponentType(field: FormFieldModel, defaultValue: Type<{}> = UnknownWidgetComponent): Type<{}>`<br/>
Finds the component type that is needed to render a form field.

## Details

The Form Field component uses this service to choose which widget to use to render an instance of a
form field. The Form Field model stores the field type name as a string (see the table below).
The Form Rendering service maintains a mapping between each type name and
a corresponding ComponentTypeResolver function. The function takes a FormFieldModel object as its argument and
uses the data from the object to determine which widget should be used to render the field.

In some cases, the field type string alone is enough to determine the widget type and so the function
just returns the type directly:

```ts
let customResolver: ComponentTypeResolver = () => CustomWidgetComponent;
formRenderingService.setComponentTypeResolver('text', customResolver, true);
```

In other cases, the function may need to choose the widget dynamically based on
specific values in the form data:

```ts
let customResolver: ComponentTypeResolver = (field: FormFieldModel): Type<{}> => {
    if (field) {
        let params = field.params;
    }
    return UnknownWidgetComponent;
};
formRenderingService.setComponentTypeResolver('text', customResolver, true);
```

### Default type mapping

The Form Rendering service is initialized with the mapping shown in the table below:

| Stencil name | Field type string | Component type |
|---|---|---|
| Amount | "amount" | AmountWidgetComponent |
| Attach | "upload" | AttachWidgetComponent or UploadWidgetComponent (based on metadata) |
| Checkbox | "boolean" | CheckboxWidgetComponent |
| Date | "date" | DateWidgetComponent |
| Display text | "readonly-text" | DisplayTextWidgetComponentComponent |
| Display value | "readonly" | DisplayValueWidgetComponent |
| Dropdown | "dropdown" | DropdownWidgetComponent |
| Dynamic table | "dynamic-table" | DynamicTableWidgetComponent |
| Group of people | "functional-group" | FunctionalGroupWidgetComponent |
| Header | "group" | ContainerWidgetComponent |
| Hyperlink | "hyperlink" | HyperlinkWidgetComponent |
| Multi-line text | "multi-line-text" | MultilineTextWidgetComponentComponent |
| Number | "integer" | NumberWidgetComponent |
| People | "people" | PeopleWidgetComponent |
| Radio buttons | "radio-buttons" | RadioButtonsWidgetComponent |
| Text | "text" | TextWidgetComponent |
| Typeahead | "typeahead" | TypeaheadWidgetComponent |

You can add new items to the mapping or replace existing items in order to customize the way
fields are rendered.

### Adding new or replacement items to the mapping

You can use the `setComponentTypeResolver` method to add a new ComponentTypeResolver function for a
particular type string. You can also replace the resolver for a type that already exists in the mapping
if you set the `override` parameter to 'true':

```ts
formRenderingService.setComponentTypeResolver('text', newResolver, true);
```

You would typically use this to replace an existing widget with your own custom version that
implements a modified layout or responds differently when the data is entered. See the
[Form Extensibility and Customisation](extensibility.md) guide for further details and examples
of this technique.

<!-- Don't edit the See also section. Edit seeAlsoGraph.json and run config/generateSeeAlso.js -->
<!-- seealso start -->
## See also

- [Form component](form.component.md)
- [Extensibility](extensibility.md)
<!-- seealso end -->



