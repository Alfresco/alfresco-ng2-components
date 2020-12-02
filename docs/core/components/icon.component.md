---
Title: Icon Component
Added: v3.0.0
Status: Active
Last reviewed: 2019-02-08
---

# [Icon Component](../../../lib/core/icon/icon.component.ts "Defined in icon.component.ts")

Provides a universal way of rendering registered and named icons.

## Basic usage

```html
<!-- Font ligature -->
<adf-icon value="alert"></adf-icon>

<!-- ADF Thumbnail Service -->
<adf-icon value="image/png"></adf-icon>

<!-- Custom icon from MatIconRegistry -->
<adf-icon value="my-company:my-icon"></adf-icon>
```

## Class members

### Properties

| Name | Type | Default value | Description |
| --- | --- | --- | --- |
| color | [`ThemePalette`](https://github.com/angular/components/blob/master/src/material/core/common-behaviors/color.ts) |  | Theme color palette for the component. |
| value | `string` |  | Icon value, which can be either a ligature name or a custom icon in the format `[namespace]:[name]`. |

## Details

You can register custom SVG files as named icons in the format `[namespace]:[name]`.

The example below shows how to register a new icon named `adf:move_file`
that points to an external file within the `assets` folder:

```ts
import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({...})
export class AppComponent implements OnInit {

    constructor(
        private matIconRegistry: MatIconRegistry,
        private sanitizer: DomSanitizer
    ) {}

    ngOnInit() {
        this.matIconRegistry.addSvgIconInNamespace(
            'adf',
            'move_file',
            this.sanitizer.bypassSecurityTrustResourceUrl(
                './assets/images/adf-move-file-24px.svg'
            )
        );
    }
}
```

In the HTML, you can now use the icon as shown below:

```html
<adf-icon value="adf:move_file"></adf-icon>
```

### Thumbnail Service

You can also reference the icons registered with the [Thumbnail Service](../services/thumbnail.service.md)
using the `adf:` namespace.

```html
<adf-icon value="adf:image/gif"></adf-icon>
```

## See also

*   [Thumbnail service](../services/thumbnail.service.md)
