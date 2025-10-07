---
Title: Extension Service
Added: v3.0.0
Status: Experimental
Last reviewed: 2019-03-19
---

# [Extension Service](../../../lib/extensions/src/lib/services/extension.service.ts "Defined in extension.service.ts")

Manages and runs basic extension functionality.

## Class members

### Methods

-   **evaluateRule**(ruleId: `string`, context?: [`RuleContext`](../../../lib/extensions/src/lib/config/rule.extensions.ts)): `boolean`<br/>
    Evaluates a rule.
    -   _ruleId:_ `string`  - ID of the rule to evaluate
    -   _context:_ [`RuleContext`](../../../lib/extensions/src/lib/config/rule.extensions.ts)  - (Optional) Custom rule execution context.
    -   **Returns** `boolean` - True if the rule passed, false otherwise
-   **getActionById**(id: `string`): [`ActionRef`](../../../lib/extensions/src/lib/config/action.extensions.ts)<br/>
    Retrieves an action using its ID value.
    -   _id:_ `string`  - The ID value to look for
    -   **Returns** [`ActionRef`](../../../lib/extensions/src/lib/config/action.extensions.ts) - Action or null if not found
-   **getAuthGuards**(ids: `string[]`): `Array<Type<any>>`<br/>
    Retrieves one or more auth guards using an array of ID values.
    -   _ids:_ `string[]`  - Array of ID value to look for
    -   **Returns** `Array<Type<any>>` - Array of auth guards or empty array if none were found
-   **getComponentById**(id: `string`): `Type<>`<br/>
    Retrieves a registered [extension component](../../../lib/extensions/src/lib/services/component-register.service.ts) using its ID value.
    -   _id:_ `string`  - The ID value to look for
    -   **Returns** `Type<>` - The component or null if not found
-   **getElements**(key: `string`, fallback: `Array<>` = `[]`): `Array<>`<br/>

    -   _key:_ `string`  - 
    -   _fallback:_ `Array<>`  - 
    -   **Returns** `Array<>` - 

-   **getEvaluator**(key: `string`): [`RuleEvaluator`](../../../lib/extensions/src/lib/config/rule.extensions.ts)<br/>
    Retrieves a [RuleEvaluator](../../../lib/extensions/src/lib/config/rule.extensions.ts) function using its key name.
    -   _key:_ `string`  - Key name to look for
    -   **Returns** [`RuleEvaluator`](../../../lib/extensions/src/lib/config/rule.extensions.ts) - [RuleEvaluator](../../../lib/extensions/src/lib/config/rule.extensions.ts) or null if not found
-   **getFeature**(key: `string|string[]`, defaultValue: `any` = `[]`)<br/>
    Gets features by key.
    -   _key:_ `string|string[]`  - Key string using dot notation or array of strings
    -   _defaultValue:_ `any`  - Default value returned if feature is not found, default is empty array
-   **getRouteById**(id: `string`): [`RouteRef`](../../../lib/extensions/src/lib/config/routing.extensions.ts)<br/>
    Retrieves a route using its ID value.
    -   _id:_ `string`  - The ID value to look for
    -   **Returns** [`RouteRef`](../../../lib/extensions/src/lib/config/routing.extensions.ts) - The route or null if not found
-   **getRuleById**(id: `string`): [`RuleRef`](../../../lib/extensions/src/lib/config/rule.extensions.ts)<br/>
    Retrieves a rule using its ID value.
    -   _id:_ `string`  - The ID value to look for
    -   **Returns** [`RuleRef`](../../../lib/extensions/src/lib/config/rule.extensions.ts) - The rule or null if not found
-   **load**(): [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)`<`[`ExtensionConfig`](../../../lib/extensions/src/lib/config/extension.config.ts)`>`<br/>
    Loads and registers an extension config file and plugins (specified by path properties).
    -   **Returns** [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)`<`[`ExtensionConfig`](../../../lib/extensions/src/lib/config/extension.config.ts)`>` - The loaded config data
-   **runExpression**(value: `string|any`, context?: `any`): `any`<br/>
    Runs a lightweight expression stored in a string.
    -   _value:_ `string|any`  - String containing the expression or literal value
    -   _context:_ `any`  - (Optional) Parameter object for the expression with details of app state
    -   **Returns** `any` - Result of evaluated expression, if found, or the literal value otherwise
-   **setAuthGuards**(values: `Function`)<br/>
    Adds one or more new auth guards to the existing set.
    -   _values:_ `Function`  - The new auth guards to add
-   **setComponents**(values: `Function`)<br/>
    Adds one or more new components to the existing set.
    -   _values:_ `Function`  - The new components to add
-   **setEvaluators**(values: `Function`)<br/>
    Adds one or more new rule evaluators to the existing set.
    -   _values:_ `Function`  - The new evaluators to add
-   **setup**(config: [`ExtensionConfig`](../../../lib/extensions/src/lib/config/extension.config.ts))<br/>
    Registers extensions from a config object.
    -   _config:_ [`ExtensionConfig`](../../../lib/extensions/src/lib/config/extension.config.ts)  - Object with config data

## Details

Use the methods of this service to add extensibility features to your app. You can find further
details in the [App extensions](../../user-guide/app-extensions.md) page.
