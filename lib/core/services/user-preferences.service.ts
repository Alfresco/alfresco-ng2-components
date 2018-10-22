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
import { Observable, BehaviorSubject } from 'rxjs';
import { AppConfigService } from '../app-config/app-config.service';
import { StorageService } from './storage.service';
import { distinctUntilChanged, map } from 'rxjs/operators';

export enum UserPreferenceValues {
    PaginationSize = 'PAGINATION_SIZE',
    Locale = 'LOCALE',
    SupportedPageSizes = 'supportedPageSizes'
}

@Injectable({
    providedIn: 'root'
})
export class UserPreferencesService {

    defaults = {
        paginationSize: 25,
        supportedPageSizes: [5, 10, 15, 20],
        locale: 'en'
    };

    private userPreferenceStatus: any = this.defaults;

    /**
     * @deprecated we are grouping every value changed on the user preference in a single stream : userPreferenceValue$
     */
    locale$: Observable<string>;
    private localeSubject: BehaviorSubject<string>;

    private onChangeSubject: BehaviorSubject<any>;
    onChange: Observable<any>;

    constructor(public translate: TranslateService,
                private appConfig: AppConfigService,
                private storage: StorageService) {
        this.appConfig.onLoad.subscribe(this.initUserPreferenceStatus.bind(this));
        this.localeSubject = new BehaviorSubject(this.get(UserPreferenceValues.Locale, this.getDefaultLocale()));
        this.locale$ = this.localeSubject.asObservable();
        this.onChangeSubject = new BehaviorSubject(this.userPreferenceStatus);
        this.onChange = this.onChangeSubject.asObservable();
    }

    private initUserPreferenceStatus() {
        this.userPreferenceStatus[UserPreferenceValues.Locale] = this.locale || this.getDefaultLocale();
        this.userPreferenceStatus[UserPreferenceValues.PaginationSize] = this.appConfig.get('pagination.size', this.defaults.paginationSize);
        this.userPreferenceStatus[UserPreferenceValues.SupportedPageSizes] = this.appConfig.get('pagination.supportedPageSizes', this.defaults.supportedPageSizes);
    }

    /**
     * Sets up a callback to notify when a property has changed.
     * @param property The property to watch
     * @returns Notification callback
     */
    select(property: string): Observable<any> {
        return this.onChange
            .pipe(
                map((userPreferenceStatus) => userPreferenceStatus[property]),
                distinctUntilChanged()
            );
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
        if (!property) {
            return;
        }
        this.storage.setItem(
            this.getPropertyKey(property),
            value
        );
        this.userPreferenceStatus[property] = value;
        this.onChangeSubject.next(this.userPreferenceStatus);
    }

    /**
     * Check if an item is present in the storage
     * @param property Name of the property
     * @returns True if the item is present, false otherwise
     */
    hasItem(property: string) {
        if (!property) {
            return;
        }
        return this.storage.hasItem(
            this.getPropertyKey(property)
        );
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
        return this.userPreferenceStatus[UserPreferenceValues.SupportedPageSizes];
    }

    /** Pagination size. */
    set paginationSize(value: number) {
        this.set(UserPreferenceValues.PaginationSize, value);
    }

    get paginationSize(): number {
        return Number(this.get(UserPreferenceValues.PaginationSize, this.userPreferenceStatus[UserPreferenceValues.PaginationSize])) || this.defaults.paginationSize;
    }

    /** Current locale setting. */
    get locale(): string {
        const locale = this.get(UserPreferenceValues.Locale, this.userPreferenceStatus[UserPreferenceValues.Locale]);
        return locale;
    }

    set locale(value: string) {
        this.localeSubject.next(value);
        this.set(UserPreferenceValues.Locale, value);
    }

    /**
     * Gets the default locale.
     * @returns Default locale language code
     */
    public getDefaultLocale(): string {
        return this.appConfig.get<string>('locale') || this.translate.getBrowserLang() || 'en';
    }

}
