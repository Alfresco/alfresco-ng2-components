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

import { ResultListDataRepresentationGoogleDriveContent } from '../model/resultListDataRepresentationGoogleDriveContent';
import { BaseApi } from './base.api';

/**
* IntegrationDriveApi service.
* @module IntegrationDriveApi
*/
export class IntegrationDriveApi extends BaseApi {
    /**
    * Drive Authorization
    * Returns Drive OAuth HTML Page
    * @return Promise<{}>
    */
    confirmAuthorisation(): Promise<any> {
        return this.get({
            path: '/api/enterprise/integration/google-drive/confirm-auth-request',
            accepts: ['text/html']
        });
    }

    /**
    * List files and folders
    *
    * @param opts Optional parameters
    * @param opts.filter {string} filter
    * @param opts.parent {string} parent
    * @param opts.currentFolderOnly {boolean} currentFolderOnly
    * @return Promise<ResultListDataRepresentationGoogleDriveContent>
    */
    getFiles(opts?: { filter?: string; parent?: string; currentFolderOnly?: boolean }): Promise<ResultListDataRepresentationGoogleDriveContent> {
        return this.get({
            path: '/api/enterprise/integration/google-drive/files',
            queryParams: opts,
            returnType: ResultListDataRepresentationGoogleDriveContent
        });
    }
}
