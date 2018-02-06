# Theming an ADF app

The [Material Design](https://material.io/guidelines/material-design/introduction.html)
language doesn't specify a single color scheme. Instead it uses the concept
of color **themes** to allow designers some flexibility in their choice of colors.

A theme is a palette based around two main colors: the **primary** color (used widely
throughout the app) and the **accent** color (used mainly for highlighting and calling
out specific UI elements). Each of these colors is defined in a number of shades. For
example, a blue/orange theme could define shades like the following:

![Theme swatches](docassets/images/ThemeSwatches.png)

Each shade is related to a particular purpose or set of purposes within the app. So for
example, the shade that works best for text isn't necessarily the same shade you would use
for flat areas of color. Material Design provides a number of
[standard themes](https://material.io/guidelines/style/color.html#color-themes)
with shades that are carefully chosen for each purpose within the UI. The CSS files are
designed so that the names are consistent between themes (so the same "purpose" will always
have the same class name across CSS files). This makes it easy to switch themes simply by
changing a few CSS definitions. Material Design also defines the relationship between
the different shades, so you can calculate your own color values or, more straightforwardly, use
an [online palette design tool](http://mcg.mbitson.com/).

See the [Material Design Style page](https://material.io/guidelines/style/color.html#) for
more information about color concepts.

## Using a pre-built theme

ADF supplies several
[pre-built theme files](https://github.com/Alfresco/alfresco-ng2-components/tree/master/lib/core/styles/prebuilt)
that you can use in your app very easily.

If you have built the app using the
[ADF Yeoman Generator](https://github.com/alfresco/generator-ng2-alfresco-app) then you can
change the main theme file imported into the `src/custom-style.scss` file:

```css
@import '~@alfresco/adf-core/prebuilt-themes/adf-green-purple.css';
```

For example, you could change `adf-green-purple.css` to `adf-indigo-pink.css`, etc. You also
need to comment out the color definitions below to prevent them from overriding the
main theme from the imported file:

```css
@import '~@alfresco/adf-core/prebuilt-themes/adf-indigo-pink.css';

...

@include mat-core($alfresco-typography);

/* This section commented out.

$primary: mat-palette($alfresco-accent-orange);
$accent:  mat-palette($alfresco-accent-purple);
$warn:    mat-palette($alfresco-warn);
$theme:   mat-light-theme($primary, $accent, $warn);


@include angular-material-theme($theme);
@include adf-content-services-theme($theme);
@include adf-core-theme($theme);

*/

body, html {
    margin: 0;
    height: 100%;
    ...
```

With these modifications, you should see the theme change in your app when it reloads.

If you have used [Angular CLI](https://cli.angular.io/) to generate your app then you
can add a prebuilt theme to the `src/styles.scss` file:

```css
@import '~@alfresco/adf-core/prebuilt-themes/adf-indigo-pink.css';
```

Alternatively, you can reference the file directly in `src/index.html`:

```html
<link href="node_modules/ng2-alfresco-core/prebuilt-themes/adf-indigo-pink.css" rel="stylesheet">
```

## Custom themes

If you open the
[`lib/core/styles/_colors.scss`](https://github.com/Alfresco/alfresco-ng2-components/blob/development/lib/core/styles/_colors.scss)
file in the ADF sources, you will see a number of colors defined in different shades:

```css
...
$alfresco-accent-orange: (
    50: #fff3e0,
    100: #ffe0b2,
    200: #ffcc80,
    300: #ffb74d,
    400: #ffa726,
    ...
```

This is the standard Material Design palette system mentioned above. Looking back at the
commented-out section of `custom-styles.css`, you can see this color definition used as the
primary color for the theme. If you uncomment the section from this file, you can choose any
of the colors from `_colors.scss` as the primary (or the accent, etc):

```css
...
$primary: mat-palette($alfresco-accent-purple);
...
```

You can also paste your own color definitions into `custom-styles.css` and use them in a similar
way. For example, you might use a [Material Design palette generator](mcg.mbitson.com) to
produce the CSS for the following colors:

```css
...
$md-mycustomprimary: (
    50 : #e8eaf6,
    100 : #c5cae9,
    200 : #9fa8da,
    ...

$md-mycustomaccent: (
    50 : #fdf3e3,
    100 : #fbe1b8,
    200 : #f9ce89,
    ...
```

After pasting them into `custom-styles.scss`, you need to modify the following lines to refer
to them:

```css
...
$md-mycustomprimary: (
    ...
);

$md-mycustomaccent: (
    ...
);

$primary: mat-palette($md-mycustomprimary);
$accent:  mat-palette($md-mycustomaccent);
...
```

## Light and dark themes

Material Design's color system allows for light and dark themes from the
same basic set of colors (see the
[Android developer docs](https://developer.android.com/training/material/theme.html)
for an example). You might use this idea simply to give the user a choice of display
preference or to distinguish between states or settings of an app (eg, a calendar app
might use the dark theme at night and the light theme during the day).

In the default `custom-style.css`, the following definition is used for `$theme`:

```css
...
$theme:   mat-light-theme($primary, $accent, $warn);
...
```

However, you can also declare a `$dark-theme` and a corresponding CSS class:

```css
...
$theme:   mat-light-theme($primary, $accent, $warn);
$dark-theme:   mat-dark-theme($primary, $accent, $warn);

@include adf-core-theme($theme);
// Other includes as in the default custom-style.css.
...

.adf-dark-theme {
    @include adf-core-theme($dark-theme);
    // Other includes as in the default custom-style.css but with
    // "$dark-theme" in place of "$theme".
    ...
}
```

By default, components will use the light theme but you can apply the dark theme
to a component using the `.adf-dark-theme` class name defined above.


## Default CSS classes

Use the following CSS class names in your HTML to refer to colors from the theme:

```
.adf-hide-small              // Display none viewport <960px
.adf-hide-xsmall             // Display none viewport <600px

.adf-primary-color           // Primary color
.accent-color                // Accent color
.warn-color                  // Warn color
.primary-contrast-text-color // Default contrast color for primary color
.accent-contrast-text-color  // Default contrast color for accent color
.background-color            // Dialog background color
.primary-background-color    // Primary background color
.accent-background-color     // Default background color for accent
```
