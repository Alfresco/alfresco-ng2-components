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

import { ResetPasswordRepresentation } from '../model/resetPasswordRepresentation';
import { ResultListDataRepresentationLightUserRepresentation } from '../model/resultListDataRepresentationLightUserRepresentation';
import { UserActionRepresentation } from '../model/userActionRepresentation';
import { UserRepresentation } from '../model/userRepresentation';
import { BaseApi } from './base.api';
import { throwIfNotDefined } from '../../../assert';

/**
 * Users service.
 * @module UsersApi
 */
export class UsersApi extends BaseApi {
    /**
     * Execute an action for a specific user
     *
     * Typical action is updating/reset password
     *
     * @param userId userId
     * @param actionRequest actionRequest
     * @return Promise<{}>
     */
    executeAction(userId: number, actionRequest: UserActionRepresentation): Promise<any> {
        throwIfNotDefined(userId, 'userId');
        throwIfNotDefined(actionRequest, 'actionRequest');

        const pathParams = {
            userId
        };

        return this.post({
            path: '/api/enterprise/users/{userId}',
            pathParams,
            bodyParam: actionRequest
        });
    }

    /**
     * Stream user profile picture
     *
     * @param userId userId
     * @return Promise<{}>
     */
    getUserProfilePictureUrl(userId: string): string {
        return this.apiClient.basePath + '/app/rest/users/' + userId + '/picture';
    }

    /**
     * Get a user
     *
     * @param userId userId
     * @return Promise<UserRepresentation>
     */
    getUser(userId: number): Promise<UserRepresentation> {
        throwIfNotDefined(userId, 'userId');

        const pathParams = {
            userId
        };

        return this.get({
            path: '/api/enterprise/users/{userId}',
            pathParams,
            returnType: UserRepresentation
        });
    }

    /**
     * Query users
     *
     * A common use case is that a user wants to select another user (eg. when assigning a task) or group.
     *
     * @param opts Optional parameters
     * @return Promise<ResultListDataRepresentationLightUserRepresentation>
     */
    getUsers(opts?: {
        filter?: string;
        email?: string;
        externalId?: string;
        externalIdCaseInsensitive?: string;
        excludeTaskId?: string;
        excludeProcessId?: string;
        groupId?: number;
        tenantId?: number;
    }): Promise<ResultListDataRepresentationLightUserRepresentation> {
        opts = opts || {};

        const queryParams = {
            filter: opts['filter'],
            email: opts['email'],
            externalId: opts['externalId'],
            externalIdCaseInsensitive: opts['externalIdCaseInsensitive'],
            excludeTaskId: opts['excludeTaskId'],
            excludeProcessId: opts['excludeProcessId'],
            groupId: opts['groupId'],
            tenantId: opts['tenantId']
        };

        return this.get({
            path: '/api/enterprise/users',
            queryParams,
            returnType: ResultListDataRepresentationLightUserRepresentation
        });
    }

    /**
     * Request a password reset
     *
     * @param resetPassword resetPassword
     * @return Promise<{}>
     */
    requestPasswordReset(resetPassword: ResetPasswordRepresentation): Promise<any> {
        throwIfNotDefined(resetPassword, 'resetPassword');

        return this.post({
            path: '/api/enterprise/idm/passwords',
            bodyParam: resetPassword
        });
    }

    /**
     * Update a user
     *
     * @param userId userId
     * @param userRequest userRequest
     * @return Promise<UserRepresentation>
     */
    updateUser(userId: number, userRequest: UserRepresentation): Promise<UserRepresentation> {
        throwIfNotDefined(userId, 'userId');
        throwIfNotDefined(userRequest, 'userRequest');

        const pathParams = {
            userId
        };

        return this.put({
            path: '/api/enterprise/users/{userId}',
            pathParams,
            bodyParam: userRequest,
            returnType: UserRepresentation
        });
    }
}
