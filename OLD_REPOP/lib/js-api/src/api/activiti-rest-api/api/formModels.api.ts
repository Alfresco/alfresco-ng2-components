/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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
    FormDefinitionRepresentation,
    FormRepresentation,
    FormSaveRepresentation,
    ResultListDataRepresentationFormRepresentation,
    ResultListDataRepresentationRuntimeFormRepresentation,
    ValidationErrorRepresentation
} from '../model';
import { BaseApi } from './base.api';
import { buildCollectionParam } from '../../../alfrescoApiClient';
import { throwIfNotDefined } from '../../../assert';

export interface GetFormsOpts {
    nameLike?: string;
    appId?: number;
    tenantId?: number;
    start?: number;
    sort?: string;
    order?: string;
    size?: number;
}

/**
 * FormModelsApi service.
 */
export class FormModelsApi extends BaseApi {
    /**
     * Get form content
     * @param formId formId
     * @return Promise<FormDefinitionRepresentation>
     */
    getFormEditorJson(formId: number): Promise<FormDefinitionRepresentation> {
        throwIfNotDefined(formId, 'formId');

        const pathParams = {
            formId
        };

        return this.get({
            path: '/api/enterprise/forms/{formId}/editorJson',
            pathParams
        });
    }

    /**
     * Get form history
     * @param formId formId
     * @param formHistoryId formHistoryId
     * @return Promise<FormRepresentation>
     */
    getFormHistory(formId: number, formHistoryId: number): Promise<FormRepresentation> {
        throwIfNotDefined(formId, 'formId');
        throwIfNotDefined(formHistoryId, 'formHistoryId');

        const pathParams = {
            formId,
            formHistoryId
        };

        return this.get({
            path: '/api/enterprise/editor/form-models/{formId}/history/{formHistoryId}',
            pathParams,
            returnType: FormRepresentation
        });
    }

    /**
     * Get a form model
     * @param formId {number} formId
     * @return Promise<FormRepresentation>
     */
    getForm(formId: number): Promise<FormRepresentation> {
        throwIfNotDefined(formId, 'formId');

        const pathParams = {
            formId
        };

        return this.get({
            path: '/api/enterprise/editor/form-models/{formId}',
            pathParams,
            returnType: FormRepresentation
        });
    }

    /**
     * Get forms
     * @param input input
     * @return Promise<FormRepresentation>
     */
    getForms(
        input: string[] | GetFormsOpts
    ): Promise<FormRepresentation | ResultListDataRepresentationRuntimeFormRepresentation | ResultListDataRepresentationFormRepresentation> {
        if (typeof input === 'string') {
            const queryParams = {
                formId: buildCollectionParam(input, 'multi')
            };

            return this.get({
                path: '/api/enterprise/editor/form-models/values',
                queryParams,
                returnType: FormRepresentation
            });
        } else if (typeof input === 'object') {
            return this.get({
                path: '/api/enterprise/forms',
                queryParams: input
            });
        } else {
            return this.get({
                path: '/api/enterprise/editor/form-models',
                returnType: ResultListDataRepresentationFormRepresentation
            });
        }
    }

    /**
     * Update form model content
     * @param formId ID of the form to update
     * @param saveRepresentation saveRepresentation
     * @return Promise<FormRepresentation>
     */
    saveForm(formId: number, saveRepresentation: FormSaveRepresentation): Promise<FormRepresentation> {
        throwIfNotDefined(formId, 'formId');
        throwIfNotDefined(saveRepresentation, 'saveRepresentation');

        const pathParams = {
            formId
        };

        return this.put({
            path: '/api/enterprise/editor/form-models/{formId}',
            pathParams,
            bodyParam: saveRepresentation,
            returnType: FormRepresentation
        });
    }

    /**
     * Validate form model content
     *
     * The model content to be validated must be specified in the POST body
     * @param formId formId
     * @param saveRepresentation saveRepresentation
     * @return Promise<ValidationErrorRepresentation>
     */
    validateModel(formId: number, saveRepresentation: FormSaveRepresentation): Promise<ValidationErrorRepresentation> {
        throwIfNotDefined(formId, 'formId');
        throwIfNotDefined(saveRepresentation, 'saveRepresentation');

        const pathParams = {
            formId
        };

        return this.get({
            path: '/api/enterprise/editor/form-models/{formId}/validate',
            pathParams,
            bodyParam: saveRepresentation
        });
    }
}
