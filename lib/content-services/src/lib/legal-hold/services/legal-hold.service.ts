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

import { AlfrescoApiService } from '@alfresco/adf-core';
import { ContentPagingQuery, Hold, LegalHoldApi } from '@alfresco/js-api';
import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

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
     * Gets the list of holds.
     *
     * @param filePlanId The identifier of a file plan. You can also use the -filePlan- alias.
     * @param options Optional parameters supported by JS-API
     * @returns List of holds Observable<Hold[]>
     */
    getHolds(filePlanId: string, options?: ContentPagingQuery): Observable<Hold[]> {
        return from(this.legalHoldApi.getHolds(filePlanId, options)).pipe(
            map(({ list }) =>
                list.entries?.map(({ entry }) => ({
                    id: entry.id,
                    name: entry.name
                }))
            )
        );
    }
}
