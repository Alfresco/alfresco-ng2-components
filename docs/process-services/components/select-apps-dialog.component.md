---
Title: Select App Component
Added: v2.0.0
Status: Active
Last reviewed: 2019-01-14
---

# [Select App Component](../../../lib/process-services/src/lib/app-list/select-apps-dialog.component.ts "Defined in select-apps-dialog.component.ts")

Shows all available apps and returns the selected app.

![select-apps-dialog](../../docassets/images/select-apps-dialog.png)

## Basic Usage

```ts
import { SelectAppsDialogComponent } from '@alfresco/adf-process-services';

constructor(private dialog: MatDialog) {
}
   
startSelectDialog(){
   const dialogRef = this.dialog.open(SelectAppsDialogComponent, {
       width: '630px',
       panelClass: 'adf-version-manager-dialog'
   });
   
   dialogRef.afterClosed().subscribe(selectedProcess => {
       this.processId = selectedProcess.id;
   });
}
```

## See Also

-   [Start process component](start-process.component.md)
