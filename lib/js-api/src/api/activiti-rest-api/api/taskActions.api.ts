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

import { AssigneeIdentifierRepresentation } from '../model/assigneeIdentifierRepresentation';
import { FormIdentifierRepresentation } from '../model/formIdentifierRepresentation';
import { TaskRepresentation } from '../model/taskRepresentation';
import { UserIdentifierRepresentation } from '../model/userIdentifierRepresentation';
import { BaseApi } from './base.api';
import { throwIfNotDefined } from '../../../assert';

/**
 * TaskActionsApi service.
 * @module TaskactionsApi
 */
export class TaskActionsApi extends BaseApi {
    /**
     * Assign a task to a user
     *
     * @param taskId taskId
     * @param userIdentifier userIdentifier
     * @return Promise<TaskRepresentation>
     */
    assignTask(taskId: string, userIdentifier: AssigneeIdentifierRepresentation): Promise<TaskRepresentation> {
        throwIfNotDefined(taskId, 'taskId');
        throwIfNotDefined(userIdentifier, 'userIdentifier');

        const pathParams = {
            taskId
        };

        return this.put({
            path: '/api/enterprise/tasks/{taskId}/action/assign',
            pathParams,
            bodyParam: userIdentifier,
            returnType: TaskRepresentation
        });
    }

    /**
     * Attach a form to a task
     *
     * @param taskId taskId
     * @param formIdentifier formIdentifier
     * @return Promise<{}>
     */
    attachForm(taskId: string, formIdentifier: FormIdentifierRepresentation): Promise<any> {
        throwIfNotDefined(taskId, 'taskId');
        throwIfNotDefined(formIdentifier, 'formIdentifier');

        const pathParams = {
            taskId
        };

        return this.put({
            path: '/api/enterprise/tasks/{taskId}/action/attach-form',
            pathParams,
            bodyParam: formIdentifier
        });
    }

    /**
     * Claim a task
     *
     * To claim a task (in case the task is assigned to a group)
     *
     * @param taskId taskId
     * @return Promise<{}>
     */
    claimTask(taskId: string): Promise<any> {
        throwIfNotDefined(taskId, 'taskId');

        const pathParams = {
            taskId
        };

        return this.put({
            path: '/api/enterprise/tasks/{taskId}/action/claim',
            pathParams
        });
    }

    /**
     * Complete a task
     *
     * Use this endpoint to complete a standalone task or task without a form
     *
     * @param taskId taskId
     * @return Promise<{}>
     */
    completeTask(taskId: string): Promise<any> {
        throwIfNotDefined(taskId, 'taskId');

        const pathParams = {
            taskId
        };

        return this.put({
            path: '/api/enterprise/tasks/{taskId}/action/complete',
            pathParams
        });
    }

    /**
     * Delegate a task
     *
     * @param taskId taskId
     * @param userIdentifier userIdentifier
     * @return Promise<{}>
     */
    delegateTask(taskId: string, userIdentifier: UserIdentifierRepresentation): Promise<any> {
        throwIfNotDefined(taskId, 'taskId');
        throwIfNotDefined(userIdentifier, 'userIdentifier');

        const pathParams = {
            taskId
        };

        return this.put({
            path: '/api/enterprise/tasks/{taskId}/action/delegate',
            pathParams,
            bodyParam: userIdentifier
        });
    }

    /**
     * Involve a group with a task
     *
     * @param taskId taskId
     * @param groupId groupId
     * @return Promise<{}>
     */
    involveGroup(taskId: string, groupId: string): Promise<any> {
        throwIfNotDefined(taskId, 'taskId');
        throwIfNotDefined(groupId, 'groupId');

        const pathParams = {
            taskId,
            groupId
        };

        return this.post({
            path: '/api/enterprise/tasks/{taskId}/groups/{groupId}',
            pathParams
        });
    }

    /**
     * Involve a user with a task
     *
     * @param taskId taskId
     * @param userIdentifier userIdentifier
     * @return Promise<{}>
     */
    involveUser(taskId: string, userIdentifier: UserIdentifierRepresentation): Promise<any> {
        throwIfNotDefined(taskId, 'taskId');
        throwIfNotDefined(userIdentifier, 'userIdentifier');

        const pathParams = {
            taskId
        };

        return this.put({
            path: '/api/enterprise/tasks/{taskId}/action/involve',
            pathParams,
            bodyParam: userIdentifier
        });
    }

    /**
     * Remove a form from a task
     *
     * @param taskId taskId
     * @return Promise<{}>
     */
    removeForm(taskId: string): Promise<any> {
        throwIfNotDefined(taskId, 'taskId');

        const pathParams = {
            taskId
        };

        return this.delete({
            path: '/api/enterprise/tasks/{taskId}/action/remove-form',
            pathParams
        });
    }

    /**
     * Remove an involved group from a task
     *
     * @param taskId taskId
     * @param identifier
     * @return Promise<{}>
     */
    removeInvolvedUser(taskId: string, identifier: string | UserIdentifierRepresentation): Promise<any> {
        throwIfNotDefined(taskId, 'taskId');
        throwIfNotDefined(identifier, 'identifier');

        const pathParams = {
            taskId,
            identifier
        };

        if (identifier instanceof String) {
            return this.delete({
                path: '/api/enterprise/tasks/{taskId}/groups/{groupId}',
                pathParams
            });
        } else {
            return this.put({
                path: '/api/enterprise/tasks/{taskId}/action/remove-involved',
                pathParams,
                bodyParam: identifier
            });
        }
    }

    /**
     * Resolve a task
     *
     *
     *
     * @param taskId taskId
     * @return Promise<{}>
     */
    resolveTask(taskId: string): Promise<any> {
        throwIfNotDefined(taskId, 'taskId');

        const pathParams = {
            taskId
        };

        return this.put({
            path: '/api/enterprise/tasks/{taskId}/action/resolve',
            pathParams
        });
    }

    /**
     * Unclaim a task
     *
     * To unclaim a task (in case the task was assigned to a group)
     *
     * @param taskId taskId
     * @return Promise<{}>
     */
    unclaimTask(taskId: string): Promise<any> {
        throwIfNotDefined(taskId, 'taskId');

        const pathParams = {
            taskId
        };

        return this.put({
            path: '/api/enterprise/tasks/{taskId}/action/unclaim',
            pathParams
        });
    }
}
