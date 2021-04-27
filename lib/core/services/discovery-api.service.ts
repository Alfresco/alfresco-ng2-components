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
import { from, merge, Observable, throwError, Subject } from 'rxjs';
import { BpmProductVersionModel, EcmProductVersionModel } from '../models/product-version.model';
import { AlfrescoApiService } from './alfresco-api.service';
import { catchError, filter, map, switchMap, take } from 'rxjs/operators';
import { Activiti, SystemPropertiesRepresentation } from '@alfresco/js-api';
import { AuthenticationService } from './authentication.service';

@Injectable({
    providedIn: 'root'
})
export class DiscoveryApiService {

    /**
     * Gets product information for Content Services.
     */
    ecmProductInfo$ = new Subject<EcmProductVersionModel>();

    constructor(
        private apiService: AlfrescoApiService,
        private authenticationService: AuthenticationService) {

        merge(this.authenticationService.onTokenExchange.pipe(take(1)), this.authenticationService.onLogin)
            .pipe(
                filter(() => this.apiService.getInstance()?.isEcmLoggedIn()),
                switchMap(() => this.getEcmProductInfo())
            )
            .subscribe((info) => this.ecmProductInfo$.next(info));
    }

    /**
     * Gets product information for Content Services.
     * @returns ProductVersionModel containing product details
     */
    public getEcmProductInfo(): Observable<EcmProductVersionModel> {
        return from(this.apiService.getInstance().discovery.discoveryApi.getRepositoryInformation())
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
        return from(this.apiService.getInstance().activiti.aboutApi.getAppVersion())
            .pipe(
                map((res) => new BpmProductVersionModel(res)),
                catchError((err) => throwError(err))
            );
    }

    private get systemPropertiesApi(): Activiti.SystemPropertiesApi {
        return this.apiService.getInstance().activiti.systemPropertiesApi;
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
