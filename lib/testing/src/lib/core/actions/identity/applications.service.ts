/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

import { ApiService } from '../api.service';

export class ApplicationsService {

    api: ApiService;

    constructor(api: ApiService) {
        this.api = api;
    }

    async getApplicationsByStatus(status): Promise<any> {
        try {
            const path = '/deployment-service/v1/applications';
            const method = 'GET';

            const queryParams = { status: status }, postBody = {};

            return this.api.performBpmOperation(path, method, queryParams, postBody);
        } catch (error) {
            // tslint:disable-next-line:no-console
            console.log('Get Applications - Service error, Response: ', JSON.parse(JSON.stringify(error)).response.text);
        }
    }

}
