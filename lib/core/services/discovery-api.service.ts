/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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
import { BpmProductVersionModel, EcmProductVersionModel } from '../models/product-version.model';
import { AlfrescoApiService } from './alfresco-api.service';
import { catchError, map, switchMap, filter, take } from 'rxjs/operators';
import { AboutApi, DiscoveryApi, SystemPropertiesApi, SystemPropertiesRepresentation } from '@alfresco/js-api';
import { AuthenticationService } from './authentication.service';

@Injectable({
    providedIn: 'root'
})
export class DiscoveryApiService {

    /**
     * Gets product information for Content Services.
     */
    ecmProductInfo$ = new Subject<EcmProductVersionModel>();

    private discoveryApi: DiscoveryApi;
    private aboutApi: AboutApi;
    private systemPropertiesApi: SystemPropertiesApi;

    constructor(
        private apiService: AlfrescoApiService,
        private authenticationService: AuthenticationService) {

        this.discoveryApi = new DiscoveryApi(apiService.getInstance());
        this.aboutApi = new AboutApi(apiService.getInstance());
        this.systemPropertiesApi = new SystemPropertiesApi(apiService.getInstance());

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
     * @returns ProductVersionModel containing product details
     */
    public getEcmProductInfo(): Observable<EcmProductVersionModel> {
        return from(this.discoveryApi.getRepositoryInformation())
            .pipe(
                map((res) => new EcmProductVersionModel(res)),
                catchError((err) => throwError(err))
            );
    }

    /**
     * Gets product information for Process Services.
     * @returns ProductVersionModel containing product details
     */
    public getBpmProductInfo(): Observable<BpmProductVersionModel> {
        return from(this.aboutApi.getAppVersion())
            .pipe(
                map((res) => new BpmProductVersionModel(res)),
                catchError((err) => throwError(err))
            );
    }

    public getBPMSystemProperties(): Observable<SystemPropertiesRepresentation> {
        return from(this.systemPropertiesApi.getProperties())
            .pipe(
                map((res) => {
                    if ('string' === typeof (res)) {
                        throw new Error('Not valid response');
                    }
                    return res;
                }),
                catchError((err) => throwError(err.error))
            );
    }
}
