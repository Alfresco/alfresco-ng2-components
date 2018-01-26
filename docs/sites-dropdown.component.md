# Sites Dropdown component

Displays a dropdown menu to show and interact with the sites of the current user.

![Dropdown sites](docassets/images/document-list-dropdown-list.png)

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
| siteList | [SitePaging](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/SitePaging.md) | null | A custom list of sites to be displayed by the dropdown. If no value is given, the sites of the current user are displayed by default. A list of objects only with properties 'title' and 'guid' is enough to be able to display the dropdown. |
| placeholder | string  | 'DROPDOWN.PLACEHOLDER_LABEL' | The placeholder text/the key from translation files for the placeholder text to be shown by default|

### Events

| Name | Returned Type | Description |
| --- | --- | --- |
| change | [SiteModel](site.model.md) | emitted when user selects a site. When default option is selected an empty model is emitted  |
