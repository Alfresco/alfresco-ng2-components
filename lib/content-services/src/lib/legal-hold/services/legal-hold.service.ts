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
    BulkAssignHoldResponseEntry,
    ContentPagingQuery,
    Hold,
    HoldBody,
    HoldBulkStatusEntry,
    HoldEntry,
    HoldPaging,
    LegalHoldApi,
    RequestQuery
} from '@alfresco/js-api';
import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { AlfrescoApiService } from '../../services/alfresco-api.service';

@Injectable({
    providedIn: 'root'
})
export class LegalHoldService {
    private _legalHoldApi: LegalHoldApi;
    get legalHoldApi(): LegalHoldApi {
        this._legalHoldApi = this._legalHoldApi ?? new LegalHoldApi(this.apiService.getInstance());
        return this._legalHoldApi;
    }

    constructor(private readonly apiService: AlfrescoApiService) {}

    /**
     * Gets the list of holds available in the file plan.
     *
     * @param filePlanId The identifier of a file plan. You can also use the -filePlan- alias.
     * @param options Optional parameters supported by JS-API
     * @returns List of holds Observable<Hold[]>
     */
    getHolds(filePlanId: string, options?: ContentPagingQuery): Observable<Hold[]> {
        return from(this.legalHoldApi.getHolds(filePlanId, options)).pipe(map(({ list }) => list.entries?.map(({ entry }) => entry)));
    }

    /**
     * Assign a node to a hold.
     *
     * @param nodeId The Id of the node which will be assigned to a hold
     * @param holdId The Id of the hold to which nodes will be assigned
     * @returns Observable<HoldEntry>
     */
    assignHold(nodeId: string, holdId: string): Observable<HoldEntry> {
        return from(this.legalHoldApi.assignHold(nodeId, holdId));
    }

    /**
     * Assign multiple nodes to a hold.
     *
     * @param nodeIds The list of managed node Ids
     * @param holdId The Id of the hold to which nodes will be assigned
     * @returns Observable<HoldPaging>
     */
    assignHolds(nodeIds: { id: string }[], holdId: string): Observable<HoldPaging> {
        return from(this.legalHoldApi.assignHolds(nodeIds, holdId));
    }

    /**
     * Unassign the relationship between a child with id nodeId and a parent hold with id holdId.
     *
     * @param holdId The hold Id
     * @param nodeId The Id of the node which is unassigned
     * @returns Empty response
     */
    unassignHold(holdId: string, nodeId: string): Observable<void> {
        return from(this.legalHoldApi.unassignHold(holdId, nodeId));
    }

    /**
     * Create hold.
     *
     * @param filePlanId The identifier of a file plan. You can also use the -filePlan- alias.
     * @param hold Hold to create
     * @returns List of created holds Observable<HoldEntry>
     */
    createHold(filePlanId: string, hold: HoldBody): Observable<HoldEntry> {
        return from(this.legalHoldApi.createHold(filePlanId, hold));
    }

    /**
     * Create list of holds.
     *
     * @param filePlanId The identifier of a file plan. You can also use the -filePlan- alias.
     * @param holds Array of holds to create
     * @returns List of created holds Observable<HoldPaging>
     */
    createHolds(filePlanId: string, holds: HoldBody[]): Observable<HoldPaging> {
        return from(this.legalHoldApi.createHolds(filePlanId, holds));
    }

    /**
     * Start the asynchronous bulk process for a hold with id holdId based on search query results.
     *
     * @param holdId The identifier of a hold
     * @param query Search query
     * @returns Observable<BulkAssignHoldResponseEntry>
     */
    bulkAssignHold(holdId: string, query: RequestQuery): Observable<BulkAssignHoldResponseEntry> {
        return from(this.legalHoldApi.bulkAssignHold(holdId, query));
    }

    /**
     * Assign a folder to a hold.
     *
     * @param holdId The identifier of a hold
     * @param folderId The identifier of a folder
     * @param language Language code
     * @returns Observable<BulkAssignHoldResponseEntry>
     */
    bulkAssignHoldToFolder(holdId: string, folderId: string, language: string): Observable<BulkAssignHoldResponseEntry> {
        const query: RequestQuery = {
            query: `ANCESTOR:'workspace://SpacesStore/${folderId}' and TYPE:content`,
            language
        };

        return from(this.legalHoldApi.bulkAssignHold(holdId, query));
    }

    /**
     * Get status of bulk operation with **bulkStatusId** for **holdId**.
     *
     * @param bulkStatusId The identifier of a bulk status
     * @param holdId The identifier of a hold
     * @returns Promise<HoldsBulkStatusEntry>
     */
    getBulkOperationStatus(bulkStatusId: string, holdId: string): Observable<HoldBulkStatusEntry> {
        return from(this.legalHoldApi.getBulkStatus(bulkStatusId, holdId));
    }
}
