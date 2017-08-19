# Theming your Alfresco ADF app

### Using a pre-built theme
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

If you're using Angular CLI you can include one of the prebuilt theme in yours `styles.css` file:
```css
@import 'ng2-alfresco-core/prebuilt-themes/adf-blue-orange.css';
```
Or you can add it directly in your index.html

```html
<link href="node_modules/ng2-alfresco-core/prebuilt-themes/adf-blue-orange.css" rel="stylesheet">
```

### Defining a custom theme

When you want more customization than a pre-built theme offers, you can create your own theme file.

```scss
@import '~@angular/material/theming';
@import 'colors';
@import 'all-theme';

@include mat-core();

$primary: mat-palette($alfresco-accent-orange);
$accent:  mat-palette($alfresco-accent-purple);
$warn:    mat-palette($alfresco-warn);
$theme:   mat-light-theme($primary, $accent, $warn);
//or $theme: mat-dark-theme($primary, $accent, $warn); for dark theme

@include angular-material-theme($theme);
@include alfresco-material-theme($theme);
```

Notes: if you are using the Generator or the demo shell you need only to change the`/app/theme.scss` with your set of colors

#### Multiple themes
You can create multiple themes for your application:

##### Example of defining multiple themes:

```scss
@import '~@angular/material/theming';
@import 'colors';
@import 'all-theme';

@include mat-core();

$primary: mat-palette($alfresco-accent-orange);
$accent:  mat-palette($alfresco-accent-purple);
$warn:    mat-palette($alfresco-warn);

$theme:   mat-light-theme($primary, $accent, $warn);
$dark-theme:   mat-dark-theme($primary, $accent, $warn);

@include angular-material-theme($theme);
@include alfresco-material-theme($theme);

.adf-dark-theme {
  @include angular-material-theme($dark-theme);
  @include alfresco-material-theme($dark-theme);
}
```
Any component with the  `add-dark-theme` class will use the dark theme, while other components will fall back to the default.
