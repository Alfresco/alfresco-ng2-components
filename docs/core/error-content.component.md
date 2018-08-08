---
Added: v2.4.0
Status: Active
Last reviewed: 2018-06-13
---

# Error Content Component

Displays info about a specific error.

## Basic Usage

Once you have caught the error in your server you will need to redirect to `/error/errorCode` to display information about that error. 

```ts
this.router.navigate(['/error', errorCode]);
```

## Properties

### Error Content Component

| Name | Type | Default | Description |
| ---- | ---- |---- | ----------- |
| errorCode | string |  |Error code |
| returnButtonUrl | string | "/"  |URL for the return button |
| secondaryButtonUrl | string | "report-issue" |(Optional) URL for the secondary button |

Note that you will also have to provide values for the variables used in the view template.

## Details

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

## See also

- [Empty Content component](empty-content.component.md)
