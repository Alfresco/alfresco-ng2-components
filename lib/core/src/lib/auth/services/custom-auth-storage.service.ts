/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Inject, Injectable, InjectionToken } from '@angular/core';
import { StorageService } from '../../common/services/storage.service';
import { Observable } from 'rxjs';

export const CUSTOM_AUTH_STORAGE_PREFIX = new InjectionToken<any>('CUSTOM_AUTH_STORAGE_PREFIX');

@Injectable()
export class CustomAuthStorageService extends StorageService {

  constructor(@Inject(CUSTOM_AUTH_STORAGE_PREFIX) customAuthStoragePrefix$: Observable<string>) {
      super();
      customAuthStoragePrefix$.subscribe(prefix => {
        this.prefix = prefix;
      });
  }
}
