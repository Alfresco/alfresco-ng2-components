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

import { inject, Injectable, RendererFactory2, Signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { AppConfigService, AppConfigValues } from '../../app-config/app-config.service';
import { StorageService } from './storage.service';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { LanguageItem } from './language-item.interface';
import { DOCUMENT } from '@angular/common';
import { Directionality, Direction } from '@angular/cdk/bidi';
import { DEFAULT_LANGUAGE_LIST } from '../models/default-languages.model';
import { toSignal } from '@angular/core/rxjs-interop';

export const UserPreferenceValues = {
    PaginationSize: 'paginationSize',
    Locale: 'locale',
    SupportedPageSizes: 'supportedPageSizes',
    ExpandedSideNavStatus: 'expandedSidenav'
} as const;

export type UserPreferenceValues = (typeof UserPreferenceValues)[keyof typeof UserPreferenceValues];

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

    private userPreferenceStatus: any = { ...this.defaults };
    private onChangeSubject: BehaviorSubject<any>;
    onChange: Observable<any>;

    /**
     * Observable that emits the current locale whenever it changes.
     * This is a convenience property that simplifies subscribing to locale changes.
     *
     * @example Observable usage (requires manual unsubscription):
     * ```typescript
     * constructor(private userPreferencesService: UserPreferencesService) {
     *   this.userPreferencesService.locale$
     *     .pipe(takeUntilDestroyed())
     *     .subscribe(locale => {
     *       this.currentLocale = locale;
     *     });
     * }
     * ```
     *
     * @example Signal usage (automatic cleanup, recommended):
     * ```typescript
     * export class MyComponent {
     *   private userPreferencesService = inject(UserPreferencesService);
     *   currentLocale = this.userPreferencesService.localeSignal; // Signal - no subscription needed!
     * }
     * ```
     */
    readonly locale$: Observable<string>;

    /**
     * Signal that provides the current locale value.
     * Automatically handles cleanup - no need for takeUntilDestroyed or manual unsubscription.
     * This is the recommended way to access locale in components.
     */
    readonly localeSignal: Signal<string>;

    /**
     * Observable that emits the current pagination size whenever it changes.
     */
    readonly paginationSize$: Observable<number>;

    /**
     * Signal that provides the current pagination size value.
     */
    readonly paginationSizeSignal: Signal<number>;

    /**
     * Observable that emits the supported page sizes whenever they change.
     */
    readonly supportedPageSizes$: Observable<number[]>;

    /**
     * Signal that provides the supported page sizes array.
     */
    readonly supportedPageSizesSignal: Signal<number[]>;

    constructor(
        public translate: TranslateService,
        private appConfig: AppConfigService,
        private storage: StorageService
    ) {
        this.onChangeSubject = new BehaviorSubject(this.userPreferenceStatus);
        this.onChange = this.onChangeSubject.asObservable();

        // Initialize convenience observables
        this.locale$ = this.select<string>(UserPreferenceValues.Locale);
        this.paginationSize$ = this.select<number>(UserPreferenceValues.PaginationSize);
        this.supportedPageSizes$ = this.select<string>(UserPreferenceValues.SupportedPageSizes).pipe(
            map((value) => (value ? JSON.parse(value) : this.defaults.supportedPageSizes))
        );

        // Initialize convenience signals (automatically handle cleanup)
        this.localeSignal = toSignal(this.locale$, { initialValue: this.defaults.locale });
        this.paginationSizeSignal = toSignal(this.paginationSize$, { initialValue: this.defaults.paginationSize });
        this.supportedPageSizesSignal = toSignal(this.supportedPageSizes$, { initialValue: this.defaults.supportedPageSizes });

        this.appConfig.onLoad.subscribe(() => {
            this.initUserPreferenceStatus();
        });

        const renderer = this.rendererFactory.createRenderer(null, null);

        this.select('textOrientation').subscribe((direction: Direction) => {
            renderer.setAttribute(this.document.body, 'dir', direction);
            this.directionality.valueSignal.set(direction);
            this.directionality.change.emit(direction);
        });
    }

    private initUserPreferenceStatus() {
        this.initUserLanguage();
        this.initPaginationPreferences();
    }

    private initPaginationPreferences() {
        // Check if values are already in storage
        const storedPaginationSize = this.get(UserPreferenceValues.PaginationSize);
        const storedSupportedPageSizes = this.get(UserPreferenceValues.SupportedPageSizes);

        if (storedPaginationSize) {
            // Already in storage - just update in-memory state
            this.setWithoutStore(UserPreferenceValues.PaginationSize, Number(storedPaginationSize));
        } else {
            // Not in storage - get from config and save
            const paginationSize = this.appConfig.get('pagination.size', this.defaults.paginationSize);
            this.set(UserPreferenceValues.PaginationSize, paginationSize);
        }

        if (storedSupportedPageSizes) {
            // Already in storage - just update in-memory state
            this.setWithoutStore(UserPreferenceValues.SupportedPageSizes, storedSupportedPageSizes);
        } else {
            // Not in storage - get from config and save
            const supportedPageSizes = this.appConfig.get('pagination.supportedPageSizes', this.defaults.supportedPageSizes);
            this.set(UserPreferenceValues.SupportedPageSizes, JSON.stringify(supportedPageSizes));
        }
    }

    private initUserLanguage() {
        const storedLocale = this.get(UserPreferenceValues.Locale);
        const configLocale = this.appConfig.get<string>(UserPreferenceValues.Locale);

        if (storedLocale) {
            // Locale already in storage - just update in-memory state, don't re-save
            this.setWithoutStore(UserPreferenceValues.Locale, storedLocale);
            this.setWithoutStore('textOrientation', this.getLanguageByKey(storedLocale).direction || 'ltr');
        } else if (configLocale) {
            // Locale from config but not in storage - save to storage
            this.set(UserPreferenceValues.Locale, configLocale);
            this.set('textOrientation', this.getLanguageByKey(configLocale).direction || 'ltr');
        } else {
            // No locale anywhere - use default, don't save to storage
            const locale = this.getDefaultLocale();
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
        return this.get(UserPreferenceValues.Locale) || this.getDefaultLocale();
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
