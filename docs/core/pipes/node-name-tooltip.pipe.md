---
Title: Node Name Tooltip pipe
Added: v2.0.0
Status: Active
---

# [Node Name Tooltip pipe](../../../lib/content-services/src/lib/pipes/node-name-tooltip.pipe.ts "Defined in node-name-tooltip.pipe.ts")

Formats the tooltip for a [`Node`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/Node.md).

## Basic Usage

<!-- {% raw %} -->

```html
<data-column
    key="name"
    title="APP.DOCUMENT_LIST.COLUMNS.NAME">
    <ng-template let-value="value" let-context>
        <span title="{{ context?.row?.obj | adfNodeNameTooltip }}">{{ value }}</span>
    </ng-template>
</data-column>
```

<!-- {% endraw %} -->

## Details

The tooltip is formatted according to the following rules:

-   if the _title_ and _description_ are missing, then the tooltip shows the _name_;
-   if the _title_ is missing, then the tooltip shows the _name_ and _description_;
-   if the _description_ is missing, then the tooltip shows the _name_ and _title_;
-   if _name_ and _title_, _name_ and _description_, or _title_ and _description_ are the same, then only a single line is displayed.
