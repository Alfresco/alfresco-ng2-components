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
import { Observable } from 'rxjs/Observable';
import { AppConfigService } from '../app-config/app-config.service';
import { StorageService } from './storage.service';
import 'rxjs/add/operator/distinctUntilChanged';
import { OauthConfigModel } from '../models/oauth-config.model';

export enum UserPreferenceValues {
    PaginationSize = 'PAGINATION_SIZE',
    DisableCSRF = 'DISABLE_CSRF',
    Locale = 'LOCALE',
    SupportedPageSizes = 'supportedPageSizes'
}

@Injectable()
export class UserPreferencesService {

    defaults = {
        paginationSize: 25,
        supportedPageSizes: [5, 10, 15, 20],
        locale: 'en'
    };

    private userPreferenceStatus: any = {
        paginationSize: 25,
        supportedPageSizes: [5, 10, 15, 20],
        LOCALE: 'en'
    };

    /**
     * @deprecated we are grouping every value changed on the user preference in a single stream : userPreferenceValue$
     */
    locale$: Observable<string>;
    private localeSubject: BehaviorSubject<string> ;

    private onChangeSubject: BehaviorSubject<any>;
    onChange: Observable<any>;

    constructor(
        public translate: TranslateService,
        private appConfig: AppConfigService,
        private storage: StorageService
    ) {
        this.appConfig.onLoad.subscribe(this.initUserPreferenceStatus.bind(this));
        this.localeSubject = new BehaviorSubject(this.userPreferenceStatus[UserPreferenceValues.Locale]);
        this.locale$ = this.localeSubject.asObservable();
        this.onChangeSubject = new BehaviorSubject(this.userPreferenceStatus);
        this.onChange = this.onChangeSubject.asObservable();
    }

    private initUserPreferenceStatus() {
        this.userPreferenceStatus[UserPreferenceValues.Locale] = this.locale || this.getDefaultLocale();
        this.userPreferenceStatus[UserPreferenceValues.PaginationSize] = this.paginationSize ?
            this.paginationSize : this.appConfig.get('pagination.size', this.defaults.paginationSize);
        this.userPreferenceStatus[UserPreferenceValues.SupportedPageSizes] = this.appConfig.get('pagination.supportedPageSizes', this.defaults.supportedPageSizes);
        this.userPreferenceStatus[UserPreferenceValues.DisableCSRF] = this.disableCSRF;
    }

    /**
     * Sets up a callback to notify when a property has changed.
     * @param property The property to watch
     * @returns Notification callback
     */
    select(property: string): Observable<any> {
        return this.onChange.map((userPreferenceStatus) => userPreferenceStatus[property]).distinctUntilChanged();
    }

    /**
     * Gets a preference property.
     * @param property Name of the property
     * @param defaultValue Default to return if the property is not found
     * @returns Preference property
     */
    get(property: string, defaultValue?: string): string {
        const key = this.getPropertyKey(property);
        const value = this.storage.getItem(key);
        if (value === undefined || value === null) {
            return defaultValue;
        }
        return value;
    }

    /**
     * Sets a preference property.
     * @param property Name of the property
     * @param value New value for the property
     */
    set(property: string, value: any) {
        if (!property) { return; }
        this.storage.setItem(
            this.getPropertyKey(property),
            value
        );
        this.userPreferenceStatus[property] = value;
        this.onChangeSubject.next(this.userPreferenceStatus);
    }

    /**
     * Gets the active storage prefix for preferences.
     * @returns Storage prefix
     */
    getStoragePrefix(): string {
        return this.storage.getItem('USER_PROFILE') || 'GUEST';
    }

    /**
     * Sets the active storage prefix for preferences.
     * @param value Name of the prefix
     */
    setStoragePrefix(value: string) {
        this.storage.setItem('USER_PROFILE', value || 'GUEST');
    }

    /**
     * Gets the full property key with prefix.
     * @param property The property name
     * @returns Property key
     */
    getPropertyKey(property: string): string {
        return `${this.getStoragePrefix()}__${property}`;
    }

    /**
     * Gets an array containing the available page sizes.
     * @returns Array of page size values
     */
    getDefaultPageSizes(): number[] {
        return this.defaults.supportedPageSizes;
    }

    /** Authorization type (can be "ECM", "BPM" or "ALL"). */
    set authType(value: string) {
        this.storage.setItem('AUTH_TYPE', value);
    }

    get authType(): string {
        return this.storage.getItem('AUTH_TYPE') || 'ALL';
    }

    /** Prevents the CSRF Token from being submitted if true. Only valid for Process Services. */
    set disableCSRF(value: boolean) {
        this.set('DISABLE_CSRF', value);
    }

    get disableCSRF(): boolean {
        return this.get('DISABLE_CSRF') === 'true';
    }

    /** Pagination size. */
    set paginationSize(value: number) {
        this.set('PAGINATION_SIZE', value);
    }

    get paginationSize(): number {
        return Number(this.get('PAGINATION_SIZE')) || this.defaults.paginationSize;
    }

    /** Current locale setting. */
    get locale(): string {
        const locale = this.get('LOCALE');
        return locale;
    }

    set locale(value: string) {
        this.localeSubject.next(value);
        this.set('LOCALE', value);
    }

    /**
     * Gets the default locale.
     * @returns Default locale language code
     */
    public getDefaultLocale(): string {
        return this.appConfig.get<string>('locale') || this.translate.getBrowserLang() || 'en';
    }

    get providers(): string {
        if (this.storage.hasItem('providers')) {
            return this.storage.getItem('providers');
        } else {
            return this.appConfig.get('providers', 'ECM');
        }
    }

    set providers(providers: string) {
        this.storage.setItem('providers', providers);
    }

    get bpmHost(): string {
        if (this.storage.hasItem('bpmHost')) {
            return this.storage.getItem('bpmHost');
        } else {
            return this.appConfig.get('bpmHost');
        }
    }

    set bpmHost(bpmHost: string) {
        this.storage.setItem('bpmHost', bpmHost);
    }

    get ecmHost(): string {
        if (this.storage.hasItem('ecmHost')) {
            return this.storage.getItem('ecmHost');
        } else {
            return this.appConfig.get('ecmHost');
        }
    }

    set ecmHost(ecmHost: string) {
        this.storage.setItem('ecmHost', ecmHost);
    }

    get oauthConfig(): OauthConfigModel {
        if (this.storage.hasItem('oauthConfig')) {
            return JSON.parse(this.storage.getItem('oauthConfig'));
        } else {
            return this.appConfig.get<OauthConfigModel>('oauth2');
        }
    }

    set oauthConfig(oauthConfig: OauthConfigModel) {
        this.storage.setItem('oauthConfig', JSON.stringify(oauthConfig));
    }

    get sso(): boolean {
        return this.providers === 'OAUTH' && this.oauthConfig.implicitFlow;
    }

}
