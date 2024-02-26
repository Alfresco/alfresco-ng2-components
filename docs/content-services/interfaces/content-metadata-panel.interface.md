---
Title: Content Metadata Panel interface
Added: v6.7.0
Status: Active
Last reviewed: 2024-02-22
---

# [Content Metadata Panel interface](../../../lib/content-services/src/lib/content-metadata/interfaces/content-metadata-panel.interface.ts "Defined in content-metadata-panel.interface.ts")

Specifies required properties for metadata panel to be displayed in [ContentMetadataCardComponent](../components/content-metadata-card.component.md).

## Basic usage

```ts
export interface ContentMetadataPanel {
    panelTitle: string;
    expanded?: boolean;
}
```

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| panelTitle | `string` |  | Title for the panel the will be displayed in expansion panel header. |
| expanded | `boolean` |  | Specifies if given panel is expanded. |

## See also

-   [ContentMetadataCardComponent](../components/content-metadata-card.component.md)
-   [Dynamic Component](../../extensions/components/dynamic.component.md)
-   [Content Metadata Custom panel interface](./content-metadata-custom-panel.interface.md)
