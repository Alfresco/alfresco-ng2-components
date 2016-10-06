/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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

import { Component, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { FileModel } from '../models/file.model';
import { AlfrescoTranslationService } from 'ng2-alfresco-core';
import { UploadService } from '../services/upload.service';

/**
 * <file-uploading-dialog [filesUploadingList]="FileModel[]" ></file-uploading-dialog>
 *
 * This component is a hideable and minimizable wich contains the list of the uploading
 * files contained in the filesUploadingList.
 *
 * @InputParam {FileModel[]} filesUploadingList - list of the uploading files .
 *
 *
 * @returns {FileUploadingDialogComponent} .
 */
@Component({
    selector: 'file-uploading-dialog',
    moduleId: module.id,
    templateUrl: './file-uploading-dialog.component.html',
    styleUrls: ['./file-uploading-dialog.component.css'],
    host: {'[class.dialog-show]': 'toggleShowDialog'}
})
export class FileUploadingDialogComponent implements OnInit, OnDestroy {

    isDialogActive: boolean = false;

    filesUploadingList: FileModel [];

    totalCompleted: number = 0;

    private _isDialogMinimized: boolean = false;

    private listSubscription: any;
    private counterSubscription: any;

    constructor(private cd: ChangeDetectorRef,
                translate: AlfrescoTranslationService,
                private _uploaderService: UploadService) {
        translate.addTranslationFolder('./src');
    }

    ngOnInit() {
        if (this._uploaderService.filesUpload$) {
            this.listSubscription = this._uploaderService.filesUpload$.subscribe((fileList: FileModel[]) => {
                this.filesUploadingList = fileList;
                if (this.filesUploadingList.length > 0) {
                    this.isDialogActive = true;
                    this.cd.detectChanges();
                }
            });
        }
        if (this._uploaderService.totalCompleted$) {
            this.counterSubscription = this._uploaderService.totalCompleted$.subscribe((total: number) => {
                this.totalCompleted = total;
                this.cd.detectChanges();
            });
        }
    }

    /**
     * Display and hide the dialog component.
     */
    toggleShowDialog() {
        this.isDialogActive = !this.isDialogActive;
    }

    /**
     * Minimize and expand the dialog component.
     */
    toggleDialogMinimize() {
        this._isDialogMinimized = !this._isDialogMinimized;
    }

    ngOnDestroy() {
        this.listSubscription.unsubscribe();
        this.counterSubscription.unsubscribe();
        this.cd.detach();
    }
}
