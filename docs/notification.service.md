# Notification Service

Shows a notification message with optional feedback.

<!-- markdown-toc start - Don't edit this section.  npm run toc to generate it-->

<!-- toc -->

<!-- tocstop -->

<!-- markdown-toc end -->

## Details

The Notification Service is implemented on top of the Angular 2 Material Design snackbar.
Use this service to show a notification message, and optionally get feedback from it.

```ts
import { NotificationService } from 'ng2-alfresco-core';

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
import { NotificationService } from 'ng2-alfresco-core';

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
