# Activiti Content Component

The component shows the content preview.

<!-- markdown-toc start - Don't edit this section.  npm run toc to generate it-->

<!-- toc -->

- [Basic Usage](#basic-usage)
  * [Properties](#properties)
  * [Events](#events)

<!-- tocstop -->

<!-- markdown-toc end -->

## Basic Usage

```html
<adf-content
    [contentId]="'1001'">
</adf-content>
```

### Properties

The recommended set of properties can be found in the following table:

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| contentId | string |  | The content id to show. |

### Events

| Name | Description |
| --- | --- |
| contentClick | Invoked when the content is clicked. |