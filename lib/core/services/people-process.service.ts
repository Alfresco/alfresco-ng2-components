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

import { Injectable } from '@angular/core';
import { Observable, from, throwError } from 'rxjs';
import { UserProcessModel } from '../models/user-process.model';
import { ApiClientsService } from '@alfresco/adf-core/api';
import { LogService } from './log.service';
import { catchError, map } from 'rxjs/operators';
import {
    ResultListDataRepresentationLightUserRepresentation
} from '@alfresco/js-api';

@Injectable({
    providedIn: 'root'
})
export class PeopleProcessService {

    get taskActionsApi() {
        return this.apiClientsService.get('ActivitiClient.task-actions');
    }

    get userApi() {
        return this.apiClientsService.get('ActivitiClient.users');
    }

    constructor(
        private apiClientsService: ApiClientsService,
        private logService: LogService
    ) {}

    /**
     * Gets information about users across all tasks.
     *
     * @param taskId ID of the task
     * @param searchWord Filter text to search for
     * @returns Array of user information objects
     */
    getWorkflowUsers(taskId?: string, searchWord?: string): Observable<UserProcessModel[]> {
        const option = { excludeTaskId: taskId, filter: searchWord };
        return from(this.getWorkflowUserApi(option))
            .pipe(
                map((response: any) => response.data || []),
                catchError((err) => this.handleError(err))
            );
    }

    /**
     * Gets the profile picture URL for the specified user.
     *
     * @param user The target user
     * @returns Profile picture URL
     */
    getUserImage(user: UserProcessModel): string {
        return this.getUserProfileImageApi(user.id.toString());
    }

    /**
     * Sets a user to be involved with a task.
     *
     * @param taskId ID of the target task
     * @param idToInvolve ID of the user to involve
     * @returns Empty response when the update completes
     */
    involveUserWithTask(taskId: string, idToInvolve: string): Observable<UserProcessModel[]> {
        const node = { userId: idToInvolve };
        return from(this.involveUserToTaskApi(taskId, node))
            .pipe(
                catchError((err) => this.handleError(err))
            );
    }

    /**
     * Removes a user who is currently involved with a task.
     *
     * @param taskId ID of the target task
     * @param idToRemove ID of the user to remove
     * @returns Empty response when the update completes
     */
    removeInvolvedUser(taskId: string, idToRemove: string): Observable<UserProcessModel[]> {
        const node = { userId: idToRemove };
        return from(this.removeInvolvedUserFromTaskApi(taskId, node))
            .pipe(
                catchError((err) => this.handleError(err))
            );
    }

    private getWorkflowUserApi(options: any): Promise<ResultListDataRepresentationLightUserRepresentation> {
        return this.userApi.getUsers(options);
    }

    private involveUserToTaskApi(taskId: string, node: any) {
        return this.taskActionsApi.involveUser(taskId, node);
    }

    private removeInvolvedUserFromTaskApi(taskId: string, node: any) {
        return this.taskActionsApi.removeInvolvedUser(taskId, node);
    }

    private getUserProfileImageApi(userId: string): string {
        return this.userApi.getUserProfilePictureUrl(userId);
    }

    private handleError(error: any) {
        this.logService.error(error);
        return throwError(error || 'Server error');
    }
}
