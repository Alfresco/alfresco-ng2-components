# Sites Dropdown component

Displays a dropdown menu to show and interact with the sites of the current user.

![Dropdown sites](docassets/images/document-list-dropdown-list.png)

<!-- markdown-toc start - Don't edit this section.  npm run toc to generate it-->

<!-- toc -->

- [Basic Usage](#basic-usage)
  * [Events](#events)

<!-- tocstop -->

<!-- markdown-toc end -->

## Basic Usage

```html
 <adf-sites-dropdown
  (change)="getSiteContent($event)">
 </adf-sites-dropdown>
```

### Events

| Name | Returned Type | Description |
| --- | --- | --- |
| change | [SiteModel](https://github.com/Alfresco/alfresco-ng2-components/blob/master/ng2-components/ng2-alfresco-core/src/models/site.model.ts) | emitted when user selects a site. When default option is selected an empty model is emitted  |
