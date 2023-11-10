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

import { ClassificationReasonBody } from '../model/classificationReasonBody';
import { ClassificationReasonEntry } from '../model/classificationReasonEntry';
import { ClassificationReasonsPaging } from '../model/classificationReasonsPaging';
import { BaseApi } from './base.api';
import { buildCollectionParam } from '../../../alfrescoApiClient';
import { throwIfNotDefined } from '../../../assert';
import { GsFieldsQuery, GsPagingQuery } from './types';

/**
 * ClassificationReasonsApi service.
 * @module ClassificationReasonsApi
 */
export class ClassificationReasonsApi extends BaseApi {
    /**
    * Creates a new classification reason.

**Note:** You can create more than one reason by specifying a list of reasons in the JSON body.
For example, the following JSON body creates two classification reasons:
JSON
[
  {
    \"code\":\"My Code1\",
    \"description\":\"My Description1\"
  },
  {
    \"code\":\"My Code2\",
    \"description\":\"My Description2\"
  }
]

If you specify a list as input, then a paginated list rather than an entry is returned in the response body. For example:

JSON
{
  \"list\": {
    \"pagination\": {
      \"count\": 2,
      \"hasMoreItems\": false,
      \"totalItems\": 2,
      \"skipCount\": 0,
      \"maxItems\": 100
    },
    \"entries\": [
      {
        \"entry\": {
          ...
        }
      },
      {
        \"entry\": {
          ...
        }
      }
    ]
  }
}

    *
    * @param classificationReason Classification reason
    * @return Promise<ClassificationReasonEntry>
    */
    createClassificationReason(classificationReason: ClassificationReasonBody): Promise<ClassificationReasonEntry> {
        throwIfNotDefined(classificationReason, 'classificationReason');

        return this.post({
            path: '/classification-reasons',
            bodyParam: classificationReason,
            returnType: ClassificationReasonEntry
        });
    }

    /**
     * Deletes the classification reason  **classificationReasonId**. You can't delete a classification reason that is being used to classify content. There must be at least one classification reason.
     *
     * @param classificationReasonId The identifier for the classification reason
     * @return Promise<{}>
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
     * @return Promise<ClassificationReasonsPaging>
     */
    listClassificationReasons(opts?: GsPagingQuery & GsFieldsQuery): Promise<ClassificationReasonsPaging> {
        const queryParams = {
            skipCount: opts?.skipCount,
            maxItems: opts?.maxItems,
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        return this.get({
            path: '/classification-reasons',
            queryParams,
            returnType: ClassificationReasonsPaging
        });
    }

    /**
     * Get classification reason information
     *
     * @param classificationReasonId The identifier for the classification reason
     * @return Promise<ClassificationReasonEntry>
     */
    showClassificationReasonById(classificationReasonId: string): Promise<ClassificationReasonEntry> {
        throwIfNotDefined(classificationReasonId, 'classificationReasonId');

        const pathParams = {
            classificationReasonId
        };

        return this.get({
            path: '/classification-reasons/{classificationReasonId}',
            pathParams,
            returnType: ClassificationReasonEntry
        });
    }

    /**
     * Updates the classification reason with id **classificationReasonId**. For example, you can change a classification reason code or description.
     *
     * @param classificationReasonId The identifier for the classification reason
     * @param classificationReason Classification reason
     * @return Promise<ClassificationReasonEntry>
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
            bodyParam: classificationReason,
            returnType: ClassificationReasonEntry
        });
    }
}
