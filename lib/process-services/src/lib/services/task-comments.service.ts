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

import { AlfrescoApiService } from '@alfresco/adf-content-services';
import { CommentModel, CommentsService } from '@alfresco/adf-core';
import { ActivitiCommentsApi } from '@alfresco/js-api';
import { inject, Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PeopleProcessService } from './people-process.service';

@Injectable({
    providedIn: 'root'
})
export class TaskCommentsService implements CommentsService {
    private _commentsApi: ActivitiCommentsApi;
    get commentsApi(): ActivitiCommentsApi {
        this._commentsApi = this._commentsApi ?? new ActivitiCommentsApi(this.apiService.getInstance());
        return this._commentsApi;
    }

    protected apiService = inject(AlfrescoApiService);
    protected peopleProcessService = inject(PeopleProcessService);

    /**
     * Gets all comments that have been added to a task.
     * @param id ID of the target task
     * @returns Details for each comment
     */
    get(id: string): Observable<CommentModel[]> {
        return from(this.commentsApi.getTaskComments(id)).pipe(map((response) => response.data.map((comment) => new CommentModel(comment))));
    }

    /**
     * Adds a comment to a task.
     * @param id ID of the target task
     * @param message Text for the comment
     * @returns Details about the comment
     */
    add(id: string, message: string): Observable<CommentModel> {
        return from(this.commentsApi.addTaskComment({ message }, id)).pipe(map((response) => new CommentModel(response)));
    }

    getUserImage(userId: string): string {
        return this.peopleProcessService.getUserImage(userId);
    }
}
