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

import { browser } from 'protractor';
import { ApiService } from '../../../shared/api/api.service';
import { FormModelsApi, FormRepresentation } from '@alfresco/js-api';

export class FormUtil {

    api: ApiService;
    editorApi: FormModelsApi;

    constructor(apiService?: ApiService) {
        if (apiService) {
            this.api = apiService;
            this.editorApi = new FormModelsApi(apiService.getInstance());
        }
    }

    static async setForm(value: string): Promise<void> {
        await browser.executeScript(
            'window.adf.setFormInEditor(`' + value + '`);'
        );
    }

    static async setCloudForm(value: string): Promise<void> {
        await browser.executeScript(
            'window.adf.setCloudFormInEditor(`' + value + '`);'
        );
    }

    async getFormByName(name: string): Promise<FormRepresentation> {
        // @ts-ignore
        const forms: any = await this.editorApi.getForms();

        return forms.data.find((currentForm) => currentForm.name === name);
    }
}
