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

import { DeclassificationExemptionBody, DeclassificationExemptionEntry, DeclassificationExemptionsPaging } from '../model';
import { BaseApi } from './base.api';
import { throwIfNotDefined } from '../../../assert';
import { GsPagingQuery } from './types';

/**
 * DeclassificationExemptionsApi service.
 */
export class DeclassificationExemptionsApi extends BaseApi {
    /**
     * Create a declassification exemption
     * @param declassificationExemption Declassification exemption
     * @returns Promise<DeclassificationExemptionEntry>
     */
    createDeclassificationExemption(declassificationExemption: DeclassificationExemptionBody): Promise<DeclassificationExemptionEntry> {
        throwIfNotDefined(declassificationExemption, 'declassificationExemption');

        return this.post({
            path: '/declassification-exemptions',
            bodyParam: declassificationExemption
        });
    }

    /**
     * Deletes the declassification exemption with id **declassificationExemptionId**.
     * You can't delete a classification exemption that is being used to classify content.
     * @param declassificationExemptionId The identifier for the declassification exemption
     * @returns Promise<{}>
     */
    deleteDeclassificationExemption(declassificationExemptionId: string): Promise<void> {
        throwIfNotDefined(declassificationExemptionId, 'declassificationExemptionId');

        const pathParams = {
            declassificationExemptionId
        };

        return this.delete({
            path: '/declassification-exemptions/{declassificationExemptionId}',
            pathParams
        });
    }

    /**
     * List all declassification exemptions
     * @param opts Optional parameters
     * @returns Promise<DeclassificationExemptionsPaging>
     */
    listDeclassificationExemptions(opts?: GsPagingQuery): Promise<DeclassificationExemptionsPaging> {
        return this.get({
            path: '/declassification-exemptions',
            queryParams: opts
        });
    }

    /**
     * Get declassification exemption information
     * @param declassificationExemptionId The identifier for the declassification exemption
     * @returns Promise<DeclassificationExemptionEntry>
     */
    showDeclassificationExemptionById(declassificationExemptionId: string): Promise<DeclassificationExemptionEntry> {
        throwIfNotDefined(declassificationExemptionId, 'declassificationExemptionId');

        const pathParams = {
            declassificationExemptionId
        };

        return this.get({
            path: '/declassification-exemptions/{declassificationExemptionId}',
            pathParams
        });
    }

    /**
     * Update a declassification exemption
     * @param declassificationExemptionId The identifier for the declassification exemption
     * @param declassificationExemption Declassification exemption
     * @returns Promise<DeclassificationExemptionEntry>
     */
    updateDeclassificationExemption(
        declassificationExemptionId: string,
        declassificationExemption: DeclassificationExemptionBody
    ): Promise<DeclassificationExemptionEntry> {
        throwIfNotDefined(declassificationExemptionId, 'declassificationExemptionId');
        throwIfNotDefined(declassificationExemption, 'declassificationExemption');

        const pathParams = {
            declassificationExemptionId
        };

        return this.put({
            path: '/declassification-exemptions/{declassificationExemptionId}',
            pathParams,
            bodyParam: declassificationExemption
        });
    }
}
