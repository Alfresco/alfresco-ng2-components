/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Injectable } from '@angular/core';
import { CardViewArrayItem } from '@alfresco/adf-core';
import { from, Observable, of, Subject, throwError } from 'rxjs';
import { DEFAULT_TASK_PRIORITIES, TaskPriorityOption } from '../models/task.model';
import { TaskDetailsCloudModel, TASK_ASSIGNED_STATE, TASK_CREATED_STATE } from '../models/task-details-cloud.model';
import { taskDetailsContainer } from '../task-header/mocks/task-details-cloud.mock';
import { ProcessDefinitionCloud } from '../../models/process-definition-cloud.model';
import { TaskCloudService } from '@alfresco/adf-process-services-cloud';
import { AdfHttpClient } from '@alfresco/adf-core/api';

@Injectable()
export class TaskCloudServiceMock extends TaskCloudService {
    currentUserMock = 'AssignedTaskUser';
    dataChangesDetected$ = new Subject();

    constructor(adfHttpClient: AdfHttpClient) {
        super(adfHttpClient);
    }

    getTaskById(_appName: string, taskId: string): Observable<TaskDetailsCloudModel> {
        return of(taskDetailsContainer[taskId]);
    }

    getCandidateUsers(_appName: string, taskId: string): Observable<string[]> {
        if (taskId === 'mock-no-candidate-users') {
            return of([]);
        }

        return of(['user1', 'user2']);
    }

    getCandidateGroups(_appName: string, taskId: string): Observable<string[]> {
        if (taskId === 'mock-no-candidate-groups') {
            return of([]);
        }

        return of(['group1', 'group2']);
    }

    getPriorityLabel(priority: number): string {
        const priorityItem = this.priorities.find((item) => item.value === priority.toString()) || this.priorities[0];
        return priorityItem.label;
    }

    get priorities(): TaskPriorityOption[] {
        return this.appConfigService.get('adf-cloud-priority-values') || DEFAULT_TASK_PRIORITIES;
    }

    isTaskEditable(taskDetails: TaskDetailsCloudModel) {
        return taskDetails.status === TASK_ASSIGNED_STATE && this.isAssignedToMe(taskDetails.assignee);
    }

    isAssigneePropertyClickable(
        taskDetails: TaskDetailsCloudModel,
        candidateUsers: CardViewArrayItem[],
        candidateGroups: CardViewArrayItem[]
    ): boolean {
        let isClickable = false;
        const states = [TASK_ASSIGNED_STATE];
        if (candidateUsers?.length || candidateGroups?.length) {
            isClickable = states.includes(taskDetails.status);
        }
        return isClickable;
    }

    updateTask(_appName: string, taskId: string): Observable<TaskDetailsCloudModel> {
        return of(taskDetailsContainer[taskId]);
    }

    canCompleteTask(taskDetails: TaskDetailsCloudModel): boolean {
        return taskDetails && taskDetails.status === TASK_ASSIGNED_STATE && this.isAssignedToMe(taskDetails.assignee);
    }

    canClaimTask(taskDetails: TaskDetailsCloudModel): boolean {
        return taskDetails && taskDetails.status === TASK_CREATED_STATE;
    }

    protected isAssignedToMe(assignee: string): boolean {
        return assignee === this.currentUserMock;
    }

    completeTask(appName: string, taskId: string): Observable<TaskDetailsCloudModel> {
        if ((appName || appName === '') && taskId) {
            window.alert('Complete task mock');

            return from([]);
        } else {
            return throwError(() => new Error('AppName/TaskId not configured'));
        }
    }

    canUnclaimTask(taskDetails: TaskDetailsCloudModel): boolean {
        const currentUser = this.currentUserMock;
        return taskDetails && taskDetails.status === TASK_ASSIGNED_STATE && taskDetails.assignee === currentUser;
    }

    claimTask(appName: string, taskId: string): Observable<TaskDetailsCloudModel> {
        if ((appName || appName === '') && taskId) {
            window.alert('Claim task mock');

            return from([]);
        } else {
            return throwError(() => new Error('AppName/TaskId not configured'));
        }
    }

    unclaimTask(appName: string, taskId: string): Observable<TaskDetailsCloudModel> {
        if ((appName || appName === '') && taskId) {
            window.alert('Unclaim task mock');

            return from([]);
        } else {
            return throwError(() => new Error('AppName/TaskId not configured'));
        }
    }

    createNewTask(): Observable<TaskDetailsCloudModel> {
        window.alert('Create new task mock');

        return from([]);
    }

    getProcessDefinitions(appName: string): Observable<ProcessDefinitionCloud[]> {
        if (appName || appName === '') {
            window.alert('Get process definitions mock');

            return from([]);
        } else {
            return throwError(() => new Error('AppName not configured'));
        }
    }

    assign(appName: string, taskId: string): Observable<TaskDetailsCloudModel> {
        if (appName && taskId) {
            window.alert('Assign mock');

            return from([]);
        } else {
            return throwError(() => new Error('AppName/TaskId not configured'));
        }
    }
}
