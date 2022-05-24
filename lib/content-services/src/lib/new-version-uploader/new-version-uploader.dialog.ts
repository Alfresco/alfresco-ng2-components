import { Node } from '@alfresco/js-api';
import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NewVersionUploaderDialogData } from './models/new-version-uploader.model';

@Component({
    selector: 'adf-new-version-uploader-dialog',
    templateUrl: './new-version-uploader.dialog.html',
    styleUrls: ['./new-version-uploader.dialog.scss']
})
export class NewVersionUploaderDialogComponent implements OnInit {

    @Output()
    uploadError = new EventEmitter<any>();

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: NewVersionUploaderDialogData,
        private dialogRef: MatDialogRef<NewVersionUploaderDialogComponent>
    ) { }

    ngOnInit(): void {
    }

    handleUpload(newFileVersion) {
        this.dialogRef.close({ action: 'upload', newVersion: newFileVersion.value.entry, currentVersion: this.data.node });
    }

    handleCancel() {
        this.dialogRef.close();
    }

    onUploadError(error) {
        this.uploadError.emit(error);
        this.dialogRef.close();
    }

    onViewingVersion(versionId: string) {
        this.dialogRef.close({ action: 'view', versionId });
    }

    refresh(node: Node) {
        this.dialogRef.close({ action: 'refresh', node });
    }

}
