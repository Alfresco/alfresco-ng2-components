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

import { ApiService } from '../../../shared/api/api.service';
import { Logger } from '../../core/utils/logger';

export class FormCloudService {

    api: ApiService;

    constructor(api: ApiService) {
        this.api = api;
    }

    async submitForm(formId, appName, taskId, processInstanceId, values): Promise<any> {
        try {
            const path = '/' + appName + '/form/v1/forms/' + formId + '/submit';
            const method = 'POST';

            const queryParams = {};
            const postBody = {
                values,
                taskId,
                processInstanceId
            };

            return this.api.performBpmOperation(path, method, queryParams, postBody);

        } catch (error) {
            Logger.error('Form Submit Service not working', error.message);
        }

    }

    async getForms(appName: string): Promise<any[]> {
        try {
            const path = '/' + appName + '/form/v1/forms';
            const method = 'GET';

            const queryParams = {};
            const postBody = {};

            return this.api.performBpmOperation(path, method, queryParams, postBody);

        } catch (error) {
            Logger.error('Get forms error ', error.message);
        }

        return [];
    }

    async getIdByFormName(appName: string, formName: string): Promise<string> {
        const forms = await this.getForms(appName);
        const formEntry = forms.find((currentForm) => currentForm.formRepresentation.name === formName);

        if (formEntry.formRepresentation) {
            return formEntry.formRepresentation.id;
        }

        return null;
    }

}
