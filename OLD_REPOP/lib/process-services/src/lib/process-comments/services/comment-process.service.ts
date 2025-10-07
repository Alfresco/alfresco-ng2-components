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
import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { CommentModel, CommentsService, User } from '@alfresco/adf-core';
import { map } from 'rxjs/operators';
import { ActivitiCommentsApi } from '@alfresco/js-api';
import { PeopleProcessService } from '../../services/people-process.service';

@Injectable({
    providedIn: 'root'
})
export class CommentProcessService implements CommentsService {
    private _commentsApi: ActivitiCommentsApi;
    get commentsApi(): ActivitiCommentsApi {
        this._commentsApi = this._commentsApi ?? new ActivitiCommentsApi(this.apiService.getInstance());
        return this._commentsApi;
    }

    constructor(private apiService: AlfrescoApiService, private peopleProcessService: PeopleProcessService) {}

    /**
     * Gets all comments that have been added to a process instance.
     *
     * @param id ID of the target process instance
     * @returns Details for each comment
     */
    get(id: string): Observable<CommentModel[]> {
        return from(this.commentsApi.getProcessInstanceComments(id)).pipe(
            map((response) =>
                response.data.map(
                    (comment) =>
                        new CommentModel({
                            id: comment.id,
                            message: comment.message,
                            created: comment.created,
                            createdBy: new User(comment.createdBy)
                        })
                )
            )
        );
    }

    /**
     * Adds a comment to a process instance.
     *
     * @param id ID of the target process instance
     * @param message Text for the comment
     * @returns Details of the comment added
     */
    add(id: string, message: string): Observable<CommentModel> {
        return from(this.commentsApi.addProcessInstanceComment({ message }, id)).pipe(
            map(
                (response) =>
                    new CommentModel({
                        id: response.id,
                        message: response.message,
                        created: response.created,
                        createdBy: new User(response.createdBy)
                    })
            )
        );
    }

    getUserImage(userId: string): string {
        return this.peopleProcessService.getUserImage(userId);
    }
}
