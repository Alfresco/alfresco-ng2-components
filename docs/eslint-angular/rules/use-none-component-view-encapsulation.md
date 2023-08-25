---
Title: Use none component view encapsulation
Added: v6.1.0
Status: Active
Last reviewed: 2023-05-23
---

# [Use none component view encapsulation](../../../lib/eslint-angular/src/rules/use-none-component-view-encapsulation/use-none-component-view-encapsulation.ts "Defined in use-none-component-view-encapsulation.ts")

Custom ESLint rule that requires components to use ViewEncapsulation.None. It has been implemented because None encapsulation makes themes styling easier.
This rule allows autofix.

## Basic Usage

Put this rule in `.eslintrc.json` in `rules` section. 

```json
{
  "rules": {
    "@alfresco/eslint-angular/use-none-component-view-encapsulation": "error"
  }
}
```
