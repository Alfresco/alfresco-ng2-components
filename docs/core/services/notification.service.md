---
Title: Notification Service
Added: v2.0.0
Status: Active
Last reviewed: 2018-06-08
---

# [Notification Service](../../../lib/core/notifications/services/notification.service.ts "Defined in notification.service.ts")

Shows a notification message with optional feedback.

![Notification Service screenshot](../../docassets/images/NotiService.png)

## Class members

### Methods

*   **dismissSnackMessageAction**()<br/>
    dismiss the notification snackbar
*   **openSnackMessage**(message: `string`, config?: `number|MatSnackBarConfig`, interpolateArgs?: `any`): [`MatSnackBarRef`](https://material.angular.io/components/snack-bar/overview)`<any>`<br/>
    Opens a SnackBar notification to show a message.
    *   *message:* `string`  - The message (or resource key) to show.
    *   *config:* `number|MatSnackBarConfig`  - (Optional) Time before notification disappears after being shown or MatSnackBarConfig object
    *   *interpolateArgs:* `any`  - (Optional) The interpolation parameters to add for the translation
    *   **Returns** [`MatSnackBarRef`](https://material.angular.io/components/snack-bar/overview)`<any>` - Information/control object for the SnackBar
*   **openSnackMessageAction**(message: `string`, action: `string`, config?: `number|MatSnackBarConfig`, interpolateArgs?: `any`): [`MatSnackBarRef`](https://material.angular.io/components/snack-bar/overview)`<any>`<br/>
    Opens a SnackBar notification with a message and a response button.
    *   *message:* `string`  - The message (or resource key) to show.
    *   *action:* `string`  - Caption for the response button
    *   *config:* `number|MatSnackBarConfig`  - (Optional) Time before notification disappears after being shown or MatSnackBarConfig object
    *   *interpolateArgs:* `any`  - (Optional) The interpolation parameters to add for the translation
    *   **Returns** [`MatSnackBarRef`](https://material.angular.io/components/snack-bar/overview)`<any>` - Information/control object for the SnackBar
*   **showError**(message: `string`, action?: `string`, interpolateArgs?: `any`): [`MatSnackBarRef`](https://material.angular.io/components/snack-bar/overview)`<any>`<br/>
    Rase error message
    *   *message:* `string`  - Text message or translation key for the message.
    *   *action:* `string`  - (Optional) Action name
    *   *interpolateArgs:* `any`  - (Optional) The interpolation parameters to add for the translation
    *   **Returns** [`MatSnackBarRef`](https://material.angular.io/components/snack-bar/overview)`<any>` -
*   **showInfo**(message: `string`, action?: `string`, interpolateArgs?: `any`): [`MatSnackBarRef`](https://material.angular.io/components/snack-bar/overview)`<any>`<br/>
    Rase info message
    *   *message:* `string`  - Text message or translation key for the message.
    *   *action:* `string`  - (Optional) Action name
    *   *interpolateArgs:* `any`  - (Optional) The interpolation parameters to add for the translation
    *   **Returns** [`MatSnackBarRef`](https://material.angular.io/components/snack-bar/overview)`<any>` -
*   **showWarning**(message: `string`, action?: `string`, interpolateArgs?: `any`): [`MatSnackBarRef`](https://material.angular.io/components/snack-bar/overview)`<any>`<br/>
    Rase warning message
    *   *message:* `string`  - Text message or translation key for the message.
    *   *action:* `string`  - (Optional) Action name
    *   *interpolateArgs:* `any`  - (Optional) The interpolation parameters to add for the translation
    *   **Returns** [`MatSnackBarRef`](https://material.angular.io/components/snack-bar/overview)`<any>` -

## Details

The [Notification Service](notification.service.md) is implemented on top of the Angular Material Design snackbar.
Use this service to show a notification message, and optionally get feedback from it.

```ts
import { NotificationService } from '@alfresco/adf-core';

export class MyComponent implements OnInit {

    constructor(private notificationService: NotificationService) {
    }

    ngOnInit() {
        this.notificationService
            .openSnackMessage('test', 200000)
            .afterDismissed()
            .subscribe(() => {
                console.log('The snack-bar was dismissed');
            });
    }
}
```

```ts
import { NotificationService } from '@alfresco/adf-core';

export class MyComponent implements OnInit {

    constructor(private notificationService: NotificationService) {
    }

    ngOnInit() {
        this.notificationService
            .openSnackMessageAction('Do you want to report this issue?', 'send', 200000)
            .afterDismissed()
            .subscribe(() => {
                console.log('The snack-bar was dismissed');
            });
    }
}
```

```ts
import { NotificationService } from '@alfresco/adf-core';
import { MatSnackBarConfig } from '@angular/material/snackbar';

export class MyComponent implements OnInit {

    snackBarConfig: MatSnackBarConfig = new MatSnackBarConfig();

    constructor(private notificationService: NotificationService) {
    }

    ngOnInit() {
        this.notificationService
            .openSnackMessageAction('Do you want to report this issue?', 'send', snackBarConfig)
            .afterDismissed()
            .subscribe(() => {
                console.log('The snack-bar was dismissed');
            });
    }
}
```

The default message duration is 5000 ms that is used only if you don't pass a custom duration in the parameters of openSnackMessageAction/openSnackMessage methods.
You can also change the default 5000 ms adding the following configuration in the app.config.json:

```json
    "notificationDefaultDuration" : "7000"
```
