---
Title: Translation service
Added: v2.0.0
Status: Active
Last reviewed: 2019-02-08
---

# [Translation service](../../../lib/core/src/lib/translation/translation.service.ts "Defined in translation.service.ts")

Supports localisation.

## Class members

### Methods

-   **addTranslationFolder**(name: `string` = `""`, path: `string` = `""`)<br/>
    Adds a new folder of translation source files.
    -   _name:_ `string`  - Name for the translation provider
    -   _path:_ `string`  - Path to the folder
-   **get**(key: `string|Array<string>`, interpolateParams?: `any`): [`Observable`](http://reactivex.io/documentation/observable.html)`<string|any>`<br/>
    Gets the translation for the supplied key.
    -   _key:_ `string|Array<string>`  - Key to translate
    -   _interpolateParams:_ `any`  - (Optional) String(s) to be interpolated into the main message
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<string|any>` - Translated text
-   **instant**(key: `string|Array<string>`, interpolateParams?: `any`): `string|any`<br/>
    Directly returns the translation for the supplied key.
    -   _key:_ `string|Array<string>`  - Key to translate
    -   _interpolateParams:_ `any`  - (Optional) String(s) to be interpolated into the main message
    -   **Returns** `string|any` - Translated text
-   **loadTranslation**(lang: `string`, fallback?: `string`)<br/>
    Loads a translation file.
    -   _lang:_ `string`  - Language code for the language to load
    -   _fallback:_ `string`  - (Optional) Language code to fall back to if the first one was unavailable
-   **onTranslationChanged**(lang: `string`)<br/>
    Triggers a notification callback when the translation language changes.
    -   _lang:_ `string`  - The new language code
-   **use**(lang: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<any>`<br/>
    Sets the target language for translations.
    -   _lang:_ `string`  - Code name for the language
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<any>` - Translations available for the language

## Details

In the `get` and `instant` methods, the `interpolateParams` parameter supplies
interpolation strings for keys that include them. For example, in the standard
`en.json`, the `CORE.PAGINATION.ITEMS_RANGE` key is defined as:

<!-- {% raw %} -->

    "Showing {{ range }} of {{ total }}"

<!-- {% endraw %} -->

The `range` and `total` interpolations are supplied to the `get` method using
an object with fields of the same name:

```ts
this.trans.get(
      "CORE.PAGINATION.ITEMS_RANGE",
      {
        range: "1..10",
        total: "122"
      }
    ).subscribe(translation => {
        this.translatedText = translation;
    });
```

### Registering translation sources

To supply your own set of translation source files, you
first need to create a subfolder for them within your application's
`assets` folder. The folder can have any name you like but it must also have
a sub-folder called `i18n` where the translation lists will be stored. So, the
general format of the path to this folder will be:

`<app>/src/assets/my-translations/i18n`

If you wanted English and French translations then you would add
`en.json` and `fr.json` files into the `i18n` folder and add your new keys:

**en.json**

```json
{
    "WELCOME_MESSAGE": "Welcome!"
}
```

**fr.json**

```json
{
    "WELCOME_MESSAGE": "Bienvenue !"
}
```

The files follow the same hierarchical key:value JSON format as the built-in translations.
You can add new keys to your local files or redefine existing keys but the built-in definitions
will be used for any keys you don't explicitly define in your files. For example, `en.json` might
look like the following:

```json
{
    "title": "my app",
    "LOGIN": {
        "LABEL": {
            "LOGIN": "Custom Sign In"
        }
    }
}
```

To enable the new translations in your app, you also need to register them in your `app.module.ts` file using `provideTranslations` api:

```ts
import { provideTranslations } from "@alfresco/adf-core";

@NgModule({
    providers: [
        provideTranslations('my-translations', 'assets/my-translations')
    ]
})
export class MyModule {}
```

You can now use your new keys in your component:

```ts
export class MyComponent implements OnInit {
    translateService = inject(TranslationService);
    translatedText = '';

    ngOnInit() {
        this.translateService.use("fr");
        this.translatedText = this.translateService.instant('WELCOME_MESSAGE');
    }
}
```

Note: the `source` property points to the web application root.
Do not forget to configure your Angular application to copy the newly created files to the build output, for example:

**angular.json**

```json
{
    "glob": "**/*",
    "input": "lib/core/src/lib/i18n",
    "output": "/assets/adf-core/i18n"
}
```

You can register as many entries as you like.

### Switching languages

Depending on your application, you may want to have buttons or dropdown menus to allow language selection for the end users.

You can use [`TranslationService`](../../core/services/translation.service.md) to switch languages from your code based on input events of your choice:

```ts
class MyComponent {
    constructor(private translateService: TranslationService) {
    }

    onLanguageClicked(lang: string) {
        this.translateService.use(lang || 'en');
    }
}
```

## See Also

- [Internationalization](../../user-guide/internationalization.md)
