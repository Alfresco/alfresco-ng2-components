---
Title: Dialog component
Added: v6.10.0
Status: Active
Last reviewed: 2024-05-24
---

# [Dialog component](../../../lib/core/src/lib/dialogs/dialog/dialog.component.ts "Defined in dialog.component.ts")

Dialog wrapper styled according to a consistent design system.

## Dialog views

### Large size and Medium

Looks the same but have different sizes.
Max-width for Large dialog is `1075px`;
Max-width for Medium dialog is `778px`;

![Large and Medium dialog component](../../docassets/images/adf-dialog.png)

### Alert dialogs

Standard:

![Standard alert dialog component](../../docassets/images/adf-dialog-alert-standart.png)

With icon:

![Alert dialog component with icon](../../docassets/images/adf-dialog-alert-with-icon.png)

### Dialog with additional buttons

![Dialog with additional buttons](../../docassets/images/adf-dialog-with-additional-buttons.png)

## Basic Usage 

```html

<ng-template #contentDialogTemplate>
  Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique nihil, natus corrupti asperiores voluptas, incidunt veritatis.
</ng-template>

<ng-template #actionsDialogTemplate>
  <button mat-button>
    Reset
  </button>

  <button mat-button>
    Clean
  </button>
</ng-template>
```

```ts
@ViewChild('contentDialogTemplate') contentDialogTemplate: TemplateRef<any>;
@ViewChild('actionsDialogTemplate') actionsDialogTemplate: TemplateRef<any>;

constructor(private dialog: MatDialog) {}

//...

function openDialog() {
    const data: DialogData = {
        title: 'Dialog title',
        dialogSize: DialogSize.Alert,
        isConfirmButtonDisabled$: of(false),
        contentTemplate: this.contentDialogTemplate, // or  contentComponent: this.contentDialogTemplate
        additionalActionButtons: [{
            title: 'Reset',
            class: 'reset-button',
            onClick: () => {
                this.isConfirmButtonDisabled$.next(true);
            }
        }] // or actionsTemplate: this.actionsDialogTemplate
    };

    this.dialog.open(DialogComponent, { data }, width: '600px');
}
```

To use dialog with provided component as a content `componentData` should be passed as data parameter. Inside component `DIALOG_COMPONENT_DATA` should be injected.

```ts
//...

function openDialog() {
    const data: DialogData = {
        title: 'Dialog title',
        contentComponent: ExampleDialogComponent,
        componentData: { nodeId: 'nodeId', name: 'node name' } // any data can be passed
        dataOnConfirm$: of({ nodeId, data: {} })
    };

    const dialogInstance = this.dialog.open(DialogComponent, { data });

    dialogInstance.afterClosed().subscribe((data) => data) // data = { nodeId, data: {} }
}
```

in `ExampleDialogComponent`:
```ts
export class ManageHoldsDialogComponent {
    inputs = inject(DIALOG_COMPONENT_DATA); // inputs = { nodeId: 'nodeId',  name: 'node name' }
}
```


Note that **fixed width** may be provided which will work correctly on smaller screens. But don't specify any values ​​for **height**, as this may break the scrollable content and hide the buttons.
To display the design well, it is necessary to provide no more than 2 additional buttons.

## Details

This component lets the user reuse styled dialog wrapper. Use the
Angular [`MatDialog`](https://material.angular.io/components/dialog/overview)
service to open the dialog, as shown in the example, and pass a `data` object
with properties.

## See also

- [Dialog Data Interface](../interfaces/dialog.interface.md)
- [Dialog Model](../models/dialog.model.md)
- [AdditionalDialogActionButton Interface](../interfaces/additional-dialog-action-button.md)
