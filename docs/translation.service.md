---
Added: v2.0.0
Status: Active
---
# Translation service

Supports localisation.

## Methods

-   `addTranslationFolder(name: string = '', path: string = '')`  
    Adds a new folder of translation source files.  
    -   `name` - Name for the translation provider
    -   `path` - Path to the folder
-   `use(lang: string): Observable<any>`  
    Sets the target language for translations.  
    -   `lang` - Code name for the language
-   `get(key: string|Array<string>, interpolateParams?: Object): Observable<any>`  
    Gets the translation for the supplied key.  
    -   `key` - Key to translate
    -   `interpolateParams` - (Optional) String(s) to be interpolated into the main message
-   `instant(key: string | Array<string>, interpolateParams?: Object): any`  
    Directly returns the translation for the supplied key.  
    -   `key` - Key to translate
    -   `interpolateParams` - (Optional) String(s) to be interpolated into the main message

## Details

In the `get` and `instant` methods, the `interpolateParams` parameter supplies
interpolation strings for keys that include them. For example, in the standard
`en.json`, the `CORE.PAGINATION.ITEMS_RANGE` key is defined as:

    "Showing {{ range }} of {{ total }}"

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

If you wanted English and French translations then you would copy the built-in
`en.json` and `fr.json` files into the `i18n` folder and add your new keys:

    // en.json

        ...
      "WELCOME_MESSAGE": "Welcome!"
        ...

    // fr.json
        ...
      "WELCOME_MESSAGE": "Bienvenue !"
        ...

To enable the new translations in your app, you also need to register them in your
`app.module.ts` file. Import `TRANSLATION_PROVIDER` and add the path of your
translations folder to the `providers`:

```ts
// Other imports...

import { TRANSLATION_PROVIDER } from "@alfresco/adf-core";

  ...

@NgModule({
  imports: [
    ...
  ],
  declarations: [
    ...
  ],
  providers: [
    {
      provide: TRANSLATION_PROVIDER,
      multi: true,
      useValue: {
          name: 'my-translations',
          source: 'assets/my-translations'
      }
  }
  ...
```

You can now use your new keys in your component:

```ts
  ...
ngOnInit() {
    this.trans.use("fr");
    
    this.trans.get("WELCOME_MESSAGE").subscribe(translation => {
      this.translatedText = translation;
    });
  }
  ...
```

The new translation files completely replace the built-in ones.
If you want to continue using the built-in keys then you must add your new
keys to copies of the existing files.

Note: the `source` property points to the web application root. Ensure you have
webpack correctly set up to copy all the i18n files at compile time.

```text
index.html
assets/ng2-alfresco-core/i18n/en.json
...
```

You can register as many entries as you like.

### Switching languages

Depending on your application, you may want to have buttons or dropdown menus to allow language selection for the end users.

You can use `TranslationService` to switch languages from your code based on input events of your choice:

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

-   [Internationalization](internationalization.md)
