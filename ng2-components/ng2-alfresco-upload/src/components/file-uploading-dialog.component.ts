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

import { Component, Input, ChangeDetectorRef, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { FileModel } from '../models/file.model';
import { AlfrescoTranslationService } from 'ng2-alfresco-core';
import { UploadService } from '../services/upload.service';
import { FileUploadCompleteEvent } from '../events/file.event';

@Component({
    selector: 'file-uploading-dialog',
    changeDetection: ChangeDetectionStrategy.OnPush,
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
        cd.detach();
    }

    ngOnInit() {
        this.listSubscription = this.uploadService.queueChanged.subscribe((fileList: FileModel[]) => {
            this.filesUploadingList = fileList;
            if (this.filesUploadingList.length > 0) {
                this.isDialogActive = true;
                this.cd.detectChanges();
            }
        });

        this.counterSubscription = this.uploadService.fileUploadComplete.subscribe((e: FileUploadCompleteEvent) => {
            this.totalCompleted = e.totalComplete;
            if (this.totalCompleted > 1) {
                this.totalCompletedMsg = 'FILE_UPLOAD.MESSAGES.COMPLETED';
            }
            this.cd.detectChanges();
        });

        this.uploadService.fileUpload.subscribe(e => {
            console.log(e);
            this.cd.detectChanges();
        });
    }

    /**
     * Toggle dialog visibility state.
     */
    toggleVisible(): void {
        this.isDialogActive = !this.isDialogActive;
        this.cd.detectChanges();
    }

    /**
     * Toggle dialog minimized state.
     */
    toggleMinimized(): void {
        this.isDialogMinimized = !this.isDialogMinimized;
        this.cd.detectChanges();
    }

    ngOnDestroy() {
        this.listSubscription.unsubscribe();
        this.counterSubscription.unsubscribe();
    }
}
