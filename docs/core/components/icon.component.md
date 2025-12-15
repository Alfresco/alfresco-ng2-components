---
Title: Icon Component
Added: v3.0.0
Status: Active
Last reviewed: 2025-12-11
---

# [Icon Component](../../../lib/core/src/lib/icon/icon.component.ts "Defined in icon.component.ts")

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
| ---- | ---- | ------------- | ----------- |
| color | [`ThemePalette`](https://github.com/angular/components/blob/master/src/material/core/common-behaviors/color.ts) |  | Theme color palette for the component. |
| fontSet | `string` | | Icon font set. |
| value | `string` |  | Icon value, which can be either a ligature name or a custom icon in the format `[namespace]:[name]`. |
| isSvg | `boolean` | false | Is icon of type svg. |

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

### Icon alias mapping

The Icon Alias Mapping feature allows you to provide custom icon value mappings at runtime using the `ICON_ALIAS_MAP_TOKEN` injection token. When an icon value matches a key in the alias map, the component automatically replaces it with the mapped value. This is useful for creating consistent icon conventions across your application without modifying component code.

**Example alias map:**

```ts
import { ICON_ALIAS_MAP_TOKEN } from '@alfresco/adf-core';

function getProviders() {
    return [
        {
            provide: ICON_ALIAS_MAP_TOKEN,
            useValue: {
                'icon-mock': 'alias-mock',
                'old-icon': 'new-icon'
            }
        }
    ]
}
```

**Usage in your template:**

```html
<adf-icon value="icon-mock"></adf-icon>
```

The component will replace `icon-mock` with `alias-mock`. If the icon value doesn't match any key in the alias map, the original value is used.

## See also

-   [Thumbnail service](../services/thumbnail.service.md)
