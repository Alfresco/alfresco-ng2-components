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

import { HistoricTaskInstanceQueryRepresentation } from '../model/historicTaskInstanceQueryRepresentation';
import { IdentityLinkRepresentation } from '../model/identityLinkRepresentation';
import { ResultListDataRepresentationTaskRepresentation } from '../model/resultListDataRepresentationTaskRepresentation';
import { TaskAuditInfoRepresentation } from '../model/taskAuditInfoRepresentation';
import { TaskFilterRequestRepresentation } from '../model/taskFilterRequestRepresentation';
import { TaskQueryRepresentation } from '../model/taskQueryRepresentation';
import { TaskRepresentation } from '../model/taskRepresentation';
import { TaskUpdateRepresentation } from '../model/taskUpdateRepresentation';
import { BaseApi } from './base.api';
import { throwIfNotDefined } from '../../../assert';

/**
 * Tasks service.
 * @module TasksApi
 */
export class TasksApi extends BaseApi {
    /**
     * List the users and groups involved with a task
     *
     * @param taskId taskId
     * @param identityLinkRepresentation identityLinkRepresentation
     * @return Promise<IdentityLinkRepresentation>
     */
    createIdentityLink(taskId: string, identityLinkRepresentation: IdentityLinkRepresentation): Promise<IdentityLinkRepresentation> {
        throwIfNotDefined(taskId, 'taskId');
        throwIfNotDefined(identityLinkRepresentation, 'identityLinkRepresentation');

        const pathParams = {
            taskId
        };

        return this.post({
            path: '/api/enterprise/tasks/{taskId}/identitylinks',
            pathParams,
            bodyParam: identityLinkRepresentation,
            returnType: IdentityLinkRepresentation
        });
    }

    /**
     * Create a standalone task
     *
     * A standalone task is one which is not associated with any process instance.
     *
     * @param taskRepresentation taskRepresentation
     * @return Promise<TaskRepresentation>
     */
    createNewTask(taskRepresentation: TaskRepresentation): Promise<TaskRepresentation> {
        throwIfNotDefined(taskRepresentation, 'taskRepresentation');

        return this.post({
            path: '/api/enterprise/tasks',
            bodyParam: taskRepresentation,
            returnType: TaskRepresentation
        });
    }

    /**
     * Remove a user or group involvement from a task
     *
     * @param taskId taskId
     * @param family family
     * @param identityId identityId
     * @param type type
     * @return Promise<{}>
     */
    deleteIdentityLink(taskId: string, family: string, identityId: string, type: string): Promise<any> {
        throwIfNotDefined(taskId, 'taskId');
        throwIfNotDefined(family, 'family');
        throwIfNotDefined(identityId, 'identityId');
        throwIfNotDefined(type, 'type');

        const pathParams = {
            taskId,
            family,
            identityId,
            type
        };

        return this.delete({
            path: '/api/enterprise/tasks/{taskId}/identitylinks/{family}/{identityId}/{type}',
            pathParams
        });
    }

    /**
     * Delete a task
     *
     * @param taskId taskId
     * @return Promise<{}>
     */
    deleteTask(taskId: string): Promise<void> {
        throwIfNotDefined(taskId, 'taskId');

        const pathParams = {
            taskId
        };

        return this.delete({
            path: '/api/enterprise/tasks/{taskId}',
            pathParams
        });
    }

    /**
     * Filter a list of tasks
     *
     * @param tasksFilter tasksFilter
     * @return Promise<ResultListDataRepresentationTaskRepresentation>
     */
    filterTasks(tasksFilter: TaskFilterRequestRepresentation): Promise<ResultListDataRepresentationTaskRepresentation> {
        throwIfNotDefined(tasksFilter, 'tasksFilter');

        return this.post({
            path: '/api/enterprise/tasks/filter',
            bodyParam: tasksFilter,
            returnType: ResultListDataRepresentationTaskRepresentation
        });
    }

    /**
     * Get a user or group involvement with a task
     *
     * @param taskId taskId
     * @param family family
     * @param identityId identityId
     * @param type type
     * @return Promise<IdentityLinkRepresentation>
     */
    getIdentityLinkType(taskId: string, family: string, identityId: string, type: string): Promise<IdentityLinkRepresentation> {
        throwIfNotDefined(taskId, 'taskId');
        throwIfNotDefined(family, 'family');
        throwIfNotDefined(identityId, 'identityId');
        throwIfNotDefined(type, 'type');

        const pathParams = {
            taskId,
            family,
            identityId,
            type
        };

        return this.get({
            path: '/api/enterprise/tasks/{taskId}/identitylinks/{family}/{identityId}/{type}',
            pathParams,
            returnType: IdentityLinkRepresentation
        });
    }

