---
Title: Right-to-left language support
Added: 2019-03-13
---

# Right-to-left language support

ADF currently has partial support for languages that are written from right to left (such as Arabic) and has been tested to work with the HTML [`dir` attribute](https://www.w3.org/TR/html51/dom.html#the-dir-attribute) added to the main `<body>` element.

This is handled automatically by the framework and can be configured through `app.config.json`.

## Configuration

Since directionality cannot be inferred from information about the locale, there is a one-to-one relation between locale and language configuration in `app.config.json`.

The minimum configuration is to declare the `"direction": "rtl"` alt the level of the language entry associated with your browser locale. Omitting `direction` or failing to map it with a language key will default to `ltr`.

```json
// browser locale 'ar'

{
    ...
    "languages": [
        ...
        {
            "key": "ar",
            "direction": "rtl"
        },
        ...
    ],
    ...
}
```

If it is desired to start the application with a certain language locale and not default to browser locale, we can specify the `locale` at the configuration level and associate it with a language entry.

```json
{
    ...
    "locale": "ar",
    "languages": [
        ...
        {
            "key": "ar",
            "direction": "rtl"
        },
        ...
    ],
    ...
}
```

## UserPreferencesService

For cases where a component logic depends on direction values over time, [`UserPreferencesService`](../core/services/user-preferences.service.md) can be used to get information about the current direction value.

```typescript
import { Component, OnInit } from '@angular/core';
import { Direction } from '@angular/cdk/bidi';
import { UserPreferencesService } from '@alfresco/adf-core';

@Component({
    ...
})
export class MyComponent implements InInit {
    constructor( private userPreferencesService: UserPreferencesService) { }

    ngOnInit() {
        this.userPreferencesService
            .select('textOrientation')
            .subscribe((direction: Direction) => {
                console.log(direction); // 'ltr' / 'rtl'
            });
    }
}
```

## MatIcon

Currently, [mat-icon](https://material.angular.io/components/icon/overview) doesn't support [directionality](https://material.angular.io/components/icon/overview#bidirectionality) out of the box. As a workaround, this can be managed by adding a general styling rule, to the application top styling file. This will also ensure that [overlay](https://material.angular.io/cdk/overlay/overview) components will also be affected by direction.

```css
/* app.component.scss */

[dir='rtl'] .mat-icon {
  transform: scale(-1, 1);
}
```

Also, we have a [translation file](internationalization.md) for Arabic (code: "ar"),
which is the
[most widely used](https://en.wikipedia.org/wiki/List_of_languages_by_number_of_native_speakers)
language written from right to left.

It is on our [roadmap](../roadmap.md) to extend and improve our support for RTL languages
in the coming versions of ADF.
