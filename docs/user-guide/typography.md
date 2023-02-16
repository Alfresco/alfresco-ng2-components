---
Title: Typography
Added: v2.0.0
---

# ADF Typography

Typography configuration lets you change the style of the text in your ADF app.

## Customization

To get started you need to include your custom font in the `/src/index.html` header:

```html
  <link href="https://fonts.googleapis.com/css?family=Muli" rel="stylesheet">
```
When adding custom typography, please be aware of angular material version
(there are two different versions of typography levels: 2014 and 2018). Current 
version is 14.
After you need to change your `/src/custom-style.scss` to include the new font:

```scss
/*
 *  Include only packages that you are using (and core by default)
 */
@use '@angular/material' as mat;
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
@import '~ng2-alfresco-upload/styles/index';
@import '~ng2-alfresco-userinfo/styles/index';

$custom-typography: mat.define-typography-config(
    $font-family: 'Muli, Roboto, "Helvetica Neue", sans-serif',
    $display-4:     mat.define-typography-level(112px, 112px, 300),
    $display-3:     mat.define-typography-level(56px, 56px, 400),
    $display-2:     mat.define-typography-level(45px, 48px, 400),
    $display-1:     mat.define-typography-level(34px, 40px, 400),
    $headline:      mat.define-typography-level(24px, 32px, 400),
    $title:         mat.define-typography-level(20px, 32px, 500),
    $subheading-2:  mat.define-typography-level(16px, 28px, 400),
    $subheading-1:  mat.define-typography-level(15px, 24px, 400),
    $body-2:        mat.define-typography-level(14px, 24px, 500),
    $body-1:        mat.define-typography-level(14px, 20px, 400),
    $caption:       mat.define-typography-level(12px, 20px, 400),
    $button:        mat.define-typography-level(14px, 14px, 500),
    $input:         mat.define-typography-level(16px, 1.25, 400)
);

@include mat.core();

$primary: mat.define-palette($alfresco-accent-orange);
$accent:  mat.define-palette($alfresco-accent-purple);
$warn:    mat.define-palette($alfresco-warn);
$theme:   mat.define-light-theme(
    (
        color: (
            primary: $primary,
            accent: $accent,
            warn: $warn,
        ),
        typography: $custom-typography
    )
);

@include angular-material-theme($theme);

@include alfresco-core-theme($theme);
@include adf-analytics-theme($theme);
@include adf-diagrams-theme($theme);
@include adf-form-theme($theme);
@include adf-processlist-theme($theme);
@include adf-tasklist-theme($theme);
@include alfresco-datatable-theme($theme);
@include alfresco-documentlist-theme($theme);
@include alfresco-login-theme($theme);
@include alfresco-upload-theme($theme);
@include alfresco-userinfo-theme($theme);

```

for more details about typography refer to [Material 2 documentation](https://github.com/angular/material2/blob/master/guides/typography.md)
