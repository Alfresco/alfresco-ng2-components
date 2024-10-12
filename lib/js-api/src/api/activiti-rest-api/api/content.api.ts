/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import {
    RelatedContentRepresentation,
    ResultListDataRepresentationRelatedContentRepresentation,
    ResultListDataRepresentationRelatedProcessTask
} from '../model';
import { BaseApi } from './base.api';
import { throwIfNotDefined } from '../../../assert';

/**
 * Content service.
 */
export class ContentApi extends BaseApi {
    /**
     * Attach existing content to a process instance
     * @param processInstanceId processInstanceId
     * @param relatedContent relatedContent
     * @param opts Optional parameters
     * @return Promise<RelatedContentRepresentation>
     */
    createRelatedContentOnProcessInstance(
        processInstanceId: string,
        relatedContent: RelatedContentRepresentation | any,
        opts?: { isRelatedContent?: boolean }
    ): Promise<RelatedContentRepresentation> {
        throwIfNotDefined(processInstanceId, 'processInstanceId');
        throwIfNotDefined(relatedContent, 'relatedContent');

        opts = opts || {};

        const pathParams = {
            processInstanceId
        };

        if (relatedContent instanceof RelatedContentRepresentation) {
            return this.post({
                path: '/api/enterprise/process-instances/{processInstanceId}/content',
                pathParams,
                queryParams: opts,
                bodyParam: relatedContent,
                returnType: RelatedContentRepresentation
            });
        } else {
            const formParams = {
                file: relatedContent
            };

            return this.post({
                path: '/api/enterprise/process-instances/{processInstanceId}/raw-content',
                pathParams,
                formParams,
                queryParams: opts,
                contentTypes: ['multipart/form-data'],
                returnType: RelatedContentRepresentation
            });
        }
    }

    /**
     * Attach existing content to a task
     * @param taskId taskId
     * @param relatedContent relatedContent
     * @param opts Optional parameters
     * @return Promise<RelatedContentRepresentation>
     */
    createRelatedContentOnTask(
        taskId: string,
        relatedContent: RelatedContentRepresentation | any,
        opts?: { isRelatedContent?: boolean }
    ): Promise<RelatedContentRepresentation> {
        throwIfNotDefined(taskId, 'taskId');
        throwIfNotDefined(relatedContent, 'relatedContent');

        const pathParams = {
            taskId
        };

        if (relatedContent instanceof RelatedContentRepresentation) {
            return this.post({
                path: '/api/enterprise/tasks/{taskId}/content',
                pathParams,
                queryParams: opts,
                bodyParam: relatedContent,
                returnType: RelatedContentRepresentation
            });
        } else {
            const formParams = {
                file: relatedContent
            };

            return this.post({
                path: '/api/enterprise/tasks/{taskId}/raw-content',
                pathParams,
                queryParams: opts,
                formParams,
                contentTypes: ['multipart/form-data'],
                returnType: RelatedContentRepresentation
            });
        }
    }

    /**
     * Upload content and create a local representation
     * @param file file
     * @return Promise<RelatedContentRepresentation>
     */
    createTemporaryRawRelatedContent(file: any): Promise<RelatedContentRepresentation> {
        throwIfNotDefined(file, 'file');

        const formParams = {
            file
        };

        return this.post({
            path: '/api/enterprise/content/raw',
            formParams,
            contentTypes: ['multipart/form-data'],
            returnType: RelatedContentRepresentation
        });
    }

    /**
     * Create a local representation of content from a remote repository
     * @param relatedContent relatedContent
     * @return Promise<RelatedContentRepresentation>
     */
    createTemporaryRelatedContent(relatedContent: RelatedContentRepresentation): Promise<RelatedContentRepresentation> {
        throwIfNotDefined(relatedContent, 'relatedContent');

        return this.post({
            path: '/api/enterprise/content',
            bodyParam: relatedContent,
            returnType: RelatedContentRepresentation
        });
    }

