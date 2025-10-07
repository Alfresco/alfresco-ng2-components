---
Title: Error Content Component
Added: v2.4.0
Status: Active
Last reviewed: 2018-09-13
---

# [Error Content Component](../../../lib/core/src/lib/templates/error-content/error-content.component.ts "Defined in error-content.component.ts")

Displays info about a specific error.

## Basic Usage

Once you have caught the error in your server you will need to redirect to `/error/errorCode` to display information about that error.

```ts
this.router.navigate(['/error', errorCode]);
```

## Class members

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| errorCode | `string` |  | Error code associated with this error. |

## Details

Note that you need to provide values for the variables used in the view template.

You can customize your error messages by adding them to the translate files inside
`lib/core/i18n`:

```json
"ERROR_CONTENT": {
    "404": {
      "TITLE": "An error occurred.",
      "DESCRIPTION": "We couldn’t find the page you were looking for.",
      "SECONDARY_BUTTON": {
        "TEXT": ""
      },
      "RETURN_BUTTON": { 
        "TEXT": "Back to home"
      }
    }
  }
```

## How to customise the action button.

The errorContentComponent allows you to customise the actions section using the selector `adf-error-content-actions`.

For example you can have a custom action button with the following code

```html
<adf-error-content [errorCode]="errorCode">
    <div adf-error-content-actions>
       <button type="button">MyAction</button>
    </div>
</adf-error-content>
```

## See also

-   [Empty Content component](empty-content.component.md)
