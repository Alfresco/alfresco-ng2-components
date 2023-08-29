# Alfresco ESlint Angular Library

Contains custom ESlint rules for Angular.

<!-- markdown-toc start - Don't edit this section.  npm run toc to generate it-->

<!-- toc -->

- [Documentation](#documentation)
- [Prerequisites](#prerequisites)
- [Install](#install)
- [Usage](#usage)
- [License](#license)

<!-- tocstop -->

<!-- markdown-toc end -->

## Documentation

See the [ADF ESlint Angular](../../docs/README.md#eslint-angular-api) section of the [docs index](../../docs/README.md)
for all available documentation on this library.

## Prerequisites

This library doesn't require any additional software. Just install it with `npm` command from Install section below.

## Install

```sh
npm install @alfresco/eslint-plugin-eslint-angular
```

## Usage

If you want to add your own custom ESlint rules for Angular, make sure you're familiar with `ESTree` and `JavaScript AST nodes`. For rule creation refer to [Angular ESlint documentation](https://github.com/angular-eslint/angular-eslint#readme) and [Writing custom TS ESlint rules for Angular guide](https://medium.com/bigpicture-one/writing-custom-typescript-eslint-rules-with-unit-tests-for-angular-project-f004482551db).

Custom rules need to be added to `rules` section of `.eslintrc.json` file. For example on how to do it refer to `Basic Usage` paragraph of [Use none component view encapsulation rule](../../docs/eslint-angular/rules/use-none-component-view-encapsulation.md#basic-usage).

## License

[Apache Version 2.0](https://github.com/Alfresco/alfresco-ng2-components/blob/master/LICENSE)
