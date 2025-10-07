---
Title: App extensions
Added: 3.0.0
---

# App Extensions

ADF lets you simplify the app developer's task by providing an **extensible app**
as a starting point.

An extensible app is designed with _extension points_, which are
placeholders where components and other content
can be "plugged in" to provide functionality. The app may be supplied with
default content for the extension points but the idea is that a developer can
easily replace this with custom content as necessary. An organization might find this
useful, for example, if they want to create a family of apps with consistent
appearance and behavior. One developer can produce an extensible app that
can then be adapted by other developers to create the various apps in the
family.

## Contents

- [Extension points](#extension-points)
- [Extensibility features](#extensibility-features)
- [Setting up an app for extensibility](#setting-up-an-app-for-extensibility)
- [Creating extensions](#creating-extensions)
  - [Routes](#routes)
  - [Actions](#actions)
  - [Rules](#rules)
  - [Features](#features)

## Extension points

A pluggable extension is implemented by a class or data object that provides
its functionality. The class or object is then registered in the app with a
key/ID string that is used to reference it. The general idea is that only the
ID string is used directly in the main app code to designate the extension point,
while the actual implementation is loaded and registered separately. In this respect,
extension points work somewhat like
[translation keys](internationalization.md) - the key is used to mark
a place in the app where the actual content will be supplied dynamically.

## Extensibility features

ADF provides a number of features that offer extension points or help
with extensibility in general:

- **Components**: The [Dynamic component](../extensions/components/dynamic.component.md)
    has no content of its own but it has an `id` property that
    references a registered component extension ID. The referenced component
    will be added as a child of the Dynamic component at runtime.
- **Routes**: These are registered as  key/ID strings that resolve to standard
    Angular routes. This feature can be used, say, that a click on a list item
    should send the user _somewhere_ but leave the actual destination up to the
    developer.
- **Auth guards**: Routes can be protected by auth guards
    to prevent unauthorized users from accessing pages they shouldn't see.
- **Rules**: These are tests that produce a boolean result depending on the app state.
    The extensible app can use them with _features_ or `ngIf` directives, for example, to show or
    hide content in certain conditions. The exact conditions, however, are chosen
    by the developer who extends the app.
- **Actions**: The extensible app can define a set of **application actions** that
    perform basic operations in the app. These are each referenced by a unique key
    string and can take a data value as a parameter. Items from this set can then
    be referenced by extension actions. These contain their own key/ID string along
    with the name of an application action to trigger and a "payload" value to pass
    as a parameter. The payload can either be a string (to represent a static message,
    say) or an expression that calculates a result from app state. The expression could,
    for example, return the current user's name, the currently selected list item or a
    string composed from several data items.
- **Features**: What counts as a "feature" varies according to the application but
    it is intended to mean any salient piece of functionality that can be
    customized by extensions. For example, a toolbar, navigation bar,
    login page or tools menu might all be regarded as features. Any of these
    features could be extended in a variety of ways. A menu, say, might support custom
    commands that are implemented by actions with each command enabled or disabled
    depending on the value returned by a rule.

## Setting up an app for extensibility

You can register component classes for use with the [Dynamic component](../extensions/components/dynamic.component.md)
using the `setComponents` method of the
[Extension service](../extensions/services/extension.service.md) (see the Dynamic component page for further details
and code samples). The service also has `setAuthGuards` and
`setEvaluators` methods that behave analogously.

The recommended way to provide the set of application actions (ie, the built-in
actions that can be referenced by extension actions) is to use the scheme
defined by [@ngrx/store](https://gist.github.com/btroncone/a6e4347326749f938510).
Briefly, the idea is that all app state is stored centrally and
can only be updated by functions triggered by named command strings (eg, "ADD_USER",
"CLEAR_SELECTION", "NEW_DOCUMENT", etc). ADF's extensibility features are designed
to fit in neatly with @ngrx/store but it has many other advantages, as described on
the website.

## Creating extensions

The set of basic classes, evaluators and actions provided by the app can be used to set up extensions.
The easiest way to configure the extension functionality is with an extension config
file. The structure of this file (in JSON format) follows the basic pattern shown
below:

```json
{
  "$id": "unique.id",
  "$name": "extension.name",
  "$version": "1.0.0",
  "$vendor": "author.name",
  "$license": "license",
  "$runtime": "1.5.0",
  "$description": "some description",

  "routes": [ ... ],
  "actions": [ ... ],
  "rules": [ ... ],
  "features": { ... }
}
```

You can use the `load` method of the [Extension service](../extensions/services/extension.service.md) to read the file into a
convenient object that implements the [`ExtensionConfig`](../../lib/extensions/src/lib/config/extension.config.ts) and [`ExtensionRef`](../../lib/extensions/src/lib/config/extension.config.ts) interfaces.
Note that the `extension.schema.json` file contains a [JSON schema](http://json-schema.org/)
that allows for format checking and also text completion in some editors.

### Replacing Values

By default, the data from the extensions gets merged with the existing one.

For example:

**Application Data**

```json
{
    "languages": [
        { "key": "en", "title": "English" },
        { "key": "it", "title": "Italian" }
    ]
}
```

**Extension Data**

```json
{
    "languages": [
        { "key": "fr", "title": "French" },
    ]
}
```

**Expected Result**

At runtime, the application is going to display three languages

```json
{
    "languages": [
        { "key": "en", "title": "English" },
        { "key": "it", "title": "Italian" },
        { "key": "fr", "title": "French" },
    ]
}
```

You can replace the value by using the special key syntax:

```json
{
    "<name>.$replace": "<value>"
}
```

**Example:**

```json
{
    "languages.$replace": [
        { "key": "fr", "title": "French" }
    ]
}
```

**Expected Result**

At runtime, the application is going to display languages provided by the extension (given that no other extension file replaces the values, otherwise it is going to be a "last wins" scenario)

```json
{
    "languages": [
        { key: "fr", "title": "French" }
    ]
}
```

### Routes

The `routes` array in the config contains objects like those shown in the
following example:

```json
"routes": [
    {
      "id": "plugin1.routes.customTrash",
      "path": "ext/customtrash",
      "component": "yourCustomTrash.component.id",
      "layout": "app.layout.main",
      "auth": ["app.auth"],
      "data": {
        "title": "Custom Trashcan"
      }
    },
    ...
  ]
```

You can access routes from the config using the `getRouteById` method of the
[Extension service,](../extensions/services/extension.service.md) which returns a [`RouteRef`](../../lib/extensions/src/lib/config/routing.extensions.ts) object. Note that the references
to the component and auth guards are extension IDs,
[as described above](#extension-points).

### Actions

The `actions` array has the following structure:

```json
 "actions": [
    {
      "id": "plugin1.actions.settings",
      "type": "NAVIGATE_URL",
      "payload": "/settings"
    },
    {
      "id": "plugin1.actions.info",
      "type": "SNACKBAR_INFO",
      "payload": "I'm a nice little popup raised by extension."
    },
    {
      "id": "plugin1.actions.node-name",
      "type": "SNACKBAR_INFO",
      "payload": "$('Action for ' + context.selection.first.entry.name)"
    },
    ...
  ]
```

The [Extension service](../extensions/services/extension.service.md) defines a `getActionById` method that returns an
[`ActionRef`](../../lib/extensions/src/lib/config/action.extensions.ts) object corresponding to an item from this array.

The `type` property refers to an action type that must be provided by the
app (eg, the "SNACKBAR_INFO" in the example presumably just shows a standard snackbar
message).

By default, the `payload` is just an ordinary string that can be used for
a message, URL or other static text data. However, you can also define a
JavaScript expression here by surrounding it with `$( ... )`. The expression
has access to an object named `context` which typically contains information
about the app state. You can supply the object that contains this data via the
`runExpression` method of the [Extension service,](../extensions/services/extension.service.md) which actually evaluates the
expression. Note that the result of the expression doesn't necessarily
have to be a string.

### Rules

The simplest type of rule is configured as shown below:

```json
"rules": [
    {
      "id": "app.trashcan",
      "type": "app.navigation.isTrashcan"
    },
    ...
  ]
```

The `type` is the ID of a [`RuleEvaluator`](../../lib/extensions/src/lib/config/rule.extensions.ts) function that has been registered using
the `setEvaluators` method of the [Extension service](../extensions/services/extension.service.md).
The evaluator is a boolean function that represents whether a certain
condition is true or false (eg, whether an item is selected, whether the user
has certain options enabled, etc). The evaluator has access to a context object
that is supplied from the app during the call to `evaluateRule` (defined in
the Extension service).

A more complex rule can take other rules as parameters:

```json
"rules": [
    {
      "id": "app.toolbar.favorite.canAdd",
      "type": "core.every",
      "parameters": [
        { "type": "rule", "value": "app.selection.canAddFavorite" },
        { "type": "rule", "value": "app.navigation.isNotRecentFiles" },
        { "type": "rule", "value": "app.navigation.isNotSharedFiles" },
        { "type": "rule", "value": "app.navigation.isNotSearchResults" }
      ]
    }
  ]
```

This is mainly useful for creating "metarules" that require certain
relationships to hold among the parameter rules. A few useful metarules
are defined in the
[core.evaluators.ts](../../lib/extensions/src/lib/evaluators/core.evaluators.ts) file:

- `every`: Returns true only if all the parameter rules return true
- `some`: Returns true if one or more of the parameter rules return true
- `not`: Returns true only if all the parameter rules return false

Note that parameter rules can also recursively invoke their own rules, etc.

### Features

The `features` object does not have any defined structure but the intention
is that each key in the object corresponds to the name of a salient feature
of the app that can be extended. The object or array that matches the key
name contains parameters that modify the behavior of the feature, possibly
using actions, rules, etc, defined elsewhere in the config. Suppose, for
example, the app has a tools menu that can be extended with extra commands.
The properties for a new command might include:

- The title shown in the menu
- An icon shown next to the title
- The action that is activated when the command is selected
- A rule that determines whether or not the command is enabled

A `features` object to add an extra item to this menu might look like
the following:

```json
"features": {
  "toolmenu": [
    {
      "id": "app.toolmenu.givebiscuit",
      "title": "Give a biscuit to the selected user",
      "icon": "icons/GiveBiscuit.svg",
      "actions": {
        "click": "GIVE_BISCUIT"
      },
      "rules": {
        "visible": "app.biscuits.notempty"
      }
    }
  ]
}
```
