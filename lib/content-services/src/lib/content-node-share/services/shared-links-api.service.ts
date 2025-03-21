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

import { Injectable } from '@angular/core';
import { NodePaging, SharedLinkBodyCreate, SharedLinkEntry, SharedlinksApi } from '@alfresco/js-api';
import { Observable, from, of, Subject } from 'rxjs';
import { UserPreferencesService } from '@alfresco/adf-core';
import { catchError } from 'rxjs/operators';
import { AlfrescoApiService } from '../../services/alfresco-api.service';

@Injectable({
    providedIn: 'root'
})
export class SharedLinksApiService {
    error = new Subject<{ statusCode: number; message: string }>();

    private _sharedLinksApi: SharedlinksApi;
    get sharedLinksApi(): SharedlinksApi {
        this._sharedLinksApi = this._sharedLinksApi ?? new SharedlinksApi(this.apiService.getInstance());
        return this._sharedLinksApi;
    }

    constructor(private apiService: AlfrescoApiService, private preferences: UserPreferencesService) {}

    /**
     * Gets shared links available to the current user.
     *
     * @param options Options supported by JS-API
     * @returns List of shared links
     */
    getSharedLinks(options: any = {}): Observable<NodePaging> {
        const defaultOptions = {
            maxItems: this.preferences.paginationSize,
            skipCount: 0,
            include: ['properties', 'allowableOperations']
        };
        const queryOptions = Object.assign({}, defaultOptions, options);
        const promise = this.sharedLinksApi.listSharedLinks(queryOptions);

        return from(promise).pipe(catchError((err) => of(err)));
    }

    /**
     * Creates a shared link available to the current user.
     *
     * @param nodeId ID of the node to link to
     * @param sharedLinkWithExpirySettings shared link with nodeId and expiryDate
     * @param options Options supported by JS-API
     * @returns The shared link just created
     */
    createSharedLinks(nodeId: string, sharedLinkWithExpirySettings?: SharedLinkBodyCreate, options: any = {}): Observable<SharedLinkEntry> {
        const promise = this.sharedLinksApi.createSharedLink(sharedLinkWithExpirySettings ? sharedLinkWithExpirySettings : { nodeId }, options);

        return from(promise).pipe(catchError((err) => of(err)));
    }

    /**
     * Deletes a shared link.
     *
     * @param sharedId ID of the link to delete
     * @returns Null response notifying when the operation is complete
     */
    deleteSharedLink(sharedId: string): Observable<any | Error> {
        const promise = this.sharedLinksApi.deleteSharedLink(sharedId);

        return from(promise).pipe(catchError((err: Error) => of(err)));
    }
}
