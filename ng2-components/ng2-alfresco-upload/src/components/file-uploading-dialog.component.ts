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

import { Component, Input, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { FileModel } from '../models/file.model';
import { AlfrescoTranslationService } from 'ng2-alfresco-core';
import { UploadService } from '../services/upload.service';

/**
 * <file-uploading-dialog [filesUploadingList]="FileModel[]"></file-uploading-dialog>
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
    templateUrl: './file-uploading-dialog.component.html',
    styleUrls: ['./file-uploading-dialog.component.css']
})
export class FileUploadingDialogComponent implements OnInit, OnDestroy {

    @Input()
    filesUploadingList: FileModel [];

    isDialogActive: boolean = false;
    totalCompleted: number = 0;
    totalCompletedMsg: string = 'FILE_UPLOAD.MESSAGES.SINGLE_COMPLETED';
    isDialogMinimized: boolean = false;

    private listSubscription: any;
    private counterSubscription: any;

    constructor(private cd: ChangeDetectorRef,
                translateService: AlfrescoTranslationService,
                private uploadService: UploadService) {
        if (translateService) {
            translateService.addTranslationFolder('ng2-alfresco-upload', 'node_modules/ng2-alfresco-upload/src');
        }
    }

    ngOnInit() {
        if (this.uploadService.filesUpload$) {
            this.listSubscription = this.uploadService.filesUpload$.subscribe((fileList: FileModel[]) => {
                this.filesUploadingList = fileList;
                if (this.filesUploadingList.length > 0) {
                    this.isDialogActive = true;
                    this.cd.detectChanges();
                }
            });
        }
        if (this.uploadService.totalCompleted$) {
            this.counterSubscription = this.uploadService.totalCompleted$.subscribe((total: number) => {
                this.totalCompleted = total;
                if (this.totalCompleted > 1) {
                    this.totalCompletedMsg = 'FILE_UPLOAD.MESSAGES.COMPLETED';
                }
                this.cd.detectChanges();
            });
        }
    }

    /**
     * Toggle dialog visibility state.
     */
    toggleVisible(): void {
        this.isDialogActive = !this.isDialogActive;
    }

    /**
     * Toggle dialog minimized state.
     */
    toggleMinimized(): void {
        this.isDialogMinimized = !this.isDialogMinimized;
    }

    ngOnDestroy() {
        this.listSubscription.unsubscribe();
        this.counterSubscription.unsubscribe();
        this.cd.detach();
    }
}
