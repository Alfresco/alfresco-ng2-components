/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

import { Component, Input, ViewEncapsulation, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Node } from '@alfresco/js-api';
import { ContentService, FileUploadEvent, UploadService } from '@alfresco/adf-core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'adf-version-upload',
    templateUrl: './version-upload.component.html',
    styleUrls: ['./version-upload.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: { 'class': 'adf-version-upload' }
})
export class VersionUploadComponent implements OnInit, OnDestroy {

    semanticVersion: string = 'minor';
    comment: string;
    uploadVersion: boolean = false;
    disabled: boolean = false;
    onDestroy$ = new Subject();

    /** The target node. */
    @Input()
    node: Node;

    /** New file for updating current version. */
    @Input()
    newFileVersion: File;

    /** Toggles showing/hiding upload button. */
    @Input()
    showUploadButton: boolean = true;

    /** Toggles showing/hiding of cancel button. */
    @Input()
    showCancelButton: boolean = true;

    /** Emitted when the file is uploaded successfully. */
    @Output()
    success = new EventEmitter();

    /** Emitted when an error occurs. */
    @Output()
    error = new EventEmitter();

    /** Emitted when an cancelling during upload. */
    @Output()
    cancel = new EventEmitter();

    /** Emitted when the version is changed. */
    @Output()
    versionChanged = new EventEmitter<boolean>();

    /** Emitted when the comment is changed. */
    @Output()
    commentChanged = new EventEmitter<string>();

    /** Emitted when the upload starts */
    @Output()
    uploadStarting = new EventEmitter<FileUploadEvent>();

    constructor(private contentService: ContentService, private uploadService: UploadService) {
    }

    ngOnInit() {
        this.uploadService.fileUploadStarting
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((event: FileUploadEvent) => {
                this.disabled = true;
                this.uploadStarting.emit(event);
            });
    }

    canUpload(): boolean {
        return this.contentService.hasAllowableOperations(this.node, 'update') && !this.disabled;
    }

    isMajorVersion(): boolean {
        return this.semanticVersion !== 'minor';
    }

    cancelUpload() {
        this.disabled = false;
        this.cancel.emit();
    }

    onVersionChange() {
        this.versionChanged.emit(this.isMajorVersion());
    }

    onCommentChange() {
        this.commentChanged.emit(this.comment);
    }

    onSuccess(event: any) {
        this.disabled = false;
        this.success.emit(event);
    }

    onError(event: any) {
        this.disabled = false;
        this.error.emit(event);
    }

    ngOnDestroy() {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }

}
