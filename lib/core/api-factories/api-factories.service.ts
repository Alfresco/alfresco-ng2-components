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

const isRegisteredApi = (name: string, registry: ApiFactories.ApiNames): boolean => Object.keys(registry).some((key) => key === name);
@Injectable({
    providedIn: 'root'
})
export class ApiFactoriesService {
  private registry: ApiFactories.ApiNames = {} as  ApiFactories.ApiNames;

  get<T extends keyof ApiFactories.ApiNames>(apiName: T): ApiFactories.ApiNames[T] {

    if (!isRegisteredApi(apiName as string, this.registry)) {
      throw Error('Api not registred');
    }

    return this.registry[apiName];
  }

  register<T extends keyof ApiFactories.ApiNames>(apiName: T, api: ApiFactories.ApiNames[T]): void {
    this.registry = {
      ...this.registry,
      [apiName]: api
    };
  }

}