    /**
     * List either the users or groups involved with a process instance
     *
     * @param taskId taskId
     * @param family family
     * @return Promise<IdentityLinkRepresentation>
     */
    getIdentityLinksForFamily(taskId: string, family: string): Promise<IdentityLinkRepresentation> {
        throwIfNotDefined(taskId, 'taskId');
        throwIfNotDefined(family, 'family');

        const pathParams = {
            taskId,
            family
        };

        return this.get({
            path: '/api/enterprise/tasks/{taskId}/identitylinks/{family}',
            pathParams,
            returnType: IdentityLinkRepresentation
        });
    }

    /**
     * getIdentityLinks
     *
     * @param taskId taskId
     * @return Promise<IdentityLinkRepresentation>
     */
    getIdentityLinks(taskId: string): Promise<IdentityLinkRepresentation> {
        throwIfNotDefined(taskId, 'taskId');

        const pathParams = {
            taskId
        };

        return this.get({
            path: '/api/enterprise/tasks/{taskId}/identitylinks',
            pathParams,
            returnType: IdentityLinkRepresentation
        });
    }

    /**
     * Get the audit log for a task
     *
     * @param taskId taskId
     * @return Promise<TaskAuditInfoRepresentation>
     */
    getTaskAuditLog(taskId: string): Promise<TaskAuditInfoRepresentation> {
        throwIfNotDefined(taskId, 'taskId');

        const pathParams = {
            taskId
        };

        return this.get({
            path: '/api/enterprise/tasks/{taskId}/audit',
            pathParams,
            returnType: TaskAuditInfoRepresentation
        });
    }

    /**
     * Get the audit log for a task
     * @param taskId taskId
     * @return Promise<Blob> task audit in blob
     */
    getTaskAuditPdf(taskId: string): Promise<Blob> {
        throwIfNotDefined(taskId, 'taskId');

        const pathParams = {
            taskId
        };

        return this.get({
            // Todo: update url once ACTIVITI-4191 fixed
            path: 'app/rest/tasks/{taskId}/audit',
            pathParams,
            returnType: 'blob'
        });
    }

    /**
     * Get a task
     *
     * @param taskId taskId
     * @return Promise<TaskRepresentation>
     */
    getTask(taskId: string): Promise<TaskRepresentation> {
        throwIfNotDefined(taskId, 'taskId');

        const pathParams = {
            taskId
        };

        return this.get({
            path: '/api/enterprise/tasks/{taskId}',
            pathParams,
            returnType: TaskRepresentation
        });
    }

    /**
     * Query historic tasks
     *
     * @param queryRequest queryRequest
     * @return Promise<ResultListDataRepresentationTaskRepresentation>
     */
    listHistoricTasks(queryRequest: HistoricTaskInstanceQueryRepresentation): Promise<ResultListDataRepresentationTaskRepresentation> {
        throwIfNotDefined(queryRequest, 'queryRequest');

        return this.post({
            path: '/api/enterprise/historic-tasks/query',
            bodyParam: queryRequest,
            returnType: ResultListDataRepresentationTaskRepresentation
        });
    }

    /**
     * List tasks
     *
     * @param tasksQuery tasksQuery
     * @return Promise<ResultListDataRepresentationTaskRepresentation>
     */
    listTasks(tasksQuery: TaskQueryRepresentation): Promise<ResultListDataRepresentationTaskRepresentation> {
        throwIfNotDefined(tasksQuery, 'tasksQuery');

        return this.post({
            path: '/api/enterprise/tasks/query',
            bodyParam: tasksQuery,
            returnType: ResultListDataRepresentationTaskRepresentation
        });
    }

    /**
     * Update a task
     *
     * You can edit only name, description and dueDate (ISO 8601 string).
     *
     * @param taskId taskId
     * @param updated updated
     * @return Promise<TaskRepresentation>
     */
    updateTask(taskId: string, updated: TaskUpdateRepresentation): Promise<TaskRepresentation> {
        throwIfNotDefined(taskId, 'taskId');
        throwIfNotDefined(updated, 'updated');

        const pathParams = {
            taskId
        };

        return this.put({
            path: '/api/enterprise/tasks/{taskId}',
            pathParams,
            bodyParam: updated,
            returnType: TaskRepresentation
        });
    }
}
