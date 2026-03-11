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
import { Observable, of, Subject } from 'rxjs';
import { TaskDetailsCloudModel, TASK_ASSIGNED_STATE, TASK_CREATED_STATE } from '../models/task-details-cloud.model';
import { taskDetailsContainer } from '../task-header/mocks/task-details-cloud.mock';
import { TaskCloudService } from '../services/task-cloud.service';

@Injectable()
export class TaskCloudServiceMock extends TaskCloudService {
    currentUserMock = 'AssignedTaskUser';
    dataChangesDetected$ = new Subject();

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

    updateTask(_appName: string, taskId: string): Observable<TaskDetailsCloudModel> {
        return of(taskDetailsContainer[taskId]);
    }

    canClaimTask(taskDetails: TaskDetailsCloudModel): boolean {
        return taskDetails?.status === TASK_CREATED_STATE;
    }

    protected isAssignedToMe(assignee: string): boolean {
        return assignee === this.currentUserMock;
    }

    canUnclaimTask(taskDetails: TaskDetailsCloudModel): boolean {
        const currentUser = this.currentUserMock;
        return taskDetails?.status === TASK_ASSIGNED_STATE && taskDetails.assignee === currentUser;
    }
}
