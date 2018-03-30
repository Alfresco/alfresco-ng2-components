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
import { Observable } from 'rxjs/Observable';
import { CommentModel } from '../models/comment.model';
import { UserProcessModel } from '../models/user-process.model';
import { AlfrescoApiService } from './alfresco-api.service';
import { LogService } from './log.service';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class CommentProcessService {

    constructor(private apiService: AlfrescoApiService,
                private logService: LogService) {
    }

    addTaskComment(taskId: string, message: string): Observable<CommentModel> {
        return Observable.fromPromise(this.apiService.getInstance().activiti.taskApi.addTaskComment({message: message}, taskId))
            .map(res => res)
            .map((response: CommentModel) => {
                return new CommentModel({
                    id: response.id,
                    message: response.message,
                    created: response.created,
                    createdBy: response.createdBy
                });
            }).catch(err => this.handleError(err));

    }

    getTaskComments(taskId: string): Observable<CommentModel[]> {
        return Observable.fromPromise(this.apiService.getInstance().activiti.taskApi.getTaskComments(taskId))
            .map(res => res)
            .map((response: any) => {
                let comments: CommentModel[] = [];
                response.data.forEach((comment: CommentModel) => {
                    let user = new UserProcessModel(comment.createdBy);
                    comments.push(new CommentModel({id: comment.id, message: comment.message, created: comment.created, createdBy: user}));
                });
                return comments;
            }).catch(err => this.handleError(err));
    }

    getProcessInstanceComments(processInstanceId: string): Observable<CommentModel[]> {
        return Observable.fromPromise(this.apiService.getInstance().activiti.commentsApi.getProcessInstanceComments(processInstanceId))
            .map(res => res)
            .map((response: any) => {
                let comments: CommentModel[] = [];
                response.data.forEach((comment: CommentModel) => {
                    let user = new UserProcessModel(comment.createdBy);
                    comments.push(new CommentModel({id: comment.id, message: comment.message, created: comment.created, createdBy: user}));
                });
                return comments;
            }).catch(err => this.handleError(err));
    }

    addProcessInstanceComment(processInstanceId: string, message: string): Observable<CommentModel> {
        return Observable.fromPromise(
            this.apiService.getInstance().activiti.commentsApi.addProcessInstanceComment({message: message}, processInstanceId)
        )
            .map((response: CommentModel) => {
                return new CommentModel({
                    id: response.id,
                    message: response.message,
                    created: response.created,
                    createdBy: response.createdBy
                });
            }).catch(err => this.handleError(err));

    }

    private handleError(error: any) {
        this.logService.error(error);
        return Observable.throw(error || 'Server error');
    }

}
