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

import { Component, ViewEncapsulation, Input } from '@angular/core';
import { AppConfigService, UserPreferencesService } from '@alfresco/adf-core';
import { TaskQueryCloudRequestModel } from '../models/filter-cloud-model';
import { TaskListCloudService } from '../services/task-list-cloud.service';
import { BaseTaskListCloudComponent } from './base-task-list-cloud.component';

@Component({
    selector: 'adf-cloud-task-list',
    templateUrl: './base-task-list-cloud.component.html',
    styleUrls: ['./base-task-list-cloud.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TaskListCloudComponent extends BaseTaskListCloudComponent {

    static PRESET_KEY = 'adf-cloud-task-list.presets';

    /**
     * The assignee of the process. Possible values are: "assignee" (the current user is the assignee),
     * "candidate" (the current user is a task candidate", "group_x" (the task is assigned to a group
     * where the current user is a member, no value (the current user is involved).
     */
    @Input()
    assignee: string = '';

    /** Filter the tasks. Display only tasks created on the supplied date. */
    @Input()
    createdDate: string = '';

    /** Filter the tasks. Display only tasks with dueDate equal to the supplied date. */
    @Input()
    dueDate: string = '';

    /** Filter the tasks. Display only tasks with lastModifiedFrom equal to the supplied date. */
    @Input()
    lastModifiedFrom: string = '';

    /** Filter the tasks. Display only tasks with lastModifiedTo equal to the supplied date. */
    @Input()
    lastModifiedTo: string = '';

    /** Filter the tasks. Display only tasks with dueDate greater or equal than the supplied date. */
    @Input()
    dueDateFrom: string = '';

    /** Filter the tasks. Display only tasks with dueDate less or equal to the supplied date. */
    @Input()
    dueDateTo: string = '';

    /** Filter the tasks. Display only tasks with id equal to the supplied value. */
    @Input()
    id: string = '';

    /** Filter the tasks. Display only tasks with the supplied name. */
    @Input()
    name: string = '';

    /** Filter the tasks. Display only tasks with parentTaskId equal to the supplied value. */
    @Input()
    parentTaskId: string = '';

    /** Filter the tasks. Display only tasks with processDefinitionName equal to the supplied value. */
    @Input()
    processDefinitionName: string = '';

    /** Filter the tasks. Display only tasks with processDefinitionId equal to the supplied value. */
    @Input()
    processDefinitionId: string = '';

    /** Filter the tasks. Display only tasks with processInstanceId equal to the supplied value. */
    @Input()
    processInstanceId: string = '';

    /** Filter the tasks. Display only tasks with status equal to the supplied value. */
    @Input()
    status: string = '';

    /** Filter the tasks. Display only tasks with owner equal to the supplied value. */
    @Input()
    owner: string = '';

    /** Filter the tasks. Display only tasks with priority equal to the supplied value. */
    @Input()
    priority: number;

    /** Filter the tasks. Display only tasks with createdBy equal to the supplied value. */
    @Input()
    completedBy: number;

    /** Filter the tasks. Display only the tasks that belong to a process in case is false or tasks that doesn't belong to a process in case of true. */
    @Input()
    standalone: boolean = false;

    /** Filter the tasks. Display only tasks with completedDate equal to the supplied date. */
    @Input()
    completedDate: string = '';

    /** Filter the tasks. Display only tasks with completedFrom equal to the supplied date. */
    @Input()
    completedFrom: string = '';

    /** Filter the tasks. Display only tasks with completedTo equal to the supplied date. */
    @Input()
    completedTo: string = '';

    constructor(private taskListCloudService: TaskListCloudService,
                appConfigService: AppConfigService,
                userPreferences: UserPreferencesService) {
        super(appConfigService, userPreferences, TaskListCloudComponent.PRESET_KEY);
    }

    load(requestNode: TaskQueryCloudRequestModel) {
        this.isLoading = true;
        this.taskListCloudService.getTaskByRequest(<TaskQueryCloudRequestModel> requestNode).subscribe(
            (tasks) => {
                this.rows = tasks.list.entries;
                this.success.emit(tasks);
                this.isLoading = false;
                this.pagination.next(tasks.list.pagination);
            }, (error) => {
                this.error.emit(error);
                this.isLoading = false;
            });
    }

    createRequestNode(): TaskQueryCloudRequestModel {
        const requestNode = {
            appName: this.appName,
            assignee: this.assignee,
            id: this.id,
            name: this.name,
            parentTaskId: this.parentTaskId,
            processDefinitionName: this.processDefinitionName,
            processDefinitionId: this.processDefinitionId,
            processInstanceId: this.processInstanceId,
            owner: this.owner,
            priority: this.priority,
            lastModifiedFrom: this.lastModifiedFrom,
            lastModifiedTo: this.lastModifiedTo,
            dueDateFrom: this.dueDateFrom,
            dueDateTo: this.dueDateTo,
            status: this.status,
            dueDate: this.dueDate,
            createdDate: this.createdDate,
            maxItems: this.size,
            skipCount: this.skipCount,
            sorting: this.sorting,
            standalone: this.standalone,
            completedBy: this.completedBy,
            completedFrom: this.completedFrom,
            completedTo: this.completedTo,
            completedDate: this.completedDate
        };
        return new TaskQueryCloudRequestModel(requestNode);
    }
}
