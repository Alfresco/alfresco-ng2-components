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

import { ResultListDataRepresentationUserProcessInstanceFilterRepresentation } from '../model/resultListDataRepresentationUserProcessInstanceFilterRepresentation';
import { ResultListDataRepresentationUserTaskFilterRepresentation } from '../model/resultListDataRepresentationUserTaskFilterRepresentation';
import { UserFilterOrderRepresentation } from '../model/userFilterOrderRepresentation';
import { UserProcessInstanceFilterRepresentation } from '../model/userProcessInstanceFilterRepresentation';
import { UserTaskFilterRepresentation } from '../model/userTaskFilterRepresentation';
import { BaseApi } from './base.api';
import { throwIfNotDefined } from '../../../assert';

/**
 * UserFiltersApi service.
 * @module UserFiltersApi
 */
export class UserFiltersApi extends BaseApi {
    /**
     * Create a process instance filter
     *
     * @param userProcessInstanceFilterRepresentation userProcessInstanceFilterRepresentation
     * @return Promise<UserProcessInstanceFilterRepresentation>
     */
    createUserProcessInstanceFilter(userProcessInstanceFilterRepresentation: UserProcessInstanceFilterRepresentation): Promise<UserProcessInstanceFilterRepresentation> {
        throwIfNotDefined(userProcessInstanceFilterRepresentation, 'userProcessInstanceFilterRepresentation');

        return this.post({
            path: '/api/enterprise/filters/processes',
            bodyParam: userProcessInstanceFilterRepresentation,
            returnType: UserProcessInstanceFilterRepresentation
        });
    }

    /**
     * Create a task filter
     *
     * @param userTaskFilterRepresentation userTaskFilterRepresentation
     * @return Promise<UserTaskFilterRepresentation>
     */
    createUserTaskFilter(userTaskFilterRepresentation: UserTaskFilterRepresentation): Promise<UserTaskFilterRepresentation> {
        throwIfNotDefined(userTaskFilterRepresentation, 'userTaskFilterRepresentation');

        return this.post({
            path: '/api/enterprise/filters/tasks',
            bodyParam: userTaskFilterRepresentation,
            returnType: UserTaskFilterRepresentation
        });
    }

    /**
     * Delete a process instance filter
     *
     * @param userFilterId userFilterId
     * @return Promise<{}>
     */
    deleteUserProcessInstanceFilter(userFilterId: number): Promise<void> {
        throwIfNotDefined(userFilterId, 'userFilterId');

        const pathParams = {
            userFilterId
        };

        return this.delete({
            path: '/api/enterprise/filters/processes/{userFilterId}',
            pathParams
        });
    }

    /**
     * Delete a task filter
     *
     * @param userFilterId userFilterId
     * @return Promise<{}>
     */
    deleteUserTaskFilter(userFilterId: number): Promise<void> {
        throwIfNotDefined(userFilterId, 'userFilterId');

        const pathParams = {
            userFilterId
        };

        return this.delete({
            path: '/api/enterprise/filters/tasks/{userFilterId}',
            pathParams
        });
    }

    /**
     * Get a process instance filter
     *
     * @param userFilterId userFilterId
     * @return Promise<UserProcessInstanceFilterRepresentation>
     */
    getUserProcessInstanceFilter(userFilterId: number): Promise<UserProcessInstanceFilterRepresentation> {
        throwIfNotDefined(userFilterId, 'userFilterId');

        const pathParams = {
            userFilterId
        };

        return this.get({
            path: '/api/enterprise/filters/processes/{userFilterId}',
            pathParams,
            returnType: UserProcessInstanceFilterRepresentation
        });
    }

    /**
     * List process instance filters
     *
     * Returns filters for the current user, optionally filtered by *appId*.
     *
     * @param opts Optional parameters
     * @return Promise<ResultListDataRepresentationUserProcessInstanceFilterRepresentation>
     */
    getUserProcessInstanceFilters(opts?: { appId?: number }): Promise<ResultListDataRepresentationUserProcessInstanceFilterRepresentation> {
        return this.get({
            path: '/api/enterprise/filters/processes',
            queryParams: opts,
            returnType: ResultListDataRepresentationUserProcessInstanceFilterRepresentation
        });
    }

