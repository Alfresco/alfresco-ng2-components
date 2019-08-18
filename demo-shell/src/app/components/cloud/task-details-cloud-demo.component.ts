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

import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '@alfresco/adf-core';
import { TaskHeaderCloudComponent } from '@alfresco/adf-process-services-cloud';
import { PreviewService } from 'app/services/preview.service';

@Component({
    templateUrl: './task-details-cloud-demo.component.html',
    styleUrls: ['./task-details-cloud-demo.component.scss']
})
export class TaskDetailsCloudDemoComponent {

    @ViewChild('taskHeader')
    taskHeader: TaskHeaderCloudComponent;

    taskId: string;
    appName: string;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private notificationService: NotificationService,
        private previewService: PreviewService
        ) {
        this.route.params.subscribe((params) => {
            this.taskId = params.taskId;
        });
        this.route.parent.params.subscribe((params) => {
            this.appName = params.appName;
        });

    }

    isTaskValid(): boolean {
        return this.appName !== undefined && this.taskId !== undefined;
    }

    goBack() {
        this.router.navigate([`/cloud/${this.appName}/`]);
    }

    onTaskCompleted() {
        this.goBack();
    }

    onTaskClaimed() {
        this.taskHeader.ngOnInit();
    }

    onTaskUnclaimed() {
        this.taskHeader.ngOnInit();
    }

    onFormContentClicked(resourceClicked: any) {
        // this.router.navigate([`/cloud/${this.appName}/task-details/${this.taskId}/files/${resourceClicked.nodeId}/view`]);
        // this.previewService.showBlob(resourceClicked.name, resourceClicked.contentBlob);
        this.previewService.showResource(resourceClicked.nodeId);
    }

    onFormSaved() {
        this.notificationService.openSnackMessage('Task has been saved successfully');
    }
}
