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

import { CommentBody } from '../model/commentBody';
import { CommentEntry } from '../model/commentEntry';
import { CommentPaging } from '../model/commentPaging';
import { BaseApi } from './base.api';
import { throwIfNotDefined } from '../../../assert';
import { buildCollectionParam } from '../../../alfrescoApiClient';
import { ContentFieldsQuery, ContentPagingQuery } from './types';

/**
 * Comments service.
 */
export class CommentsApi extends BaseApi {
    /**
     * Create a comment
     * @param nodeId The identifier of a node.
     * @param commentBodyCreate The comment text. Note that you can also provide a list of comments.
     * @param opts Optional parameters
     * @returns Promise<CommentEntry>
     */
    createComment(nodeId: string, commentBodyCreate: CommentBody, opts?: ContentFieldsQuery): Promise<CommentEntry> {
        throwIfNotDefined(nodeId, 'nodeId');
        throwIfNotDefined(commentBodyCreate, 'commentBodyCreate');

        const pathParams = {
            nodeId
        };

        const queryParams = {
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        return this.post({
            path: '/nodes/{nodeId}/comments',
            pathParams,
            queryParams,
            bodyParam: commentBodyCreate,
            returnType: CommentEntry
        });
    }

    /**
     * Delete a comment
     * @param nodeId The identifier of a node.
     * @param commentId The identifier of a comment.
     * @returns Promise<{}>
     */
    deleteComment(nodeId: string, commentId: string): Promise<void> {
        throwIfNotDefined(nodeId, 'nodeId');
        throwIfNotDefined(commentId, 'commentId');

        const pathParams = {
            nodeId,
            commentId
        };

        return this.delete({
            path: '/nodes/{nodeId}/comments/{commentId}',
            pathParams
        });
    }

    /**
     * List comments
     *
     * Gets a list of comments for the node **nodeId**, sorted chronologically with the newest comment first.
     * @param nodeId The identifier of a node.
     * @param opts Optional parameters
     * @returns Promise<CommentPaging>
     */
    listComments(nodeId: string, opts?: ContentPagingQuery & ContentFieldsQuery): Promise<CommentPaging> {
        throwIfNotDefined(nodeId, 'nodeId');

        const pathParams = {
            nodeId
        };

        const queryParams = {
            skipCount: opts?.skipCount,
            maxItems: opts?.maxItems,
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        return this.get({
            path: '/nodes/{nodeId}/comments',
            pathParams,
            queryParams,
            returnType: CommentPaging
        });
    }

    /**
     * Update a comment
     * @param nodeId The identifier of a node.
     * @param commentId The identifier of a comment.
     * @param commentBodyUpdate The JSON representing the comment to be updated.
     * @param opts Optional parameters
     * @returns Promise<CommentEntry>
     */
    updateComment(nodeId: string, commentId: string, commentBodyUpdate: CommentBody, opts?: ContentFieldsQuery): Promise<CommentEntry> {
        throwIfNotDefined(nodeId, 'nodeId');
        throwIfNotDefined(commentId, 'commentId');
        throwIfNotDefined(commentBodyUpdate, 'commentBodyUpdate');

        const pathParams = {
            nodeId,
            commentId
        };

        const queryParams = {
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        return this.put({
            path: '/nodes/{nodeId}/comments/{commentId}',
            pathParams,
            queryParams,
            bodyParam: commentBodyUpdate,
            returnType: CommentEntry
        });
    }
}
