# Theming your Alfresco ADF app

## Using a pre-built theme

Angular Material comes prepackaged with several pre-built theme css files. These theme files also
include all of the styles for core (styles common to all components), so you only have to include a
single css file for Angular Material in your app.

You can include a theme file directly into your application from
`ng2-alfresco-core/prebuilt-themes`

Available pre-built themes:
* `adf-blue-orange.css`
* `adf-blue-purple.css`
* `adf-cyan-orange.css`
* `adf-cyan-purple.css`
* `adf-green-orange.css`
* `adf-green-purple.css`
* `adf-indigo-pink.css`
* `adf-pink-bluegrey.css`
* `adf-purple-green.css`

If you're using Angular CLI you can include one of the prebuilt theme in yours `styles.scss` file:
```css
@import '~ng2-alfresco-core/prebuilt-themes/adf-blue-orange.css';
```
Or you can add it directly in your index.html

```html
<link href="node_modules/ng2-alfresco-core/prebuilt-themes/adf-blue-orange.css" rel="stylesheet">
```

## Defining a custom theme

When you want more customization than a pre-built theme offers, you can create your own theme file. You need to include the packages only what you really use in your application.

```scss
/*
 *  Include only packages what you are using (and core by default)
 */
@import '~@angular/material/theming';
@import '~ng2-alfresco-core/styles/theming';
@import '~ng2-alfresco-core/styles/index';
@import '~ng2-activiti-analytics/styles/index';
@import '~ng2-activiti-diagrams/styles/index';
@import '~ng2-activiti-form/styles/index';
@import '~ng2-activiti-processlist/styles/index';
@import '~ng2-activiti-tasklist/styles/index';
@import '~ng2-alfresco-datatable/styles/index';
@import '~ng2-alfresco-documentlist/styles/index';
@import '~ng2-alfresco-login/styles/index';
//@import '~ng2-alfresco-upload/styles/index';
//@import '~ng2-alfresco-userinfo/styles/index';

@include mat-core();

$primary: mat-palette($alfresco-accent-orange);
$accent:  mat-palette($alfresco-accent-purple);
$warn:    mat-palette($alfresco-warn);
$theme:   mat-light-theme($primary, $accent, $warn);

@include angular-material-theme($theme);

@include alfresco-core-theme($theme);
@include alfresco-activity-analytics-theme($theme);
@include alfresco-activity-diagrams-theme($theme);
@include alfresco-activity-form-theme($theme);
@include alfresco-activity-processlist-theme($theme);
@include alfresco-activity-tasklist-theme($theme);
@include alfresco-datatable-theme($theme);
@include alfresco-documentlist-theme($theme);
@include alfresco-login-theme($theme);
//@include alfresco-upload-theme($theme);
//@include alfresco-userinfo-theme($theme);

```

Notes: if you are using the Generator or the demo shell you need only to change the`/src/custom-style.scss` with your set of colors

### Multiple themes

You can create multiple themes for your application:

#### Example of defining multiple themes

```scss
@import '~@angular/material/theming';
@import '~ng2-alfresco-core/styles/theming';
@import '~ng2-alfresco-core/styles/index';
...

@include mat-core();

$primary: mat-palette($alfresco-accent-orange);
$accent:  mat-palette($alfresco-accent-purple);
$warn:    mat-palette($alfresco-warn);

$theme:   mat-light-theme($primary, $accent, $warn);
$dark-theme:   mat-dark-theme($primary, $accent, $warn);

@include alfresco-core-theme($theme);
...like above

.adf-dark-theme {
    @include alfresco-core-theme($dark-theme);
    ...like above
}
```
Any component with the  `add-dark-theme` class will use the dark theme, while other components will fall back to the default.


## Default reusable class

```css
.adf-hide-small                 // Display none vieweport <960px
.adf-hide-xsmall                // Display none vieweport <600px

.adf-primary-color               // Primary color
.accent-color                // Accent color
.warn-color                  // Warn color
.primary-contrast-text-color // Default contrast color for primary color
.accent-contrast-text-color  // Default contrast color for accent color
.background-color            // Dialog background color
.primary-background-color    // Primary background color
.accent-background-color     // Default background color for accent
```