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

import { ApiService } from '../../core/actions/api.service';
import { Logger } from '../../core/utils/logger';

export class FormCloudService {

    api: ApiService;

    constructor(api: ApiService) {
        this.api = api;
    }

    async submitForm(formId, appName, taskId, processInstanceId, values) {
        try {
            const path = '/' + appName + '/form/v1/forms/' + formId + '/submit';
            const method = 'POST';

            const queryParams = {}, postBody = {
                'values': values,
                'taskId': taskId,
                'processInstanceId': processInstanceId
            };

            return this.api.performBpmOperation(path, method, queryParams, postBody);

        } catch (error) {
            // tslint:disable-next-line:no-console
            Logger.error('Form Submit Service not working', error.message);
        }

    }

}
