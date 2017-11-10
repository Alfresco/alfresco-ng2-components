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
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Rx';
import { AlfrescoApiService } from './alfresco-api.service';
import { AppConfigService } from './app-config.service';
import { StorageService } from './storage.service';

@Injectable()
export class UserPreferencesService {

    private defaults = {
        paginationSize: 25,
        locale: 'en'
    };

    private localeSubject: BehaviorSubject<string> ;
    locale$: Observable<string>;

    constructor(
        public translate: TranslateService,
        private appConfig: AppConfigService,
        private storage: StorageService,
        private apiService: AlfrescoApiService
    ) {
        const currentLocale = this.locale || this.getDefaultLocale();
        this.localeSubject = new BehaviorSubject(currentLocale);
        this.locale$ = this.localeSubject.asObservable();
        this.defaults.paginationSize = appConfig.get('pagination.size', 25);
    }

    get(property: string, defaultValue?: string): string {
        const key = this.getPropertyKey(property);
        const value = this.storage.getItem(key);
        if (value === undefined) {
            return defaultValue;
        }
        return value;
    }

    set(property: string, value: any) {
        if (!property) { return; }

        this.storage.setItem(
            this.getPropertyKey(property),
            value
        );
    }

    getStoragePrefix(): string {
        return this.storage.getItem('USER_PROFILE') || 'GUEST';
    }

    setStoragePrefix(value: string) {
        this.storage.setItem('USER_PROFILE', value || 'GUEST');
    }

    getPropertyKey(property: string): string {
        return `${this.getStoragePrefix()}__${property}`;
    }

    set authType(value: string) {
        this.storage.setItem('AUTH_TYPE', value);
        this.apiService.reset();
    }

    get authType(): string {
        return this.storage.getItem('AUTH_TYPE') || 'ALL';
    }

    set disableCSRF(value: boolean) {
        this.set('DISABLE_CSRF', value);
        this.apiService.reset();
    }

    get disableCSRF(): boolean {
        return this.get('DISABLE_CSRF') === 'true';
    }

    set paginationSize(value: number) {
        this.set('PAGINATION_SIZE', value);
    }

    get paginationSize(): number {
        return Number(this.get('PAGINATION_SIZE')) || this.defaults.paginationSize;
    }

    get locale(): string {
        const locale = this.get('LOCALE');
        return locale;
    }

    set locale(value: string) {
        this.localeSubject.next(value);
        this.set('LOCALE', value);
    }

    public getDefaultLocale(): string {
        return this.appConfig.get<string>('locale') || this.translate.getBrowserLang() || 'en';
    }

}
