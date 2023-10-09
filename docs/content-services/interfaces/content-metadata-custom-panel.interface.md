---
Title: Content Metadata Custom Panel interface
Added: v6.4.0
Status: Active
Last reviewed: 2023-10-06
---

# [Content Metadata Custom Panel interface](../../../lib/content-services/src/lib/content-metadata/interfaces/content-metadata-custom-panel.interface.ts "Defined in content-metadata-custom-panel.interface.ts")

Specifies required properties for custom metadata panel to be displayed in [ContentMetadataCardComponent](../components/content-metadata-card.component.md).

## Basic usage

```ts
export interface ContentMetadataCustomPanel {
    panelTitle: string;
    component: string;
}
```

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| panelTitle | `string` |  | Title for the panel the will be displayed in expansion panel header. |
| component | `string` |  | Id of the registered [Dynamic component](../../extensions/components/dynamic.component.md) to be displayed inside expansion panel. |

## See also

-   [ContentMetadataCardComponent](../components/content-metadata-card.component.md)
-   [Dynamic Component](../../extensions/components/dynamic.component.md)
