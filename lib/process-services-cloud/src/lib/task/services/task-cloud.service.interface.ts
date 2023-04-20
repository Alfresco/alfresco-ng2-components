/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { CardViewArrayItem } from '@alfresco/adf-core';
import { Observable, Subject } from 'rxjs';
import { ProcessDefinitionCloud } from '../../models/process-definition-cloud.model';
import { TaskPriorityOption } from '../models/task.model';
import { StartTaskCloudRequestModel } from '../start-task/models/start-task-cloud-request.model';
import { TaskDetailsCloudModel } from '../start-task/models/task-details-cloud.model';
export interface TaskCloudServiceInterface {

    dataChangesDetected$: Subject<unknown>;
    priorities: TaskPriorityOption[];

    completeTask(appName: string, taskId: string): Observable<TaskDetailsCloudModel>;
    canCompleteTask(taskDetails: TaskDetailsCloudModel): boolean;
    isTaskEditable(taskDetails: TaskDetailsCloudModel): boolean;
    isAssigneePropertyClickable(taskDetails: TaskDetailsCloudModel, candidateUsers: CardViewArrayItem[], candidateGroups: CardViewArrayItem[]): boolean;
    canClaimTask(taskDetails: TaskDetailsCloudModel): boolean;
    canUnclaimTask(taskDetails: TaskDetailsCloudModel): boolean;
    claimTask(appName: string, taskId: string, assignee: string): Observable<TaskDetailsCloudModel>;
    unclaimTask(appName: string, taskId: string): Observable<TaskDetailsCloudModel>;
    getTaskById(appName: string, taskId: string): Observable<TaskDetailsCloudModel>;
    createNewTask(startTaskRequest: StartTaskCloudRequestModel, appName: string): Observable<TaskDetailsCloudModel>;
    updateTask(appName: string, taskId: string, payload: any): Observable<TaskDetailsCloudModel>;
    getCandidateUsers(appName: string, taskId: string): Observable<string[]>;
    getCandidateGroups(appName: string, taskId: string): Observable<string[]>;
    getProcessDefinitions(appName: string): Observable<ProcessDefinitionCloud[]>;
    assign(appName: string, taskId: string, assignee: string): Observable<TaskDetailsCloudModel>;
    getPriorityLabel(priority: number): string;
}
