/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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
import { Observable } from 'rxjs/Rx';
import { BpmProductVersionModel, EcmProductVersionModel } from '../models/product-version.model';
import { AlfrescoApiService } from './alfresco-api.service';

@Injectable()
export class DiscoveryApiService {

    constructor(private apiService: AlfrescoApiService) { }

    public getEcmProductInfo() {
        return Observable.fromPromise(
            this.apiService.getInstance().discovery.discoveryApi.getRepositoryInformation())
            .map(res => new EcmProductVersionModel(res))
            .catch(this.handleError);
    }

    public getBpmProductInfo() {
        return Observable.fromPromise(
            this.apiService.getInstance().activiti.aboutApi.getAppVersion())
            .map(res => new BpmProductVersionModel(res))
            .catch(this.handleError);
    }

    private handleError(error): Observable<any> {
        return Observable.throw(error);
    }
}
