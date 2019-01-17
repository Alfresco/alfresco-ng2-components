---
Title: Angular Material Design
---

# Angular Material Design

This page describes the Angular Material Design library and how it is used in ADF.
 
Google's
[Material Design](https://material.io/guidelines/material-design/introduction.html)
is an example of a _design language_, a
general set of principles and ideas that are used to give designs a
consistent look and feel. A design language might be used in-house by
a company to maintain a "family resemblance" between its products or to
produce user-friendly signage. Material Design is Google's approach to
keeping user interfaces consistent between apps, using insights from
product design and cognitive psychology.

[Angular Material](https://material.angular.io/) is a set of components,
styles and other GUI elements
that follow the Material Design guidelines. ADF uses Angular Material
to implement its components but you can also use it directly when
creating your own components or modifying the ones provided by ADF.

## Themes

Material Design doesn't enforce one single color scheme but it does
specify a number of **themes**. A theme is a set of colors in various
shades, each of which lends itself to a particular task in the GUI.
For example, using the suggested shades for status bars, backgrounds
and shadows helps to give the correct emphasis to these elements and
ensure they look familiar to the user. The Material Design 
[themes documentation](https://material.io/guidelines/style/color.html#color-themes)
has more information as well as color swatches and other resources.

An advantage of using themes is that one theme can easily be replaced
by another - the CSS styling is designed so that a given class name in one theme plays
an equivalent role in all other themes. See the [Theming](theming.md) page
for details of how to apply an off-the-shelf theme to your ADF app or to
create your own theme.

## Components

Angular Material implements a variety of GUI components. These include
controls like radio buttons and checkboxes but also structures for layout
(lists, grids, etc) and navigation (toolbars, sidebars, menus). See the
[components section](https://material.angular.io/components/categories) of
the Angular Material docs for more information.

## Icons

Material Design has extensive
[guidelines](https://material.io/guidelines/style/icons.html) for the design
of icons. These images serve as visual indicators for GUI functions and data
elements (eg, a small graphic of a person could denote a user). A selection of
standard icons is also available for common items. For example, a microphone
icon indicates audio input while a magnifying glass emphasizes a search box.
See the Material Design
[system icon docs](https://material.io/guidelines/style/icons.html#icons-system-icons)
for further information and to download the set of standard icon images.

## See also

-   [Theming](theming.md)
