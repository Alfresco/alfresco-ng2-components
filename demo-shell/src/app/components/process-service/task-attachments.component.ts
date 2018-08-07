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

import { Component, Input, OnChanges, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { TaskListService, TaskAttachmentListComponent, TaskDetailsModel, TaskUploadService } from '@alfresco/adf-process-services';
import { UploadService, AlfrescoApiService, AppConfigService } from '@alfresco/adf-core';
import { PreviewService } from '../../services/preview.service';
import { Subscription } from 'rxjs';

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

    @ViewChild('taskAttachList')
    taskAttachList: TaskAttachmentListComponent;

    @Input()
    taskId: string;

    taskDetails: any;

    private subscriptions: Subscription[] = [];

    constructor(
        private uploadService: UploadService,
        private activitiTaskList: TaskListService,
        private preview: PreviewService) {}

    ngOnInit() {
        this.subscriptions.push(
            this.uploadService.fileUploadComplete.subscribe(
                value => this.onFileUploadComplete(value.data)
            )
        );
    }

    ngOnChanges() {
        if (this.taskId) {
            this.activitiTaskList.getTaskDetails(this.taskId)
                .subscribe((taskDetails: TaskDetailsModel) => {
                    this.taskDetails = taskDetails;
                });
        }
    }

    ngOnDestroy() {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
        this.subscriptions = [];
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