    /**
     * Remove a local content representation
     * @param contentId contentId
     * @return Promise<{}>
     */
    deleteContent(contentId: number): Promise<void> {
        throwIfNotDefined(contentId, 'contentId');

        const pathParams = {
            contentId
        };

        return this.delete({
            path: '/api/enterprise/content/{contentId}',
            pathParams
        });
    }

    /**
     * Get a local content representation
     * @param contentId contentId
     * @return Promise<RelatedContentRepresentation>
     */
    getContent(contentId: number): Promise<RelatedContentRepresentation> {
        throwIfNotDefined(contentId, 'contentId');

        const pathParams = {
            contentId
        };

        return this.get({
            path: '/api/enterprise/content/{contentId}',
            pathParams,
            returnType: RelatedContentRepresentation
        });
    }

    /**
     * Get content Raw URL for the given contentId
     * @param contentId contentId
     */
    getRawContentUrl(contentId: number): string {
        return `${this.apiClient.basePath}/api/enterprise/content/${contentId}/raw`;
    }

    /**
     * Stream content rendition
     * @param contentId contentId
     * @param renditionType renditionType
     * @return Promise<{}>
     */
    getRawContent(contentId: number, renditionType?: string): Promise<any> {
        throwIfNotDefined(contentId, 'contentId');

        if (renditionType) {
            const pathParams = {
                contentId,
                renditionType
            };

            return this.get({
                path: '/api/enterprise/content/{contentId}/rendition/{renditionType}',
                pathParams,
                returnType: 'blob',
                responseType: 'blob'
            });
        } else {
            const pathParams = {
                contentId
            };

            return this.get({
                path: '/api/enterprise/content/{contentId}/raw',
                pathParams,
                returnType: 'blob',
                responseType: 'blob'
            });
        }
    }

    /**
     * List content attached to a process instance
     * @param processInstanceId processInstanceId
     * @param opts Optional parameters
     * @return Promise<ResultListDataRepresentationRelatedContentRepresentation>
     */
    getRelatedContentForProcessInstance(
        processInstanceId: string,
        opts?: { isRelatedContent?: boolean }
    ): Promise<ResultListDataRepresentationRelatedContentRepresentation> {
        throwIfNotDefined(processInstanceId, 'processInstanceId');

        opts = opts || {};

        const pathParams = {
            processInstanceId
        };

        return this.get({
            path: '/api/enterprise/process-instances/{processInstanceId}/content',
            pathParams,
            queryParams: opts,
            returnType: ResultListDataRepresentationRelatedContentRepresentation
        });
    }

    /**
     * List content attached to a task
     * @param taskId taskId
     * @param opts Optional parameters
     * @return Promise<ResultListDataRepresentationRelatedContentRepresentation>
     */
    getRelatedContentForTask(
        taskId: string,
        opts?: { isRelatedContent?: boolean }
    ): Promise<ResultListDataRepresentationRelatedContentRepresentation> {
        throwIfNotDefined(taskId, 'taskId');

        const pathParams = {
            taskId
        };

        return this.get({
            path: '/api/enterprise/tasks/{taskId}/content',
            pathParams,
            queryParams: opts,
            returnType: ResultListDataRepresentationRelatedContentRepresentation
        });
    }

    /**
     * Lists processes and tasks on workflow started with provided document
     * @param sourceId - id of the document that workflow or task has been started with
     * @param source - source of the document that workflow or task has been started with
     * @param size - size of the entries to get
     * @param page - page number
     * @return Promise<ResultListDataRepresentationRelatedProcessTask>
     */
    getProcessesAndTasksOnContent(
        sourceId: string,
        source: string,
        size?: number,
        page?: number
    ): Promise<ResultListDataRepresentationRelatedProcessTask> {
        throwIfNotDefined(sourceId, 'sourceId');
        throwIfNotDefined(source, 'source');

        return this.get({
            path: '/api/enterprise/document-runtime',
            queryParams: {
                sourceId,
                source,
                size,
                page
            }
        });
    }
}
