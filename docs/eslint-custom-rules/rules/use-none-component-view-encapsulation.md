---
Title: Use none component view encapsulation
Added: v6.0.0
Status: Active
Last reviewed: 2023-05-23
---

# [Use none component view encapsulation](../../../lib/eslint-custom-rules/src/rules/use-none-component-view-encapsulation/use-none-component-view-encapsulation.ts "Defined in use-none-component-view-encapsulation.ts")

Custom ESLint rule which check if component uses ViewEncapsulation.None. It has been implemented because None encapsulation makes themes styling easier.

## Basic Usage
Put this rule in eslintrc.json in rules. 

```json
{
  "rules": {
    "@alfresco/custom-rules/use-none-component-view-encapsulation": "error"
  }
}
```
