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

import { Injectable } from '@angular/core';
import { AlfrescoApiService, AlfrescoAuthenticationService } from 'ng2-alfresco-core';
import { Observable } from 'rxjs/Rx';
import { Response } from '@angular/http';
import { User } from '../models/user.model';

@Injectable()
export class ActivitiPeopleService {

    constructor(private authService: AlfrescoAuthenticationService,
                private alfrescoJsApi: AlfrescoApiService) {
    }

    getWorkflowUsers(taskId: string, searchWord: string): Observable<User[]> {
        let option = {excludeTaskId: taskId, filter: searchWord};
        return Observable.fromPromise(this.getWorkflowUserApi(option))
            .map((response: any) => <User[]> response.data || [])
            .catch(this.handleError);
    }

    involveUserWithTask(taskId: string, idToInvolve: string): Observable<User[]> {
        let node = {userId: idToInvolve};
        return Observable.fromPromise(this.involveUserToTaskApi(taskId, node))
            .catch(this.handleError);
    }

    removeInvolvedUser(taskId: string, idToRemove: string): Observable<User[]> {
        let node = {userId: idToRemove};
        return Observable.fromPromise(this.removeInvolvedUserFromTaskApi(taskId, node))
            .catch(this.handleError);
    }

    private getWorkflowUserApi(options: any) {
        return this.alfrescoJsApi.getInstance().activiti.usersWorkflowApi.getUsers(options);
    }

    private involveUserToTaskApi(taskId: string, node: any) {
        return this.alfrescoJsApi.getInstance().activiti.taskActionsApi.involveUser(taskId, node);
    }

    private removeInvolvedUserFromTaskApi(taskId: string, node: any) {
        return this.alfrescoJsApi.getInstance().activiti.taskActionsApi.removeInvolvedUser(taskId, node);
    }

    /**
     * Throw the error
     * @param error
     * @returns {ErrorObservable}
     */
    private handleError(error: Response) {
        // in a real world app, we may send the error to some remote logging infrastructure
        // instead of just logging it to the console
        console.error(error);
        return Observable.throw(error || 'Server error');
    }
}
