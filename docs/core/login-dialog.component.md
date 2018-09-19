---
Added: v2.0.0
Status: Active
Last reviewed: 2018-04-18
---

# Content Node Selector component

Allows a user to perform a login via a dialog.

## Details

The [Login Dialog component](../core/login-dialog.component.md) allow you to perform a login via a dialog.

### Showing the dialog

Unlike most components, the Login Dialog Component is typically shown in a dialog box
rather than the main page and you are responsible for opening the dialog yourself. You can use the
[Angular Material Dialog](https://material.angular.io/components/dialog/overview) for this,
as shown in the usage example. ADF provides the [`LoginDialogComponentData`](../../lib/core/login/components/login-dialog-component-data.interface.ts) interface
to work with the Dialog's
[data option](https://material.angular.io/components/dialog/overview#sharing-data-with-the-dialog-component-):

```ts
export interface LoginDialogComponentData {
    title: string;
    actionName?: string;
    logged: Subject<any>;
}
```

The properties are described in the table below:

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| title | `string` | "" | Dialog title |
| actionName | `string` | "" | Text to appear on the dialog's main action button ("Login", "Access", etc) |
| logged | [`EventEmitter<any>`]|  | Event emitted when the login succeeds. |

If you don't want to manage the dialog yourself then it is easier to use the
[Login Dialog Panel component](login-dialog-panel.component.md), or the
methods of the [Login Dialog service](login-dialog.service.md), which create
the dialog for you.

### Usage example

```ts
import { MatDialog } from '@angular/material';
import { LoginDialogComponentData, LoginDialogComponent} from '@adf/core'
import { Subject } from 'rxjs/Subject';
 ...

constructor(dialog: MatDialog ... ) {}

openSelectorDialog() {
    data: LoginDialogComponentData = {
        title: "Perform a Login",
        actionName: "Access",
        logged: new Subject<any>()
    };

    this.dialog.open(
        LoginDialogComponent,
        {
            data, panelClass: 'adf-content-node-selector-dialog',
            width: '630px'
        }
    );

    data.logged.subscribe(() => {
        // Action after being logged in...
    }, 
    (error)=>{
        //your error handling
    }, 
    ()=>{
        //action called when an action or cancel is clicked on the dialog
        this.dialog.closeAll();
    });
}
```

All the results will be streamed to the logged [subject](http://reactivex.io/rxjs/manual/overview.html#subject) present in the [`LoginDialogComponentData`](../../lib/core/login/components/login-dialog-component-data.interface.ts) object passed to the dialog.
When the dialog action is selected by clicking, the `data.logged` stream will be completed.
