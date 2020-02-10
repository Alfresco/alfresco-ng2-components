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

import { Component, Input, OnChanges, OnInit, ViewChild, OnDestroy } from '@angular/core';
import {
    TaskListService,
    TaskAttachmentListComponent,
    TaskUploadService,
    TaskDetailsModel
} from '@alfresco/adf-process-services';
import { UploadService, AlfrescoApiService, AppConfigService } from '@alfresco/adf-core';
import { PreviewService } from '../../services/preview.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export function taskUploadServiceFactory(api: AlfrescoApiService, config: AppConfigService) {
    return new TaskUploadService(api, config);
}

@Component({
    selector: 'app-task-attachments',
    templateUrl: './task-attachments.component.html',
    styleUrls: ['./task-attachments.component.css'],
    providers: [
        {
            provide: UploadService,
            useFactory: (taskUploadServiceFactory),
            deps: [AlfrescoApiService, AppConfigService]
        }
    ]
})

export class TaskAttachmentsComponent implements OnInit, OnChanges, OnDestroy {

    @ViewChild('taskAttachList', { static: false })
    taskAttachList: TaskAttachmentListComponent;

    @Input()
    taskId: string;

    taskDetails: TaskDetailsModel;

    private onDestroy$ = new Subject<boolean>();

    constructor(
        private uploadService: UploadService,
        private activitiTaskList: TaskListService,
        private preview: PreviewService) {
    }

    ngOnInit() {
        this.uploadService.fileUploadComplete
        .pipe(takeUntil(this.onDestroy$))
        .subscribe(event => this.onFileUploadComplete(event.data));
    }

    ngOnChanges() {
        if (this.taskId) {
            this.activitiTaskList
                .getTaskDetails(this.taskId)
                .subscribe(taskDetails => this.taskDetails = taskDetails);
        }
    }

    ngOnDestroy() {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }

    onFileUploadComplete(content: any) {
        this.taskAttachList.add(content);
    }

    onAttachmentClick(content: any): void {
        this.preview.showBlob(content.name, content.contentBlob);
    }

    isCompletedTask(): boolean {
        return this.taskDetails && this.taskDetails.endDate !== undefined && this.taskDetails.endDate !== null;
    }

}
