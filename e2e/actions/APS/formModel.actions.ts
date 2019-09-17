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

 import { FormRepresentation } from '@alfresco/js-api';

export class FormModelActions {

    async getFormByName(alfrescoJsApi: any, name: String): Promise<FormRepresentation> {

        const forms = await alfrescoJsApi.activiti.editorApi.getForms();

        const form = forms.data.find((currentForm) => {
            return currentForm.name === name;
        });

        return form;
    }

}
