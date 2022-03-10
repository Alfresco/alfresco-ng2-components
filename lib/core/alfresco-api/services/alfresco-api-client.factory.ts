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
import {  DiscoveryApi, NodesApi, PeopleApi, UserProfileApi } from '@alfresco/js-api';
import { AlfrescoApiV2 } from './alfresco-api-v2';

@Injectable()
export class AlfrescoApiClientFactory {
    // Here we should have all the APIs from js-api
    private discoveryApi: DiscoveryApi = null;
    private nodesApi: NodesApi = null;
    private peopleApi: PeopleApi = null;
    private profileApi: UserProfileApi = null;

    constructor(
        private angularAlfrescoApi?: AlfrescoApiV2) {
    }

    getDiscoveryApi(): DiscoveryApi {
        // DiscoveryApi needs to rely on a lot thinner interface: JsApiHttpClient; For now: "as any"
        this.discoveryApi = this.discoveryApi ?? new DiscoveryApi(this.angularAlfrescoApi as any);
        return this.discoveryApi;
    }

    getNodesApi(): NodesApi {
        // NodesApi needs to rely on a lot thinner interface: JsApiHttpClient; For now: "as any"
        this.nodesApi = this.nodesApi ?? new NodesApi(this.angularAlfrescoApi as any);
        return this.nodesApi;
    }

    getPeopleApi(): PeopleApi {
        // PeopleApi needs to rely on a lot thinner interface: JsApiHttpClient; For now: "as any"
        this.peopleApi = this.peopleApi ?? new PeopleApi(this.angularAlfrescoApi as any);
        return this.peopleApi;
    }

    getProfileApi(): UserProfileApi {
        // PeopleApi needs to rely on a lot thinner interface: JsApiHttpClient; For now: "as any"
        this.profileApi = this.profileApi ?? new UserProfileApi(this.angularAlfrescoApi as any);
        return this.profileApi;
    }

    getSearchApi() {
        // TODO
    }

    // etc...
}
