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
import { TaskDetailsCloudModel, TaskCloudService } from '@alfresco/adf-process-services-cloud';

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
        private taskCloudService: TaskCloudService
        ) {
        this.route.params.subscribe((params) => {
            this.taskId = params.taskId;
        });
        this.route.parent.params.subscribe((params) => {
            this.appName = params.appName;
        });
    }

    ngOnInit() {
        this.loadTaskDetailsById(this.appName, this.taskId);
    }

    loadTaskDetailsById(appName: string, taskId: string): any {
        this.taskCloudService.getTaskById(appName, taskId).subscribe(
            (taskDetails) => {
                this.taskDetails = taskDetails;
            });
    }

    isTaskValid() {
        return this.appName && this.taskId;
    }

    canCompleteTask() {
        return this.taskDetails && this.taskCloudService.canCompleteTask(this.taskDetails);
    }

    canClaimTask() {
        return this.taskDetails && this.taskCloudService.canClaimTask(this.taskDetails);
    }

    canUnClaimTask() {
        return this.taskDetails && this.taskCloudService.canUnclaimTask(this.taskDetails);
    }

    goBack() {
        this.router.navigate([`/cloud/${this.appName}/`]);
    }

    onCompletedTask(evt: any) {
        this.goBack();
    }

    onUnclaimTask(evt: any) {
        this.goBack();
    }

    onClaimTask(evt: any) {
        this.goBack();
    }
}
