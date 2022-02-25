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

/*tslint:disable*/ // => because of ADF file naming problems... Try to remove it, if you don't believe me :P

import { Injectable } from '@angular/core';
import {  DiscoveryApi } from '@alfresco/js-api';
import { AngularAlfrescoApi } from './angular-alfresco-api';

@Injectable()
export class AlfrescoApiClientFactory {
    // Here we should all the APIs from js-api
    private discoveryApi: DiscoveryApi = null;

    constructor(
        private angularAlfrescoApi?: AngularAlfrescoApi) {
    }

    getDiscoveryApi() {
        // DiscoveryApi needs to rely on a lot thinner interface: JsApiHttpClient;
        this.discoveryApi = this.discoveryApi || new DiscoveryApi(this.angularAlfrescoApi as any);
        return this.discoveryApi;
    }

    getNodesApi () {
        // TODO
    }

    getSearchApi() {
        // TODO
    }

    // etc...
}
