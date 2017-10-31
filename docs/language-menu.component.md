# Language Menu component

Displays all the languages that are present in the "app.config.json" or the default one (EN).

![Language Menu screenshot](docassets/images/languages-menu.png)

## Basic usage

How to attach an ADF Language Menu as main menu

```html
<button mat-icon-button [matMenuTriggerFor]="langMenu">
    <mat-icon>language</mat-icon>
</button>
<mat-menu #langMenu="matMenu">
    <adf-language-menu></adf-language-menu>
</mat-menu>
```

## Details

In the previous example we are using the ADF Language Menu as main menu.
The Language Menu component is able to fetch all the languages from the "app.config.json".
This is how the configuration looks like in the the "app.config.json"

```json
"languages": [
        {
            "key": "en",
            "label": "English"
        },
        {
            "key": "fr",
            "label": "French"
        },
        {
            "key": "it",
            "label": "Italian"
        }
    ]
```
In case no setting is provided, the component shows only the English language.

### Nested Menu language

How to attach an ADF Language Menu as nested menu

```html
<button mat-icon-button class="dw-profile-menu" [matMenuTriggerFor]="profileMenu">
    <mat-icon>more_vert</mat-icon>
</button>
<mat-menu #profileMenu="matMenu">
    <button mat-menu-item>profile-settings</button>
    <button mat-menu-item [matMenuTriggerFor]="langMenu">Languages</button>
    <button mat-menu-item>sign-out</button>
</mat-menu>
<mat-menu #langMenu="matMenu">
    <adf-language-menu></adf-language-menu>
</mat-menu>
```
![Nested Language Menu screenshot](docassets/images/languages-menu-nested.png)

### Nested menu details

In the previous example we are using the ADF Language Menu as nested menu.

<!-- Don't edit the See also section. Edit seeAlsoGraph.json and run config/generateSeeAlso.js -->
<!-- seealso start -->
<!-- seealso end -->
