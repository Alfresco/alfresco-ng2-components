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
import { from, Observable, throwError, Subject } from 'rxjs';
import { catchError, map, switchMap, filter, take } from 'rxjs/operators';
import { RepositoryInfo, SystemPropertiesRepresentation, DiscoveryApi, AboutApi, SystemPropertiesApi } from '@alfresco/js-api';

import { AlfrescoApiService } from '../../services/alfresco-api.service';
import { BpmProductVersionModel, AuthenticationService } from '@alfresco/adf-core';

@Injectable({
    providedIn: 'root'
})
export class DiscoveryApiService {
    private _discoveryApi: DiscoveryApi;
    get discoveryApi(): DiscoveryApi {
        this._discoveryApi = this._discoveryApi ?? new DiscoveryApi(this.alfrescoApiService.getInstance());
        return this._discoveryApi;
    }

    /**
     * Gets product information for Content Services.
     */
    ecmProductInfo$ = new Subject<RepositoryInfo>();

    constructor(private authenticationService: AuthenticationService, private alfrescoApiService: AlfrescoApiService) {
        this.authenticationService.onLogin.subscribe(() => {
            this.alfrescoApiService.alfrescoApiInitialized
                .pipe(
                    filter(() => this.authenticationService.isEcmLoggedIn()),
                    take(1),
                    switchMap(() => this.getEcmProductInfo())
                )
                .subscribe((info) => this.ecmProductInfo$.next(info));
        });
    }

    /**
     * Gets product information for Content Services.
     * @returns ProductVersionModel containing product details
     */
    getEcmProductInfo(): Observable<RepositoryInfo> {
        return from(this.discoveryApi.getRepositoryInformation()).pipe(
            map((res) => res.entry.repository),
            catchError((err) => throwError(err))
        );
    }

    /**
     * Gets product information for Process Services.
     * @returns ProductVersionModel containing product details
     */
    getBpmProductInfo(): Observable<BpmProductVersionModel> {
        const aboutApi = new AboutApi(this.alfrescoApiService.getInstance());

        return from(aboutApi.getAppVersion()).pipe(
            map((res) => new BpmProductVersionModel(res)),
            catchError((err) => throwError(err))
        );
    }

    getBPMSystemProperties(): Observable<SystemPropertiesRepresentation> {
        const systemPropertiesApi = new SystemPropertiesApi(this.alfrescoApiService.getInstance());

        return from(systemPropertiesApi.getProperties()).pipe(
            map((res: any) => {
                if ('string' === typeof res) {
                    throw new Error('Not valid response');
                }
                return res;
            }),
            catchError((err) => throwError(err.error))
        );
    }
}
