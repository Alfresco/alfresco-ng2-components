# Notification Service

Shows a notification message with optional feedback.

![Notification Service screenshot](docassets/images/NotiService.png)

## Methods

-   `openSnackMessage(message: string, millisecondsDuration?: number): MatSnackBarRef<any>`  
    Opens a snackbar notification to show a message.  
    -   `message` - The message to show
    -   `millisecondsDuration` - (Optional) Time before notification disappears after being shown
-   `openSnackMessageAction(message: string, action: string, millisecondsDuration?: number): MatSnackBarRef<any>`  
    Opens a snackbar notification with a message and a response button.  
    -   `message` - The message to show
    -   `action` - Caption for the response button
    -   `millisecondsDuration` - (Optional) Time before the notification disappears (unless the button is clicked)

## Details

The Notification Service is implemented on top of the Angular Material Design snackbar.
Use this service to show a notification message, and optionally get feedback from it.

```ts
import { NotificationService } from '@alfresco/adf-core';

export class MyComponent implements OnInit {

    constructor(private notificationService: NotificationService) {
    }

    ngOnInit() {
          this.notificationService.openSnackMessage('test', 200000).afterDismissed().subscribe(() => {
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
         this.notificationService.openSnackMessageAction('Do you want to report this issue?', 'send', 200000).afterDismissed().subscribe(() => {
                console.log('The snack-bar was dismissed');
            });
    }
}
```
