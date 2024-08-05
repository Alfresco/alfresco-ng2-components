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
    ResultListDataRepresentationUserProcessInstanceFilterRepresentation,
    ResultListDataRepresentationUserTaskFilterRepresentation,
    UserFilterOrderRepresentation,
    UserProcessInstanceFilterRepresentation,
    UserTaskFilterRepresentation
} from '../model';
import { BaseApi } from './base.api';
import { throwIfNotDefined } from '../../../assert';
import { AppIdQuery } from './types';

/**
 * UserFiltersApi service.
 */
export class UserFiltersApi extends BaseApi {
    /**
     * Create a process instance filter
     *
     * @param userProcessInstanceFilterRepresentation userProcessInstanceFilterRepresentation
     * @returns Promise<UserProcessInstanceFilterRepresentation>
     */
    createUserProcessInstanceFilter(
        userProcessInstanceFilterRepresentation: UserProcessInstanceFilterRepresentation
    ): Promise<UserProcessInstanceFilterRepresentation> {
        throwIfNotDefined(userProcessInstanceFilterRepresentation, 'userProcessInstanceFilterRepresentation');

        return this.post({
            path: '/api/enterprise/filters/processes',
            bodyParam: userProcessInstanceFilterRepresentation
        });
    }

    /**
     * Create a task filter
     *
     * @param userTaskFilterRepresentation userTaskFilterRepresentation
     * @returns Promise<UserTaskFilterRepresentation>
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
     * @returns Promise<{ /* empty */ }>
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
     * @returns Promise<{ /* empty */ }>
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
     * @returns Promise<UserProcessInstanceFilterRepresentation>
     */
    getUserProcessInstanceFilter(userFilterId: number): Promise<UserProcessInstanceFilterRepresentation> {
        throwIfNotDefined(userFilterId, 'userFilterId');

        const pathParams = {
            userFilterId
        };

        return this.get({
            path: '/api/enterprise/filters/processes/{userFilterId}',
            pathParams
        });
    }

    /**
     * List process instance filters
     *
     * Returns filters for the current user, optionally filtered by *appId*.
     *
     * @param opts Optional parameters
     * @returns Promise<ResultListDataRepresentationUserProcessInstanceFilterRepresentation>
     */
    getUserProcessInstanceFilters(opts?: AppIdQuery): Promise<ResultListDataRepresentationUserProcessInstanceFilterRepresentation> {
        return this.get({
            path: '/api/enterprise/filters/processes',
            queryParams: opts
        });
    }

    /**
     * Get a task filter
     *
     * @param userFilterId userFilterId
     * @returns Promise<UserTaskFilterRepresentation>
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
     * @returns Promise<ResultListDataRepresentationUserTaskFilterRepresentation>
     */
    getUserTaskFilters(opts?: AppIdQuery): Promise<ResultListDataRepresentationUserTaskFilterRepresentation> {
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
     * @returns Promise<{ /* empty */ }>
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
     * @returns Promise<{ /* empty */ }>
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
     * @returns Promise<UserProcessInstanceFilterRepresentation>
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
            bodyParam: userProcessInstanceFilterRepresentation
        });
    }

    /**
     * Update a task filter
     *
     * @param userFilterId userFilterId
     * @param userTaskFilterRepresentation userTaskFilterRepresentation
     * @returns Promise<UserTaskFilterRepresentation>
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
