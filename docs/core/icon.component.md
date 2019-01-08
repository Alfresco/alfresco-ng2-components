# [Icon Component](../../lib/core/icon/icon.component.ts "Defined in icon.component.ts")

Provides universal way of rendering registered and named icons.

## Contents

-   [Basic usage](#basic-usage)
-   [Class members](#class-members)
    -   [Properties](#properties)
-   [Named icons](#named-icons)

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
| value | `string` |  | Icon value, can be either ligature name or custom icon in the format `[namespace]:[name]` |

## Named icons

You can register custom SVG files as named icons in the format `[namespace]:[name]`.

Example below shows how to register a new icon named `adf:move_file`
that points to an external file within the `assets` folder.

```ts
import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
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

In the HTML you can now use it like in the following snippet:

```html
<adf-icon value="adf:move_file"></adf-icon>
```

## Thumbnail Service

You can also use icons registered with the ADF [ThumbnailService](thumbnail.service.md)

```html
<adf-icon value="image/gif"></adf-icon>
```
