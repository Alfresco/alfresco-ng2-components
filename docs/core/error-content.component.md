# Error Content Component

Displays info about a specific error.

## Basic Usage

Once you have catched the error in your server you will need to redirect to `/error/errorCode` to display information about that error. 

```ts
this.router.navigate(['/error', errorCode]);
```

```html
<div class="adf-error-content">
    <p class="adf-error-content-code">
        {{ errorCode }}
    </p>
    <div class="adf-error-content-shadow"></div>
    <p class="adf-error-content-title">
        {{ 'ERROR_CONTENT.' + errorCode + '.TITLE' | translate }}
    </p>
    <p class="adf-error-content-description">
        {{ 'ERROR_CONTENT.' + errorCode + '.DESCRIPTION' | translate }}
    </p>
    <div class="adf-error-content-buttons">
        <a href="/" mat-raised-button color="primary" 
            *ngIf="secondaryButtonText" (click)="onSecondButton()"
            class="adf-error-content-description-link"> 
            {{ 'ERROR_CONTENT.' + errorCode + '.SECONDARY_BUTTON.TEXT' | translate | uppercase }}
        </a>
        <a href="/" mat-raised-button color="primary" (click)="onReturnButton()">
            {{ 'ERROR_CONTENT.' + this.errorCode + '.RETURN_BUTTON.TEXT' | translate | uppercase }}
        </a>
    </div>
</div>
```

## Properties

### Error Content Component

| Name | Type | Description |
| ---- | ---- | ----------- |
| errorCode | string | Error code |
| returnButtonUrl | string | This is the text that will be displayed inside the secondary button |
| secondaryButtonText | string | (Optional) This is the text that will be displayed inside the secondary button |
| secondaryButtonUrl | string | (Optional) This is the link for the secondary button |

Notice that you will also have to provide values for the variables used in the view template.

## Details

You can customize your errors by adding them to the translate files inside `lib/core/i18n`.

```json
"ERROR_CONTENT": {
    "404": {
      "TITLE": "An error occurred.",
      "DESCRIPTION": "We couldn’t find the page you were looking for.",
      "SECONDARY_BUTTON": {
        "TEXT": "",
        "URL": ""
      },
      "RETURN_BUTTON": { 
        "TEXT": "Back to home",
        "ROUTE": "home"
      }
    }
  }
```
