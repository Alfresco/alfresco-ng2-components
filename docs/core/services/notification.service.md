---
Title: Notification Service
Added: v2.0.0
Status: Active
Last reviewed: 2018-06-08
---

# [Notification Service](../../../lib/core/services/notification.service.ts "Defined in notification.service.ts")

Shows a notification message with optional feedback.

![Notification Service screenshot](../docassets/images/NotiService.png)

## Class members

### Methods

-   **dismissSnackMessageAction**()<br/>
    dismiss the notification snackbar
-   **openSnackMessage**(message: `string`, config: `number|MatSnackBarConfig` = [`NotificationService`](../core/notification.service.md)`.DEFAULT_DURATION_MESSAGE`): [`MatSnackBarRef`](https://material.angular.io/components/snack-bar/overview)`<any>`<br/>
    Opens a SnackBar notification to show a message.
    -   _message:_ `string`  - The message (or resource key) to show.
    -   _config:_ `number|MatSnackBarConfig`  - Time before notification disappears after being shown or MatSnackBarConfig object
    -   **Returns** [`MatSnackBarRef`](https://material.angular.io/components/snack-bar/overview)`<any>` - Information/control object for the SnackBar
-   **openSnackMessageAction**(message: `string`, action: `string`, config: `number|MatSnackBarConfig` = [`NotificationService`](../core/notification.service.md)`.DEFAULT_DURATION_MESSAGE`): [`MatSnackBarRef`](https://material.angular.io/components/snack-bar/overview)`<any>`<br/>
    Opens a SnackBar notification with a message and a response button.
    -   _message:_ `string`  - The message (or resource key) to show.
    -   _action:_ `string`  - Caption for the response button
    -   _config:_ `number|MatSnackBarConfig`  - Time before notification disappears after being shown or MatSnackBarConfig object
    -   **Returns** [`MatSnackBarRef`](https://material.angular.io/components/snack-bar/overview)`<any>` - Information/control object for the SnackBar

## Details

The [Notification Service](../core/notification.service.md) is implemented on top of the Angular Material Design snackbar.
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
import { MatSnackBarConfig } from '@angular/material';

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
