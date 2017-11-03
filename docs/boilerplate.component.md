# Boilerplate component

Shows how to write a Markdown file for a component.

![Screenshot goes here if necessary](docassets/images/adf-toolbar-01.png)

<!-- Most doc files don't need a table of contents. Delete this part unless
you have added about five subsections in the Details part.
-->
<!-- markdown-toc start - Don't edit this section.  npm run toc to generate it-->

<!-- toc -->

<!-- tocstop -->

<!-- markdown-toc end -->

## Basic Usage
<!-- Delete any Basic Usage parts that you don't need (eg, some components don't
have any properties). -->

```html
<adf-document-list
    #documentList
    [currentFolderId]="'-my-'"
    [contextMenuActions]="true"
    [contentActions]="true">
</adf-document-list>
```

### Properties

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| prop1 | string | 'hello' | The property description in the table should be no more than a few sentences. Add extra description in the Details section if you need to. |
| prop2 | boolean | true | Prop tables should have name, type, default and description, in that order. Leave default value blank if appropriate. |

### Events

| Name | Description |
| --- | --- |
| someEvent | Keep description short for the table. Usually starts with "Emitted when..." |
| anotherEvent | Emitted when the user double-clicks a list node |

## Details

**Note: This is not a real component!**

Copy the contents of this file when you create a new component doc and edit or remove bits of it
as necessary. Usually, the title should be derived from the Angular name with the kebab-case expanded
(so "task-details.component" becomes "Task Details component") but there is no need to stick to this
if it looks wrong to you.

### Subsection

You don't need to make subsections in the Details part but add them if they help with the
explanation. Add them as level 3 headings in the Details part only - to keep the consistency
of the docs, you shouldn't normally add any new level 1 or 2 sections to the Markdown.

<!-- Don't edit the See also section. Edit seeAlsoGraph.json and run config/generateSeeAlso.js -->
<!-- seealso start -->

<!-- seealso end -->