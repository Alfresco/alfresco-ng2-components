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

import { ClassificationReasonBody, ClassificationReasonEntry, ClassificationReasonsPaging } from '../model';
import { BaseApi } from './base.api';
import { buildCollectionParam } from '../../../alfrescoApiClient';
import { throwIfNotDefined } from '../../../assert';
import { GsFieldsQuery, GsPagingQuery } from './types';

/**
 * ClassificationReasonsApi service.
 */
export class ClassificationReasonsApi extends BaseApi {
    /**
     * Creates a new classification reason.
     *
     * **Note:** You can create more than one reason by specifying a list of reasons in the JSON body.
     *
     * @param classificationReason Classification reason
     * @returns Promise<ClassificationReasonEntry>
     */
    createClassificationReason(classificationReason: ClassificationReasonBody): Promise<ClassificationReasonEntry> {
        throwIfNotDefined(classificationReason, 'classificationReason');

        return this.post({
            path: '/classification-reasons',
            bodyParam: classificationReason
        });
    }

    /**
     * Deletes the classification reason  **classificationReasonId**.
     *
     * You can't delete a classification reason that is being used to classify content.
     * There must be at least one classification reason.
     *
     * @param classificationReasonId The identifier for the classification reason
     * @returns Promise<{ /* empty */ }>
     */
    deleteClassificationReason(classificationReasonId: string): Promise<void> {
        throwIfNotDefined(classificationReasonId, 'classificationReasonId');

        const pathParams = {
            classificationReasonId
        };

        return this.delete({
            path: '/classification-reasons/{classificationReasonId}',
            pathParams
        });
    }

    /**
     * List all classification reasons
     *
     * @param opts Optional parameters
     * @returns Promise<ClassificationReasonsPaging>
     */
    listClassificationReasons(opts?: GsPagingQuery & GsFieldsQuery): Promise<ClassificationReasonsPaging> {
        const queryParams = {
            skipCount: opts?.skipCount,
            maxItems: opts?.maxItems,
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        return this.get({
            path: '/classification-reasons',
            queryParams
        });
    }

    /**
     * Get classification reason information
     *
     * @param classificationReasonId The identifier for the classification reason
     * @returns Promise<ClassificationReasonEntry>
     */
    showClassificationReasonById(classificationReasonId: string): Promise<ClassificationReasonEntry> {
        throwIfNotDefined(classificationReasonId, 'classificationReasonId');

        const pathParams = {
            classificationReasonId
        };

        return this.get({
            path: '/classification-reasons/{classificationReasonId}',
            pathParams
        });
    }

    /**
     * Updates the classification reason with id **classificationReasonId**. For example, you can change a classification reason code or description.
     *
     * @param classificationReasonId The identifier for the classification reason
     * @param classificationReason Classification reason
     * @returns Promise<ClassificationReasonEntry>
     */
    updateClassificationReason(classificationReasonId: string, classificationReason: ClassificationReasonBody): Promise<ClassificationReasonEntry> {
        throwIfNotDefined(classificationReasonId, 'classificationReasonId');
        throwIfNotDefined(classificationReason, 'classificationReason');

        const pathParams = {
            classificationReasonId
        };

        return this.put({
            path: '/classification-reasons/{classificationReasonId}',
            pathParams,
            bodyParam: classificationReason
        });
    }
}
