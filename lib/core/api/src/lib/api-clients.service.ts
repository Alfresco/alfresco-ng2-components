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

import { Inject, Injectable } from '@angular/core';
import { ApiClientFactory, API_CLIENT_FACTORY_TOKEN } from './api-client.factory';
import { Constructor, Dictionary } from './types';

/* eslint-disable */

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace AlfrescoCore {
        interface ApiRegistry {
        }
    }
}
/* eslint-enable */

@Injectable()
export class ApiClientsService {

    constructor(@Inject(API_CLIENT_FACTORY_TOKEN) private apiCreateFactory: ApiClientFactory) {
    }

    private registry: Dictionary<Constructor<any>> = {};
    private instances: Partial<AlfrescoCore.ApiRegistry> = {};

    get<T extends keyof AlfrescoCore.ApiRegistry>(apiName: T): AlfrescoCore.ApiRegistry[T] {

        const apiClass = this.registry[apiName];

        if (!apiClass) {
            throw new Error(`Api not registred: ${apiName}`);
        }

        return this.instances[apiName] as AlfrescoCore.ApiRegistry[T] ?? this.instantiateApi(apiName);
    }


    register<T extends keyof AlfrescoCore.ApiRegistry>(apiName: T, api: Constructor<AlfrescoCore.ApiRegistry[T]>): void {
        this.registry[apiName] = api;
    }

    private instantiateApi<T extends keyof AlfrescoCore.ApiRegistry>(apiName: T): AlfrescoCore.ApiRegistry[T] {
        const apiClass = this.registry[apiName];
        const instance = this.apiCreateFactory.create<AlfrescoCore.ApiRegistry[T]>(apiClass);
        this.instances[apiName] = instance;

        return instance;
    }
}

