# Sites Dropdown component

Displays a dropdown menu to show and interact with the sites of the current user.

![Dropdown sites](docassets/images/document-list-dropdown-list.png)

<!-- markdown-toc start - Don't edit this section.  npm run toc to generate it-->

<!-- toc -->

- [Basic Usage](#basic-usage)
  * [Properties](#properties)
  * [Events](#events)

<!-- tocstop -->

<!-- markdown-toc end -->

## Basic Usage

```html
 <adf-sites-dropdown
  (change)="getSiteContent($event)">
 </adf-sites-dropdown>
```

### Properties

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| hideMyFiles | boolean | false | Hide the "My Files" option added to the list by default |
| siteList | any[] | null | A custom list of sites to be displayed by the dropdown. If no value is given, the sites of the current user are displayed by default. A list of objects only with properties 'title' and 'guid' is enough to be able to display the dropdown. |

### Events

| Name | Returned Type | Description |
| --- | --- | --- |
| change | [SiteModel](https://github.com/Alfresco/alfresco-ng2-components/blob/master/ng2-components/ng2-alfresco-core/src/models/site.model.ts) | emitted when user selects a site. When default option is selected an empty model is emitted  |
