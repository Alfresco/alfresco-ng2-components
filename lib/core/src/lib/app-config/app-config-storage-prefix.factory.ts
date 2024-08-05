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

import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';
import { AppConfigService, AppConfigValues } from './app-config.service';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

export interface StoragePrefixFactoryService {
    getPrefix(): Observable<string | undefined>;
}

export const STORAGE_PREFIX_FACTORY_SERVICE = new InjectionToken<StoragePrefixFactoryService>('STORAGE_PREFIX_FACTORY_SERVICE');

@Injectable({
    providedIn: 'root'
})
export class StoragePrefixFactory {
    constructor(
        private appConfigService: AppConfigService,
        @Optional()
        @Inject(STORAGE_PREFIX_FACTORY_SERVICE) private storagePrefixFactory?: StoragePrefixFactoryService
    ) { /* empty */ }

    getPrefix(): Observable<string | undefined> {
        return this.appConfigService.select(AppConfigValues.STORAGE_PREFIX).pipe(
            switchMap((prefix: string | undefined) => {
                if (prefix) {
                    return of(prefix);
                }

                return this.storagePrefixFactory ?
                    this.storagePrefixFactory.getPrefix() :
                    of(prefix);
            })
        );
    }
}
