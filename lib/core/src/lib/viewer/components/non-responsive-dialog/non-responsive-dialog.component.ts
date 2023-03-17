import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { NonResponsivePreviewActionsEnum } from '../../models/non-responsive-preview-actions.enum';

@Component({
    selector: 'adf-non-responsive-dialog',
    templateUrl: './non-responsive-dialog.component.html',
    styleUrls: ['./non-responsive-dialog.component.scss']
})
export class NonResponsiveDialogComponent {

    constructor(private dialogRef: MatDialogRef<NonResponsiveDialogComponent>) {}

    onWait() {
        this.dialogRef.close(NonResponsivePreviewActionsEnum.WAIT);
    }

    onDownload() {
        this.dialogRef.close(NonResponsivePreviewActionsEnum.DOWNLOAD);
    }
}
