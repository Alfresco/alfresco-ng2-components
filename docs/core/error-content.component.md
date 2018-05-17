---
Added: v2.4.0
Status: Active
---
# Error Content Component

Displays info about a specific error.

## Basic Usage

Once you have catched the error in your server you will need to redirect to ```/error/errorCode``` to display information about that error. 

```ts
this.router.navigate(['/error', errorCode]);
```

```html
<div class="adf-error-content">
    <p class="adf-error-content-code">{{ errorCode }}</p>
    <div class="adf-error-content-shadow"></div>
    <p class="adf-error-content-title">{{ errorTitle | translate }}</p>
    <p class="adf-error-content-description">{{ errorDescription | translate }}
        <a href="{{errorLinkUrl}}" *ngIf="errorLinkText" 
        class="adf-error-content-description-link" > {{ errorLinkText | translate }}</a></p>
    <button mat-raised-button color="primary" routerLink="/home">{{ homeButton | translate}}</button>
</div>
```

## Properties

### Error Content Component

| Name | Type | Description |
| --- | --- | -- |
| errorCode | string | Error code |
| errorTitle | string | Error title |
| errorDescription | string | Short description about the error |
| errorLink | string | (Optional) This link will be attached at the end of the error description and itt will be highlighted.|


## Details

You can customize your errors by adding them to the tranlate files inside ```lib/core/i18n```.
```json
"ERROR_CONTENT": {
    "HOME_BUTTON": "Back to home",
    "403": {
      "TITLE": "Error 403 forbidden!",
      "DESCRIPTION": "Sorry, access to this resource on the server is denied. Either check URL or feel free to",
      "LINK": {
        "TEXT": "report this issue.",
        "URL": ""
      }
    },
    "404": {
      "TITLE": "Whoops!",
      "DESCRIPTION": "We couldn’t find the page you were looking for.",
      "LINK": {
        "TEXT": "",
        "URL": ""
      }
    }
  }
```



