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

import { CommentRepresentation } from '../model/commentRepresentation';
import { ResultListDataRepresentationCommentRepresentation } from '../model/resultListDataRepresentationCommentRepresentation';
import { BaseApi } from './base.api';
import { throwIfNotDefined } from '../../../assert';

/**
* Comments service.
* @module CommentsApi
*/
export class ActivitiCommentsApi extends BaseApi {
    /**
    * Add a comment to a process instance
    *
    * @param commentRequest commentRequest
    * @param processInstanceId processInstanceId
    * @return Promise<CommentRepresentation>
    */
    addProcessInstanceComment(commentRequest: CommentRepresentation, processInstanceId: string): Promise<CommentRepresentation> {
        throwIfNotDefined(commentRequest, 'commentRequest');
        throwIfNotDefined(processInstanceId, 'processInstanceId');

        const pathParams = {
            processInstanceId
        };

        return this.post({
            path: '/api/enterprise/process-instances/{processInstanceId}/comments',
            pathParams,
            bodyParam: commentRequest,
            returnType: CommentRepresentation
        });
    }

    /**
    * Add a comment to a task
    *
    * @param commentRequest commentRequest
    * @param taskId taskId
    * @return Promise<CommentRepresentation>
    */
    addTaskComment(commentRequest: CommentRepresentation, taskId: string): Promise<CommentRepresentation> {
        throwIfNotDefined(commentRequest, 'commentRequest');
        throwIfNotDefined(taskId, 'taskId');

        const pathParams = {
            taskId
        };

        return this.post({
            path: '/api/enterprise/tasks/{taskId}/comments',
            pathParams,
            bodyParam: commentRequest,
            returnType: CommentRepresentation
        });
    }

    /**
    * Get comments for a process
    *
    * @param processInstanceId processInstanceId
    * @param opts Optional parameters
    * @return Promise<ResultListDataRepresentationCommentRepresentation>
    */
    getProcessInstanceComments(processInstanceId: string, opts?: { latestFirst?: boolean }): Promise<ResultListDataRepresentationCommentRepresentation> {
        throwIfNotDefined(processInstanceId, 'processInstanceId');

        const pathParams = {
            processInstanceId
        };

        return this.get({
            path: '/api/enterprise/process-instances/{processInstanceId}/comments',
            pathParams,
            queryParams: opts,
            returnType: ResultListDataRepresentationCommentRepresentation
        });
    }

    /**
    * Get comments for a task
    *
    * @param taskId taskId
    * @param opts Optional parameters
    * @return Promise<ResultListDataRepresentationCommentRepresentation>
    */
    getTaskComments(taskId: string, opts?: { latestFirst?: boolean }): Promise<ResultListDataRepresentationCommentRepresentation> {
        throwIfNotDefined(taskId, 'taskId');

        const pathParams = {
            taskId
        };

        return this.get({
            path: '/api/enterprise/tasks/{taskId}/comments',
            pathParams,
            queryParams: opts,
            returnType: ResultListDataRepresentationCommentRepresentation
        });
    }

}
