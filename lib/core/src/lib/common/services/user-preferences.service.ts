/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { inject, Injectable, RendererFactory2 } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { AppConfigService, AppConfigValues } from '../../app-config/app-config.service';
import { StorageService } from './storage.service';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { LanguageItem } from './language-item.interface';
import { DOCUMENT } from '@angular/common';
import { Directionality, Direction } from '@angular/cdk/bidi';
import { DEFAULT_LANGUAGE_LIST } from '../models/default-languages.model';

// eslint-disable-next-line no-shadow
export enum UserPreferenceValues {
    PaginationSize = 'paginationSize',
    Locale = 'locale',
    SupportedPageSizes = 'supportedPageSizes',
    ExpandedSideNavStatus = 'expandedSidenav'
}

@Injectable({
    providedIn: 'root'
})
export class UserPreferencesService {
    private document = inject(DOCUMENT);
    private rendererFactory = inject(RendererFactory2);
    private directionality = inject(Directionality);

    defaults = {
        paginationSize: 25,
        supportedPageSizes: [5, 10, 15, 20],
        locale: 'en',
        expandedSidenav: true
    };

    private userPreferenceStatus: any = this.defaults;
    private onChangeSubject: BehaviorSubject<any>;
    onChange: Observable<any>;

    constructor(public translate: TranslateService, private appConfig: AppConfigService, private storage: StorageService) {
        this.onChangeSubject = new BehaviorSubject(this.userPreferenceStatus);
        this.onChange = this.onChangeSubject.asObservable();

        this.appConfig.onLoad.subscribe(() => {
            this.initUserPreferenceStatus();
        });

        const renderer = this.rendererFactory.createRenderer(null, null);

        this.select('textOrientation').subscribe((direction: Direction) => {
            renderer.setAttribute(this.document.body, 'dir', direction);
            (this.directionality as any).value = direction;
        });
    }

    private initUserPreferenceStatus() {
        this.initUserLanguage();
        this.set(UserPreferenceValues.PaginationSize, this.paginationSize);
        this.set(UserPreferenceValues.SupportedPageSizes, JSON.stringify(this.supportedPageSizes));
    }

    private initUserLanguage() {
        if (this.locale || this.appConfig.get<string>(UserPreferenceValues.Locale)) {
            const locale = this.locale || this.getDefaultLocale();

            this.set(UserPreferenceValues.Locale, locale);
            this.set('textOrientation', this.getLanguageByKey(locale).direction || 'ltr');
        } else {
            const locale = this.locale || this.getDefaultLocale();

            this.setWithoutStore(UserPreferenceValues.Locale, locale);
            this.setWithoutStore('textOrientation', this.getLanguageByKey(locale).direction || 'ltr');
        }
    }

    /**
     * Sets up a callback to notify when a property has changed.
     *
     * @param property The property to watch
     * @returns Notification callback
     */
    select<T = any>(property: string): Observable<T> {
        return this.onChange.pipe(
            map((userPreferenceStatus) => userPreferenceStatus[property]),
            distinctUntilChanged()
        );
    }

    /**
     * Gets a preference property.
     *
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
     *
     * @param property Name of the property
     * @param value New value for the property
     */
    set(property: string, value: any) {
        if (!property) {
            return;
        }
        this.storage.setItem(this.getPropertyKey(property), value);
        this.userPreferenceStatus[property] = value;
        this.onChangeSubject.next(this.userPreferenceStatus);
    }

    /**
     * Sets a preference property.
     *
     * @param property Name of the property
     * @param value New value for the property
     */
    setWithoutStore(property: string, value: any) {
        if (!property) {
            return;
        }
        this.userPreferenceStatus[property] = value;
        this.onChangeSubject.next(this.userPreferenceStatus);
    }

    /**
     * Check if an item is present in the storage
     *
     * @param property Name of the property
     * @returns True if the item is present, false otherwise
     */
    hasItem(property: string): boolean {
        if (!property) {
            return false;
        }
        return this.storage.hasItem(this.getPropertyKey(property));
    }

    /**
     * Gets the active storage prefix for preferences.
     *
     * @returns Storage prefix
     */
    getStoragePrefix(): string {
        return this.storage.getItem('USER_PROFILE') || 'GUEST';
    }

    /**
     * Sets the active storage prefix for preferences.
     *
     * @param value Name of the prefix
     */
    setStoragePrefix(value: string | null) {
        this.storage.setItem('USER_PROFILE', value || 'GUEST');
        this.initUserPreferenceStatus();
    }

    /**
     * Gets the full property key with prefix.
     *
     * @param property The property name
     * @returns Property key
     */
    getPropertyKey(property: string): string {
        return `${this.getStoragePrefix()}__${property}`;
    }

    /**
     * Gets an array containing the available page sizes.
     *
     * @returns Array of page size values
     */
    get supportedPageSizes(): number[] {
        const supportedPageSizes = this.get(UserPreferenceValues.SupportedPageSizes);

        if (supportedPageSizes) {
            return JSON.parse(supportedPageSizes);
        } else {
            return this.appConfig.get('pagination.supportedPageSizes', this.defaults.supportedPageSizes);
        }
    }

    set supportedPageSizes(value: number[]) {
        this.set(UserPreferenceValues.SupportedPageSizes, JSON.stringify(value));
    }

    /** Pagination size. */
    set paginationSize(value: number) {
        this.set(UserPreferenceValues.PaginationSize, value);
    }

    get paginationSize(): number {
        const paginationSize = this.get(UserPreferenceValues.PaginationSize);

        if (paginationSize) {
            return Number(paginationSize);
        } else {
            return Number(this.appConfig.get('pagination.size', this.defaults.paginationSize));
        }
    }

    /**
     * Current locale setting.
     *
     * @returns locale name
     */
    get locale(): string {
        return this.get(UserPreferenceValues.Locale);
    }

    set locale(value: string) {
        this.set(UserPreferenceValues.Locale, value);
    }

    /**
     * Gets the default locale.
     *
     * @returns Default locale language code
     */
    getDefaultLocale(): string {
        return this.appConfig.get<string>(UserPreferenceValues.Locale) || this.translate.getBrowserCultureLang() || 'en';
    }

    private getLanguageByKey(key: string): LanguageItem {
        const defaultLanguage = { key: 'en' } as LanguageItem;
        let language: LanguageItem;

        const customLanguages = this.appConfig.get<Array<LanguageItem>>(AppConfigValues.APP_CONFIG_LANGUAGES_KEY);
        if (Array.isArray(customLanguages)) {
            language = customLanguages.find((customLanguage) => key.includes(customLanguage.key));
        }
        language ??= DEFAULT_LANGUAGE_LIST.find((defaultLang) => defaultLang.key === key) ?? defaultLanguage;
        return language;
    }
}
