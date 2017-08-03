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

import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AlfrescoTranslationService, FileModel, FileUploadCompleteEvent, UploadService } from 'ng2-alfresco-core';
import { Subscription } from 'rxjs/Rx';

@Component({
    selector: 'adf-file-uploading-dialog, file-uploading-dialog',
    templateUrl: './file-uploading-dialog.component.html',
    styleUrls: ['./file-uploading-dialog.component.scss']
})
export class FileUploadingDialogComponent implements OnInit, OnDestroy {
    @Input()
    position: string = 'right';

    filesUploadingList: FileModel[] = [];
    isDialogActive: boolean = false;
    totalCompleted: number = 0;
    isDialogMinimized: boolean = false;
    uploadFilesCompleted: boolean = false;

    private listSubscription: Subscription;
    private counterSubscription: Subscription;
    private fileUploadSubscription: Subscription;

    constructor(
        translateService: AlfrescoTranslationService,
        private uploadService: UploadService,
        private changeDetecor: ChangeDetectorRef) {

        if (translateService) {
            translateService.addTranslationFolder('ng2-alfresco-upload', 'assets/ng2-alfresco-upload');
        }
    }

    ngOnInit() {
        this.listSubscription = this.uploadService
            .queueChanged.subscribe((fileList: FileModel[]) => {
                this.filesUploadingList = fileList;

                if (this.filesUploadingList.length > 0) {
                    this.isDialogActive = true;
                }
        });

        this.counterSubscription = this.uploadService
            .fileUploadComplete.subscribe((event: FileUploadCompleteEvent) => {
                this.totalCompleted = event.totalComplete;
            });

        this.fileUploadSubscription = this.uploadService
            .fileUpload.subscribe(() => this.changeDetecor.detectChanges());
    }

    /**
     * Toggle dialog minimized state.
     */
    toggleMinimized(): void {
        this.isDialogMinimized = !this.isDialogMinimized;
        this.changeDetecor.detectChanges();
    }

    /**
     * Dismiss dialog
     */
    close(): void {
        this.isDialogActive = false;
        this.isDialogMinimized = false;
        this.uploadService.clearQueue();
        this.changeDetecor.detectChanges();
    }

    ngOnDestroy() {
        this.uploadService.clearQueue();
        this.listSubscription.unsubscribe();
        this.counterSubscription.unsubscribe();
        this.fileUploadSubscription.unsubscribe();
    }
}
