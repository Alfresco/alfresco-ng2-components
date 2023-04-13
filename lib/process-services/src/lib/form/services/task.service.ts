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

import { AlfrescoApiService, LogService } from '@alfresco/adf-core';
import { Injectable } from '@angular/core';
import { Observable, from, throwError } from 'rxjs';
import { TaskRepresentation, TasksApi } from '@alfresco/js-api';
import { catchError, map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class TaskService {

    static UNKNOWN_ERROR_MESSAGE: string = 'Unknown error';
    static GENERIC_ERROR_MESSAGE: string = 'Server error';

    private _taskApi: TasksApi;
    get taskApi(): TasksApi {
        this._taskApi = this._taskApi ?? new TasksApi(this.apiService.getInstance());
        return this._taskApi;
    }

    constructor(private apiService: AlfrescoApiService, private logService: LogService) {
    }


    /**
     * Gets a task.
     *
     * @param taskId Task Id
     * @returns Task info
     */
    getTask(taskId: string): Observable<TaskRepresentation> {
        return from(this.taskApi.getTask(taskId))
            .pipe(
                map(this.toJson),
                catchError((err) => this.handleError(err))
            );
    }

    /**
     * Creates a JSON representation of form data.
     *
     * @param res Object representing form data
     * @returns JSON data
     */
    toJson(res: any) {
        if (res) {
            return res || {};
        }
        return {};
    }

    /**
     * Reports an error message.
     *
     * @param error Data object with optional `message` and `status` fields for the error
     * @returns Error message
     */
    private handleError(error: any): Observable<any> {
        let errMsg = TaskService.UNKNOWN_ERROR_MESSAGE;
        if (error) {
            errMsg = (error.message) ? error.message :
                error.status ? `${error.status} - ${error.statusText}` : TaskService.GENERIC_ERROR_MESSAGE;
        }
        this.logService.error(errMsg);
        return throwError(errMsg);
    }

}
