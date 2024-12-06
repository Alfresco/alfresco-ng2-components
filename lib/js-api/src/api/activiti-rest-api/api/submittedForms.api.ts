/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { ResultListDataRepresentationSubmittedFormRepresentation } from '../model/resultListDataRepresentationSubmittedFormRepresentation';
import { SubmittedFormRepresentation } from '../model/submittedFormRepresentation';
import { BaseApi } from './base.api';
import { throwIfNotDefined } from '../../../assert';

/**
 * SubmittedFormsApi service.
 */
export class SubmittedFormsApi extends BaseApi {
    /**
     * List submissions for a form
     * @param formId formId
     * @param opts Optional parameters
     * @return Promise<ResultListDataRepresentationSubmittedFormRepresentation>
     */
    getFormSubmittedForms(
        formId: number,
        opts?: { submittedBy?: number; start?: number; size?: number }
    ): Promise<ResultListDataRepresentationSubmittedFormRepresentation> {
        throwIfNotDefined(formId, 'formId');

        const pathParams = {
            formId
        };

        return this.get({
            path: '/api/enterprise/form-submitted-forms/{formId}',
            pathParams,
            queryParams: opts,
            returnType: ResultListDataRepresentationSubmittedFormRepresentation
        });
    }

    /**
     * List submissions for a process instance
     * @param processId processId
     * @return Promise<ResultListDataRepresentationSubmittedFormRepresentation>
     */
    getProcessSubmittedForms(processId: string): Promise<ResultListDataRepresentationSubmittedFormRepresentation> {
        throwIfNotDefined(processId, 'processId');

        const pathParams = {
            processId
        };

        return this.get({
            path: '/api/enterprise/process-submitted-forms/{processId}',
            pathParams,
            returnType: ResultListDataRepresentationSubmittedFormRepresentation
        });
    }

    /**
     * Get a form submission
     * @param submittedFormId submittedFormId
     * @return Promise<SubmittedFormRepresentation>
     */
    getSubmittedFrom(submittedFormId: number): Promise<SubmittedFormRepresentation> {
        throwIfNotDefined(submittedFormId, 'submittedFormId');

        const pathParams = {
            submittedFormId
        };

        return this.get({
            path: '/api/enterprise/submitted-forms/{submittedFormId}',
            pathParams,
            returnType: SubmittedFormRepresentation
        });
    }

    /**
     * Get the submitted form for a task
     * @param taskId taskId
     * @return Promise<SubmittedFormRepresentation>
     */
    getTaskSubmittedForms(taskId: string): Promise<SubmittedFormRepresentation> {
        throwIfNotDefined(taskId, 'taskId');

        const pathParams = {
            taskId
        };

        return this.get({
            path: '/api/enterprise/task-submitted-form/{taskId}',
            pathParams,
            returnType: SubmittedFormRepresentation
        });
    }
}
