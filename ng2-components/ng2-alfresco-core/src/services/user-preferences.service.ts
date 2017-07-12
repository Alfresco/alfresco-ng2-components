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
import { AppConfigService } from './app-config.service';
import { StorageService } from './storage.service';

@Injectable()
export class UserPreferencesService {

    private defaults = {
        paginationSize: 25
    };

    getStoragePrefix(): string {
        return this.storage.getItem('USER_PROFILE') || 'GUEST';
    }

    setStoragePrefix(value: string) {
        this.storage.setItem('USER_PROFILE', value || 'GUEST');
    }

    constructor(
        appConfig: AppConfigService,
        private storage: StorageService) {
        this.defaults.paginationSize = appConfig.get('pagination.size', 25);
    }

    getPropertyKey(property: string): string {
        return `${this.getStoragePrefix()}__${property}`;
    }

    set(property: string, value: any) {
        if (!property) { return; }

        this.storage.setItem(
            this.getPropertyKey(property),
            value
        );
    }

    get(property: string): string {
        const key = this.getPropertyKey(property);
        return this.storage.getItem(key);
    }

    set paginationSize(value: number) {
        this.set('PAGINATION_SIZE', value);
    }

    get paginationSize(): number {
        return Number(this.get('PAGINATION_SIZE')) || this.defaults.paginationSize;
    }

}
