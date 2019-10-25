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
import { CommentModel } from '../models/comment.model';
import { UserProcessModel } from '../models/user-process.model';
import { AlfrescoApiService } from './alfresco-api.service';
import { LogService } from './log.service';
import { map, catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class CommentProcessService {

    constructor(private apiService: AlfrescoApiService,
                private logService: LogService) {
    }

    /**
     * Adds a comment to a task.
     * @param taskId ID of the target task
     * @param message Text for the comment
     * @returns Details about the comment
     */
    addTaskComment(taskId: string, message: string): Observable<CommentModel> {
        return from(this.apiService.getInstance().activiti.taskApi.addTaskComment({ message: message }, taskId))
            .pipe(
                map((response: CommentModel) => {
                    return new CommentModel({
                        id: response.id,
                        message: response.message,
                        created: response.created,
                        createdBy: response.createdBy
                    });
                }),
                catchError((err: any) => this.handleError(err))
            );
    }

    /**
     * Gets all comments that have been added to a task.
     * @param taskId ID of the target task
     * @returns Details for each comment
     */
    getTaskComments(taskId: string): Observable<CommentModel[]> {
        return from(this.apiService.getInstance().activiti.taskApi.getTaskComments(taskId))
            .pipe(
                map((response: any) => {
                    const comments: CommentModel[] = [];
                    response.data.forEach((comment: CommentModel) => {
                        const user = new UserProcessModel(comment.createdBy);
                        comments.push(new CommentModel({
                            id: comment.id,
                            message: comment.message,
                            created: comment.created,
                            createdBy: user
                        }));
                    });
                    return comments;
                }),
                catchError((err: any) => this.handleError(err))
            );
    }

    /**
     * Gets all comments that have been added to a process instance.
     * @param processInstanceId ID of the target process instance
     * @returns Details for each comment
     */
    getProcessInstanceComments(processInstanceId: string): Observable<CommentModel[]> {
        return from(this.apiService.getInstance().activiti.commentsApi.getProcessInstanceComments(processInstanceId))
            .pipe(
                map((response: any) => {
                    const comments: CommentModel[] = [];
                    response.data.forEach((comment: CommentModel) => {
                        const user = new UserProcessModel(comment.createdBy);
                        comments.push(new CommentModel({
                            id: comment.id,
                            message: comment.message,
                            created: comment.created,
                            createdBy: user
                        }));
                    });
                    return comments;
                }),
                catchError((err: any) => this.handleError(err))
            );
    }

    /**
     * Adds a comment to a process instance.
     * @param processInstanceId ID of the target process instance
     * @param message Text for the comment
     * @returns Details of the comment added
     */
    addProcessInstanceComment(processInstanceId: string, message: string): Observable<CommentModel> {
        return from(
            this.apiService.getInstance().activiti.commentsApi.addProcessInstanceComment({ message: message }, processInstanceId)
        ).pipe(
            map((response: CommentModel) => {
                return new CommentModel({
                    id: response.id,
                    message: response.message,
                    created: response.created,
                    createdBy: response.createdBy
                });
            }),
            catchError((err: any) => this.handleError(err))
        );
    }

    private handleError(error: any) {
        this.logService.error(error);
        return throwError(error || 'Server error');
    }

}
