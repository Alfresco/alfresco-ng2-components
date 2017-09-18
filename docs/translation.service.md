# Translation service

Supports localisation.

<!-- markdown-toc start - Don't edit this section.  npm run toc to generate it-->

<!-- toc -->

<!-- tocstop -->

<!-- markdown-toc end -->

## Details

### Registering translation sources

In order to enable localisation support you will need to create a `/resources/i18n/en.json` file
and register its parent `i18n` folder with your component or application module.

For example:

```ts
import { TRANSLATION_PROVIDER } from 'ng2-alfresco-core';

@NgModule({
    ...
    providers: [
        ...
        {
            provide: TRANSLATION_PROVIDER,
            multi: true,
            useValue: {
                name: 'ng2-alfresco-core',
                source: 'assets/ng2-alfresco-core'
            }
        }
    ]
})
```

Note: the `source` property points to the web application root, please ensure you have webpack settings to copy all the i18n files at compile time.

```text
index.html
assets/ng2-alfresco-core/i18n/en.json
...
```

You can register as many entries as you would like.

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
