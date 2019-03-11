---
Title: Dynamic Component
Added: v3.0.0
Status: Experimental
Last reviewed: 2018-12-17
---

# [Dynamic Component](../../../lib/extensions/src/lib/components/dynamic-component/dynamic.component.ts "Defined in dynamic.component.ts")

Displays dynamically-loaded extension components.

## Class members

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| data | `any` |  | Data for the dynamically-loaded component instance. |
| id | `string` |  | Unique ID string for the component to show. |

## Details

Use the Dynamic component to create extensible apps
(ie, apps that provide a generalized UI structure where the specific content
can be "plugged in" by other developers). The `id` property refers to a
component that has previously been registered using the `setComponents` method
of the [Extension service](../services/extension.service.md):

```ts
// Registering the extension components.
extensionService.setComponents({
    'plugInName.components.docList': DocumentListComponent.
    'plugInName.components.login': LoginComponent,
    ... 
});
```

```html
<!-- Using the component pre-registered with the key 'plugInName.components.login' -->
<adf-dynamic-component
    id="'plugInName.components.login'"
    data="{ ... }"
>
</adf-dynamic-component>
```

Use this to provide the extension developer with a standard layout that
contains placeholders defined by instances of the Dynamic component. The
developer can then register any desired components to correspond to the
defined component IDs. For example, the extensible app might be shipped
with the standard [Document List component](../../content-services/components/document-list.component.md) registered against `plugInName.components.docList`.
The extension developer can replace this with a custom class
simply by registering that class with `setComponents` before use.

## See also

-   [Extension service](../services/extension.service.md)
