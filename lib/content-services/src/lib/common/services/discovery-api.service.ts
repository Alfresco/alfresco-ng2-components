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

import { Injectable, inject } from '@angular/core';
import { from, Observable, throwError, Subject } from 'rxjs';
import { catchError, map, switchMap, filter, take } from 'rxjs/operators';
import {
    RepositoryInfo,
    SystemPropertiesRepresentation,
    DiscoveryApi,
    AboutApi,
    SystemPropertiesApi,
    BpmProductVersionModel,
    LazyApi
} from '@alfresco/js-api';
import { AlfrescoApiService } from '../../services/alfresco-api.service';
import { AuthenticationService } from '@alfresco/adf-core';

@Injectable({
    providedIn: 'root'
})
export class DiscoveryApiService {
    private readonly authenticationService = inject(AuthenticationService);
    private readonly alfrescoApiService = inject(AlfrescoApiService);

    @LazyApi((self: DiscoveryApiService) => new DiscoveryApi(self.alfrescoApiService.getInstance()))
    declare readonly discoveryApi: DiscoveryApi;

    @LazyApi((self: DiscoveryApiService) => new AboutApi(self.alfrescoApiService.getInstance()))
    declare readonly aboutApi: AboutApi;

    @LazyApi((self: DiscoveryApiService) => new SystemPropertiesApi(self.alfrescoApiService.getInstance()))
    declare readonly systemPropertiesApi: SystemPropertiesApi;

    /**
     * Gets product information for Content Services.
     */
    ecmProductInfo$ = new Subject<RepositoryInfo>();

    constructor() {
        this.authenticationService.onLogin.subscribe(() => {
            this.alfrescoApiService.alfrescoApiInitialized
                .pipe(
                    filter(() => this.authenticationService.isLoggedIn()),
                    take(1),
                    switchMap(() => this.getEcmProductInfo())
                )
                .subscribe((info) => this.ecmProductInfo$.next(info));
        });
    }

    /**
     * Gets product information for Content Services.
     *
     * @returns ProductVersionModel containing product details
     */
    getEcmProductInfo(): Observable<RepositoryInfo> {
        return from(this.discoveryApi.getRepositoryInformation()).pipe(
            map((res) => res.entry.repository),
            catchError((err) => throwError(err))
        );
    }

    /**
     * @deprecated since 8.3.0 this method is no longer used, and will be removed in the next major release.
     * Gets product information for Process Services.
     *
     * @returns ProductVersionModel containing product details
     */
    getBpmProductInfo(): Observable<BpmProductVersionModel> {
        return from(this.aboutApi.getAppVersion());
    }

    getBPMSystemProperties(): Observable<SystemPropertiesRepresentation> {
        return from(this.systemPropertiesApi.getProperties()).pipe(
            map((res) => {
                if ('string' === typeof res) {
                    throw new Error('Not valid response');
                }
                return res;
            }),
            catchError((err) => throwError(err.error))
        );
    }
}
