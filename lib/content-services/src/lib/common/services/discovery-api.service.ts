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

import { Injectable } from '@angular/core';
import { from, Observable, throwError, Subject } from 'rxjs';
import { catchError, map, switchMap, filter, take } from 'rxjs/operators';
import { RepositoryInfo, SystemPropertiesRepresentation } from '@alfresco/js-api';

import { BpmProductVersionModel, AlfrescoApiService, AuthenticationService } from '@alfresco/adf-core';
import { ApiClientsService } from '@alfresco/adf-core/api';

@Injectable({
    providedIn: 'root'
})
export class DiscoveryApiService {

    /**
     * Gets product information for Content Services.
     */
    ecmProductInfo$ = new Subject<RepositoryInfo>();

    constructor(
        private apiService: AlfrescoApiService,
        private authenticationService: AuthenticationService,
        private apiClientsService: ApiClientsService
    ) {
        this.authenticationService.onLogin
            .pipe(
                filter(() => this.apiService.getInstance()?.isEcmLoggedIn()),
                take(1),
                switchMap(() => this.getEcmProductInfo())
            )
            .subscribe((info) => this.ecmProductInfo$.next(info));
    }


    /**
     * Gets product information for Content Services.
     *
     * @returns ProductVersionModel containing product details
     */
    getEcmProductInfo(): Observable<RepositoryInfo> {
        const discoveryApi = this.apiClientsService.get('DiscoveryClient.discovery');

        return from(discoveryApi.getRepositoryInformation())
            .pipe(
                map((res) => res.entry.repository),
                catchError((err) => throwError(err))
            );
    }

    /**
     * Gets product information for Process Services.
     *
     * @returns ProductVersionModel containing product details
     */
    getBpmProductInfo(): Observable<BpmProductVersionModel> {
        const aboutApi = this.apiClientsService.get('ActivitiClient.about');

        return from(aboutApi.getAppVersion())
            .pipe(
                map((res) => new BpmProductVersionModel(res)),
                catchError((err) => throwError(err))
            );
    }

    getBPMSystemProperties(): Observable<SystemPropertiesRepresentation> {
        const systemPropertiesApi = this.apiClientsService.get('ActivitiClient.system-properties');

        return from(systemPropertiesApi.getProperties())
            .pipe(
                map((res: any) => {
                    if ('string' === typeof (res)) {
                        throw new Error('Not valid response');
                    }
                    return res;
                }),
                catchError((err) => throwError(err.error))
            );
    }
}
