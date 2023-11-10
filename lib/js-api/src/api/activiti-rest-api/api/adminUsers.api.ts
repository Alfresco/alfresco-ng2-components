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

import { AbstractUserRepresentation } from '../model/abstractUserRepresentation';
import { BulkUserUpdateRepresentation } from '../model/bulkUserUpdateRepresentation';
import { ResultListDataRepresentationAbstractUserRepresentation } from '../model/resultListDataRepresentationAbstractUserRepresentation';
import { UserRepresentation } from '../model/userRepresentation';
import { BaseApi } from './base.api';
import { throwIfNotDefined } from '../../../assert';

export interface GetUsersOpts {
    filter?: string;
    status?: string;
    accountType?: string;
    sort?: string;
    company?: string;
    start?: number;
    page?: number;
    size?: number;
    groupId?: number;
    tenantId?: number;
    summary?: boolean;
}

/**
* AdminUsersApi service.
* @module AdminUsersApi
*/
export class AdminUsersApi extends BaseApi {
    /**
    * Bulk update a list of users
    *
    * @param update update
    * @return Promise<{}>
    */
    bulkUpdateUsers(update: BulkUserUpdateRepresentation): Promise<any> {
        throwIfNotDefined(update, 'update');

        return this.put({
            path: '/api/enterprise/admin/users',
            bodyParam: update
        });
    }

    /**
    * Create a user
    *
    * @param userRepresentation userRepresentation
    * @return Promise<UserRepresentation>
    */
    createNewUser(userRepresentation: UserRepresentation): Promise<UserRepresentation> {
        throwIfNotDefined(userRepresentation, 'userRepresentation');

        return this.post({
            path: '/api/enterprise/admin/users',
            bodyParam: userRepresentation,
            returnType: UserRepresentation
        });
    }

    /**
    * Get a user
    *
    * @param userId userId
    * @param opts Optional parameters
    * @return Promise<AbstractUserRepresentation>
    */
    getUser(userId: number, opts?: { summary?: boolean }): Promise<AbstractUserRepresentation> {
        throwIfNotDefined(userId, 'userId');

        const pathParams = {
            userId
        };

        return this.get({
            path: '/api/enterprise/admin/users/{userId}',
            pathParams,
            queryParams: opts,
            returnType: AbstractUserRepresentation
        });
    }

    /**
    * Query users
    *
    * @param opts Optional parameters
    * @return Promise<ResultListDataRepresentationAbstractUserRepresentation>
    */
    getUsers(opts?: GetUsersOpts): Promise<ResultListDataRepresentationAbstractUserRepresentation> {
        return this.get({
            path: '/api/enterprise/admin/users',
            queryParams: opts,
            returnType: ResultListDataRepresentationAbstractUserRepresentation
        });
    }

    /**
    * Update a user
    *
    * @param userId userId
    * @param userRepresentation userRepresentation
    * @return Promise<{}>
    */
    updateUserDetails(userId: number, userRepresentation: UserRepresentation): Promise<any> {
        throwIfNotDefined(userId, 'userId');
        throwIfNotDefined(userRepresentation, 'userRepresentation');

        const pathParams = {
            userId
        };

        return this.put({
            path: '/api/enterprise/admin/users/{userId}',
            pathParams,
            bodyParam: userRepresentation
        });
    }
}
