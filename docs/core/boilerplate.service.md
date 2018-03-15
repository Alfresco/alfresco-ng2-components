# Boilerplate service

Shows how to write a Markdown file for a service.

## Methods

`someMethod(value: string = '')`<br/>
Shows how to document a method.

`anotherMethod(value: string = '')`<br/>
Shows how to document a method.

## Properties

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| prop1 | string | 'hello' | Many services don't need a properties table. Delete this section if you don't need it. |
| prop2 | boolean | true | Prop tables should have name, type, default and description, in that order. Leave default blank if appropriate. |

## Details

**Note: This is not a real component!**

Copy the contents of this file when you create a new service doc and edit or remove bits of it
as necessary. Usually, the title should be derived from the Angular name with the kebab-case expanded
(so "page-title.service" becomes "Page Title service") but there is no need to stick to this
if it looks wrong to you.

The main difference between service and component docs is that services usually have methods. Replace
the method signature and description with your own text but keep the &lt;br&gt; at the end of the
signature line.

### Subsection

You don't need to make subsections in the Details part but add them if they help with the
explanation. Add them as level 3 headings in the Details part only - to keep the consistency
of the docs, you shouldn't normally add any new level 1 or 2 sections to the Markdown.

<!-- Don't edit the See also section. Edit seeAlsoGraph.json and run config/generateSeeAlso.js -->
<!-- seealso start -->

<!-- seealso end -->