    /**
     * Get a task filter
     *
     * @param userFilterId userFilterId
     * @return Promise<UserTaskFilterRepresentation>
     */
    getUserTaskFilter(userFilterId: number): Promise<UserTaskFilterRepresentation> {
        throwIfNotDefined(userFilterId, 'userFilterId');

        const pathParams = {
            userFilterId
        };

        return this.get({
            path: '/api/enterprise/filters/tasks/{userFilterId}',
            pathParams,
            returnType: UserTaskFilterRepresentation
        });
    }

    /**
     * List task filters
     *
     * Returns filters for the current user, optionally filtered by *appId*.
     *
     * @param opts Optional parameters
     * @return Promise<ResultListDataRepresentationUserTaskFilterRepresentation>
     */
    getUserTaskFilters(opts?: { appId?: number }): Promise<ResultListDataRepresentationUserTaskFilterRepresentation> {
        return this.get({
            path: '/api/enterprise/filters/tasks',
            queryParams: opts,
            returnType: ResultListDataRepresentationUserTaskFilterRepresentation
        });
    }

    /**
     * Re-order the list of user process instance filters
     *
     * @param filterOrderRepresentation filterOrderRepresentation
     * @return Promise<{}>
     */
    orderUserProcessInstanceFilters(filterOrderRepresentation: UserFilterOrderRepresentation): Promise<any> {
        throwIfNotDefined(filterOrderRepresentation, 'filterOrderRepresentation');

        return this.put({
            path: '/api/enterprise/filters/processes',
            bodyParam: filterOrderRepresentation
        });
    }

    /**
     * Re-order the list of user task filters
     *
     * @param filterOrderRepresentation filterOrderRepresentation
     * @return Promise<{}>
     */
    orderUserTaskFilters(filterOrderRepresentation: UserFilterOrderRepresentation): Promise<any> {
        throwIfNotDefined(filterOrderRepresentation, 'filterOrderRepresentation');

        return this.put({
            path: '/api/enterprise/filters/tasks',
            bodyParam: filterOrderRepresentation
        });
    }

    /**
     * Update a process instance filter
     *
     * @param userFilterId userFilterId
     * @param userProcessInstanceFilterRepresentation userProcessInstanceFilterRepresentation
     * @return Promise<UserProcessInstanceFilterRepresentation>
     */
    updateUserProcessInstanceFilter(
        userFilterId: number,
        userProcessInstanceFilterRepresentation: UserProcessInstanceFilterRepresentation
    ): Promise<UserProcessInstanceFilterRepresentation> {
        throwIfNotDefined(userFilterId, 'userFilterId');
        throwIfNotDefined(userProcessInstanceFilterRepresentation, 'userProcessInstanceFilterRepresentation');

        const pathParams = {
            userFilterId
        };

        return this.put({
            path: '/api/enterprise/filters/processes/{userFilterId}',
            pathParams,
            bodyParam: userProcessInstanceFilterRepresentation,
            returnType: UserProcessInstanceFilterRepresentation
        });
    }

    /**
     * Update a task filter
     *
     * @param userFilterId userFilterId
     * @param userTaskFilterRepresentation userTaskFilterRepresentation
     * @return Promise<UserTaskFilterRepresentation>
     */
    updateUserTaskFilter(userFilterId: number, userTaskFilterRepresentation: UserTaskFilterRepresentation): Promise<UserTaskFilterRepresentation> {
        throwIfNotDefined(userFilterId, 'userFilterId');
        throwIfNotDefined(userTaskFilterRepresentation, 'userTaskFilterRepresentation');

        const pathParams = {
            userFilterId
        };

        return this.put({
            path: '/api/enterprise/filters/tasks/{userFilterId}',
            pathParams,
            bodyParam: userTaskFilterRepresentation,
            returnType: UserTaskFilterRepresentation
        });
    }
}
