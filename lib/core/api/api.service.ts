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

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private registry: { [key: string]: new() => any } = {};

    get<T extends keyof Api.ApiRegistry>(apiName: T): Api.ApiRegistry[T] {
        if (this.registry[apiName] === undefined) {
            throw new Error(`Api not registred: ${apiName}`);
        }

        /* tslint:disable-next-line:variable-name */
        const ApiClass = this.registry[apiName];
        return new ApiClass();
    }

    register<T extends keyof Api.ApiRegistry>(apiName: T, api: new() => Api.ApiRegistry[T]): void {
        this.registry[apiName] = api;
    }
}
