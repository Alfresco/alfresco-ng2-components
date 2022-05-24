import { Node } from '@alfresco/js-api';
import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NewVersionUploaderDialogData, NewVersionUploaderData, NewVersionUploaderDataAction } from './models';

@Component({
    selector: 'adf-new-version-uploader-dialog',
    templateUrl: './new-version-uploader.dialog.html',
    styleUrls: ['./new-version-uploader.dialog.scss']
})
export class NewVersionUploaderDialogComponent implements OnInit {

    @Output()
    dialogAction = new EventEmitter<NewVersionUploaderData>();

    @Output()
    uploadError = new EventEmitter<any>();

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: NewVersionUploaderDialogData,
        private dialogRef: MatDialogRef<NewVersionUploaderDialogComponent>
    ) { }

    ngOnInit(): void {
    }

    handleUpload(newFileVersion) {
        this.dialogAction.emit({ action: NewVersionUploaderDataAction.upload, newVersion: newFileVersion, currentVersion: this.data.node });
        this.dialogRef.close();
    }

    handleCancel() {
        this.dialogRef.close();
    }

    onUploadError(error) {
        this.uploadError.emit(error);
    }

    onViewingVersion(versionId: string) {
        this.dialogAction.emit({ action: NewVersionUploaderDataAction.view, versionId });
    }

    refresh(node: Node) {
        this.dialogAction.emit({ action: NewVersionUploaderDataAction.refresh, node });
    }

}
