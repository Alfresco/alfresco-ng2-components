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

import { Inject, Injectable } from '@angular/core';
import { Constructor, Dictionary } from '../interface';
import { ApiClientFactory, API_CLIENT_FACTORY_TOKEN } from './api-client.factory';

@Injectable()
export class ApiClientsService {

    constructor(@Inject(API_CLIENT_FACTORY_TOKEN) private apiCreateFactory: ApiClientFactory) {}

    private registry: Dictionary<Constructor<any>> = {};
    private instances: Partial<Api.ApiRegistry> = {};

    get<T extends keyof Api.ApiRegistry>(apiName: T): Api.ApiRegistry[T] {

        const ApiClass = this.registry[apiName];

        if (!ApiClass) {
            throw new Error(`Api not registred: ${apiName}`);
        }

        const api = this.instances[apiName] as Api.ApiRegistry[T] ?? this.instantiateApi(apiName);
        return api;
    }


    register<T extends keyof Api.ApiRegistry>(apiName: T, api: Constructor<Api.ApiRegistry[T]>): void {
        this.registry[apiName] = api;
    }

    private instantiateApi<T extends keyof Api.ApiRegistry>(apiName: T): Api.ApiRegistry[T] {
      const ApiClass = this.registry[apiName];
      const instance = this.apiCreateFactory.create<Api.ApiRegistry[T]>(ApiClass);
      this.instances[apiName] = instance;

      return instance;
    }
}

