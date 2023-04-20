/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Node } from '@alfresco/js-api';
import { Component, EventEmitter, Inject, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NewVersionUploaderDialogData, NewVersionUploaderData, NewVersionUploaderDataAction } from './models';

@Component({
    selector: 'adf-new-version-uploader-dialog',
    templateUrl: './new-version-uploader.dialog.html',
    styleUrls: ['./new-version-uploader.dialog.scss'],
    encapsulation: ViewEncapsulation.None
})
export class NewVersionUploaderDialogComponent implements OnInit {

    /**
     * Dialog title to show into the header.
     * If data.title is not provided, a default title is set
     * */
    title: string;

    /** Emitted when an action is done. */
    @Output()
    dialogAction = new EventEmitter<NewVersionUploaderData>();

    /** Emitted when an error occurs. */
    @Output()
    uploadError = new EventEmitter<any>();

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: NewVersionUploaderDialogData,
        private dialogRef: MatDialogRef<NewVersionUploaderDialogComponent>
    ) { }

    ngOnInit(): void {
        this.setDialogTitle();
    }

    private setDialogTitle() {
        if (!this.data.title) {
            this.title = this.data.showVersionsOnly ? 'ADF-NEW-VERSION-UPLOADER.DIALOG_LIST.TITLE' : 'ADF-NEW-VERSION-UPLOADER.DIALOG_UPLOAD.TITLE';
        } else {
            this.title = this.data.title;
        }
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
