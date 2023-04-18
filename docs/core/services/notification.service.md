---
Title: Notification Service
Added: v2.0.0
Status: Active
Last reviewed: 2018-06-08
---

# [Notification Service](../../../lib/core/src/lib/notifications/services/notification.service.ts "Defined in notification.service.ts")

Shows a notification message with optional feedback.

![Notification Service screenshot](../../docassets/images/NotiService.png)

## Class members

### Methods

-   **dismissSnackMessageAction**()<br/>
    dismiss the notification snackbar
-   **openSnackMessage**(message: `string`, config?: `number|MatSnackBarConfig<Omit<SnackBarData,"actionLabel"|"message">>`, interpolateArgs?: `any`): [`MatSnackBarRef`](https://material.angular.io/components/snack-bar/overview)`<any>`<br/>
    Opens a SnackBar notification to show a message.
    -   _message:_ `string`  - The message (or resource key) to show.
    -   _config:_ `number|MatSnackBarConfig<Omit<SnackBarData,"actionLabel"|"message">>`  - (Optional) Time before notification disappears after being shown or MatSnackBarConfig object
    -   _interpolateArgs:_ `any`  - (Optional) The interpolation parameters to add for the translation
    -   **Returns** [`MatSnackBarRef`](https://material.angular.io/components/snack-bar/overview)`<any>` - Information/control object for the SnackBar
-   **openSnackMessageAction**(message: `string`, action: `string`, config?: `number|MatSnackBarConfig<Omit<SnackBarData,"actionLabel"|"message">>`, interpolateArgs?: `any`): [`MatSnackBarRef`](https://material.angular.io/components/snack-bar/overview)`<any>`<br/>
    Opens a SnackBar notification with a message and a response button.
    -   _message:_ `string`  - The message (or resource key) to show.
    -   _action:_ `string`  - Caption for the response button
    -   _config:_ `number|MatSnackBarConfig<Omit<SnackBarData,"actionLabel"|"message">>`  - (Optional) Time before notification disappears after being shown or MatSnackBarConfig object
    -   _interpolateArgs:_ `any`  - (Optional) The interpolation parameters to add for the translation
    -   **Returns** [`MatSnackBarRef`](https://material.angular.io/components/snack-bar/overview)`<any>` - Information/control object for the SnackBar
-   **pushToNotificationHistory**(notification: [`NotificationModel`](../../../lib/core/src/lib/notifications/models/notification.model.ts))<br/>
    Push new notification to Notification History
    -   _notification:_ [`NotificationModel`](../../../lib/core/src/lib/notifications/models/notification.model.ts)  - Notification model to be pushed.
-   **showError**(message: `string`, action?: `string`, interpolateArgs?: `any`, showAction: `boolean` = `true`): [`MatSnackBarRef`](https://material.angular.io/components/snack-bar/overview)`<any>`<br/>
    Rase error message
    -   _message:_ `string`  - Text message or translation key for the message.
    -   _action:_ `string`  - (Optional) Action name
    -   _interpolateArgs:_ `any`  - (Optional) The interpolation parameters to add for the translation
    -   _showAction:_ `boolean`  - True if action should be visible, false if not. Default: true.
    -   **Returns** [`MatSnackBarRef`](https://material.angular.io/components/snack-bar/overview)`<any>` - 
-   **showInfo**(message: `string`, action?: `string`, interpolateArgs?: `any`, showAction: `boolean` = `true`): [`MatSnackBarRef`](https://material.angular.io/components/snack-bar/overview)`<any>`<br/>
    Rase info message
    -   _message:_ `string`  - Text message or translation key for the message.
    -   _action:_ `string`  - (Optional) Action name
    -   _interpolateArgs:_ `any`  - (Optional) The interpolation parameters to add for the translation
    -   _showAction:_ `boolean`  - True if action should be visible, false if not. Default: true.
    -   **Returns** [`MatSnackBarRef`](https://material.angular.io/components/snack-bar/overview)`<any>` - 
-   **showWarning**(message: `string`, action?: `string`, interpolateArgs?: `any`, showAction: `boolean` = `true`): [`MatSnackBarRef`](https://material.angular.io/components/snack-bar/overview)`<any>`<br/>
    Rase warning message
    -   _message:_ `string`  - Text message or translation key for the message.
    -   _action:_ `string`  - (Optional) Action name
    -   _interpolateArgs:_ `any`  - (Optional) The interpolation parameters to add for the translation
    -   _showAction:_ `boolean`  - True if action should be visible, false if not. Default: true.
    -   **Returns** [`MatSnackBarRef`](https://material.angular.io/components/snack-bar/overview)`<any>` -

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

By providing a `decorativeIcon` property in the [`SnackBarData`](../../../lib/core/src/lib/snackbar-content/snack-bar-data.ts), it is possible to render a decorative
[`MaterialIcon`](https://material.angular.io/components/icon/overview#interactive-icons) to the left of the message.

```ts
import { NotificationService } from '@alfresco/adf-core';
import { MatSnackBarConfig } from '@angular/material/snackbar';

export class MyComponent implements OnInit {

    snackBarConfig: MatSnackBarConfig = new MatSnackBarConfig();
    
    constructor(private notificationService: NotificationService) {
    }

    ngOnInit() {
        this.snackBarConfig.data = { decorativeIcon: 'folder' };
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

#### Notification types

| Name | Description |
| ---- | ----------- |
| info | To notify messages. It will be displayed with an info icon next to it. |
| warn | To notify warning messages. It will be displayed with a warning icon next to it. |
| error | To notify errors. It will be displayed with an error icon next to it. |
| recursive | To notify recursive messages. If a message is prompt to duplicate an existing notification and you don't want to overload the [notification history component](../../core/components/notification-history.component.md) with the same message use the recursive type. I.e. notifications coming from an API call that are triggered every time a component is initialized. It will be displayed with an info icon next to it. |
