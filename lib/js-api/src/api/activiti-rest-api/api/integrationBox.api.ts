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

import { ResultListDataRepresentationBoxContent } from '../model/resultListDataRepresentationBoxContent';
import { UserAccountCredentialsRepresentation } from '../model/userAccountCredentialsRepresentation';
import { BaseApi } from './base.api';
import { throwIfNotDefined } from '../../../assert';

/**
 * IntegrationBoxApi service.
 * @module IntegrationBoxApi
 */
export class IntegrationBoxApi extends BaseApi {
    /**
     * Box Authorization
     * Returns Box OAuth HTML Page
     * @return Promise<{}>
     */
    confirmAuthorisation(): Promise<any> {
        return this.get({
            path: '/api/enterprise/integration/box/confirm-auth-request',
            accepts: ['text/html']
        });
    }

    /**
     * Add Box account
     *
     * @param userId userId
     * @param credentials credentials
     * @return Promise<{}>
     */
    createRepositoryAccount(userId: number, credentials: UserAccountCredentialsRepresentation): Promise<any> {
        throwIfNotDefined(userId, 'userId');
        throwIfNotDefined(credentials, 'credentials');

        const pathParams = {
            userId
        };

        return this.post({
            path: '/api/enterprise/integration/box/{userId}/account',
            pathParams,
            bodyParam: credentials
        });
    }

    /**
     * Delete account information
     *
     * @param userId userId
     * @return Promise<{}>
     */
    deleteRepositoryAccount(userId: number): Promise<void> {
        throwIfNotDefined(userId, 'userId');

        const pathParams = {
            userId
        };

        const accepts = ['*/*'];

        return this.delete({
            path: '/api/enterprise/integration/box/{userId}/account',
            pathParams,
            accepts
        });
    }

    /**
     * Get status information
     *
     * @return Promise<boolean>
     */
    getBoxPluginStatus(): Promise<boolean> {
        return this.get({
            path: '/api/enterprise/integration/box/status',
            accepts: ['*/*']
        });
    }

    /**
     * List file and folders
     *
     * @param opts Optional parameters
     * @param opts.filter filter
     * @param opts.parent parent
     * @return Promise<ResultListDataRepresentationBoxContent>
     */
    getFiles(opts?: { filter?: string; parent?: string }): Promise<ResultListDataRepresentationBoxContent> {
        opts = opts || {};

        return this.get({
            path: '/api/enterprise/integration/box/files',
            queryParams: opts,
            accepts: ['*/*'],
            returnType: ResultListDataRepresentationBoxContent
        });
    }

    /**
     * Get account information
     *
     * @param userId userId
     * @return Promise<{}>
     */
    getRepositoryAccount(userId: number): Promise<any> {
        throwIfNotDefined(userId, 'userId');

        const pathParams = {
            userId
        };

        return this.get({
            path: '/api/enterprise/integration/box/{userId}/account',
            pathParams,
            accepts: ['*/*']
        });
    }

    /**
     * Update account information
     *
     * @param userId userId
     * @param credentials credentials
     * @return Promise<{}>
     */
    updateRepositoryAccount(userId: number, credentials: UserAccountCredentialsRepresentation): Promise<any> {
        throwIfNotDefined(userId, 'userId');
        throwIfNotDefined(credentials, 'credentials');

        const pathParams = {
            userId
        };

        return this.put({
            path: '/api/enterprise/integration/box/{userId}/account',
            pathParams,
            bodyParam: credentials,
            accepts: ['*/*']
        });
    }
}
