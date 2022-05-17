import { MinimalNodeEntryEntity, NodeChildAssociation, Version } from '@alfresco/js-api';
import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface NewVersionUploaderDialogData {
    title?: string;
    node: MinimalNodeEntryEntity;
    file?: File;
    currentVersion?: Version;
    showVersionsOnly?: boolean;
}

export interface NewVersionUploaderData {
    newVersion: Node;
    currentVersion: NodeChildAssociation;
}
@Component({
    selector: 'adf-new-version-uploader-dialog',
    templateUrl: './new-version-uploader.dialog.html',
    styleUrls: ['./new-version-uploader.dialog.scss']
})
export class NewVersionUploaderDialogComponent implements OnInit {

    @Output()
    uploadedNewVersion = new EventEmitter<NewVersionUploaderData>();

    @Output()
    uploadError = new EventEmitter<any>();

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: NewVersionUploaderDialogData,
        private dialogRef: MatDialogRef<NewVersionUploaderDialogComponent>
    ) { }

    ngOnInit(): void {
    }

    handleUpload(newFileVersion) {
        this.uploadedNewVersion.emit({ newVersion: newFileVersion.value.entry, currentVersion: this.data.node });
        this.dialogRef.close();
    }

    handleCancel() {
        this.dialogRef.close();
    }

    onUploadError(error) {
        this.uploadError.emit(error);
        this.dialogRef.close();
    }

    onViewingVersion(event) {
        console.log(`%conViewingVersion => ${event}`);
    }

    refresh(event) {
        console.log(`%crefresh => ${event}`);
    }

}
