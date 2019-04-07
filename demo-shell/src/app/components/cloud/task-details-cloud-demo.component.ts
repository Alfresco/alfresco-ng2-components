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

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskDetailsCloudModel, TaskCloudService, UploadCloudWidgetComponent } from '@alfresco/adf-process-services-cloud';
import { NotificationService, FormRenderingService } from '@alfresco/adf-core';

@Component({
    templateUrl: './task-details-cloud-demo.component.html',
    styleUrls: ['./task-details-cloud-demo.component.scss']
})
export class TaskDetailsCloudDemoComponent implements OnInit {

    taskDetails: TaskDetailsCloudModel;
    taskId: string;
    appName: string;
    readOnly = false;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private formRenderingService: FormRenderingService,
        private taskCloudService: TaskCloudService,
        private notificationService: NotificationService
        ) {
        this.route.params.subscribe((params) => {
            this.taskId = params.taskId;
        });
        this.route.parent.params.subscribe((params) => {
            this.appName = params.appName;
        });
        this.formRenderingService.setComponentTypeResolver('upload', () => UploadCloudWidgetComponent, true);

    }

    ngOnInit() {
        this.loadTaskDetailsById(this.appName, this.taskId);
    }

    loadTaskDetailsById(appName: string, taskId: string) {
        this.taskCloudService.getTaskById(appName, taskId).subscribe(
            (taskDetails: TaskDetailsCloudModel ) => {
                this.taskDetails = taskDetails;
            });
    }

    isTaskValid(): boolean {
        return this.appName !== undefined && this.taskId !== undefined;
    }

    canCompleteTask(): boolean {
        return this.taskDetails && !this.taskDetails.formKey && this.taskCloudService.canCompleteTask(this.taskDetails);
    }

    canClaimTask(): boolean {
        return this.taskDetails && this.taskCloudService.canClaimTask(this.taskDetails);
    }

    canUnClaimTask(): boolean {
        return this.taskDetails && this.taskCloudService.canUnclaimTask(this.taskDetails);
    }

    hasTaskForm(): boolean {
        return this.taskDetails && this.taskDetails.formKey;
    }

    goBack() {
        this.router.navigate([`/cloud/${this.appName}/`]);
    }

    onCompletedTask() {
        this.goBack();
    }

    onUnclaimTask() {
        this.goBack();
    }

    onClaimTask() {
        this.goBack();
    }

    onTaskCompleted() {
        this.goBack();
    }

    onFormSaved() {
        this.notificationService.openSnackMessage('Task has been saved successfully');
    }
}
