---
Added: v2.0.0
Status: Active
---

# Notification Service

Shows a notification message with optional feedback.

![Notification Service screenshot](../docassets/images/NotiService.png)

## Class members

### Methods

-   **openSnackMessage**(message: `string` = `null`, millisecondsDuration?: `number` = `null`): `MatSnackBarRef<any>`<br/>
    Opens a snackbar notification to show a message.
    -   _message:_ `string`  - The message (or resource key) to show.
    -   _millisecondsDuration:_ `number`  - (Optional) Time before notification disappears after being shown
    -   **Returns** `MatSnackBarRef<any>` - Information/control object for the snackbar
-   **openSnackMessageAction**(message: `string` = `null`, action: `string` = `null`, millisecondsDuration?: `number` = `null`): `MatSnackBarRef<any>`<br/>
    Opens a snackbar notification with a message and a response button.
    -   _message:_ `string`  - The message (or resource key) to show.
    -   _action:_ `string`  - Caption for the response button
    -   _millisecondsDuration:_ `number`  - (Optional) Time before the notification disappears (unless the button is clicked)
    -   **Returns** `MatSnackBarRef<any>` - Information/control object for the snackbar

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
