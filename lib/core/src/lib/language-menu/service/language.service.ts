/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { LanguageServiceInterface } from './language.service.interface';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AppConfigService, AppConfigValues } from '../../app-config/app-config.service';
import { LanguageItem } from '../../common/services/language-item.interface';
import { UserPreferencesService } from '../../common/services/user-preferences.service';

@Injectable({providedIn: 'root'})
export class LanguageService implements LanguageServiceInterface {

    private languages = new BehaviorSubject<LanguageItem[]>([
        {key: 'de', label: 'Deutsch'},
        {key: 'en', label: 'English'},
        {key: 'es', label: 'Español'},
        {key: 'fr', label: 'Français'},
        {key: 'it', label: 'Italiano'},
        {key: 'ja', label: '日本語'},
        {key: 'nb', label: 'Bokmål'},
        {key: 'nl', label: 'Nederlands'},
        {key: 'pt-BR', label: 'Português (Brasil)'},
        {key: 'ru', label: 'Русский'},
        {key: 'zh-CN', label: '中文简体'},
        {key: 'cs', label: 'Čeština'},
        {key: 'da', label: 'Dansk'},
        {key: 'fi', label: 'Suomi'},
        {key: 'pl', label: 'Polski'},
        {key: 'sv', label: 'Svenska'},
        {key: 'ar', label: 'العربية', direction: 'rtl'}
    ]);

    languages$ = this.languages.asObservable();

    constructor(
        appConfigService: AppConfigService,
        private userPreferencesService: UserPreferencesService) {

        const customLanguages = appConfigService.get<Array<LanguageItem>>(AppConfigValues.APP_CONFIG_LANGUAGES_KEY);
        this.setLanguages(customLanguages);
    }

    changeLanguage(language: LanguageItem) {
        this.userPreferencesService.locale = language.key;
        this.userPreferencesService.set('textOrientation', language.direction || 'ltr');
    }

    setLanguages(items: LanguageItem[]) {
        if (items?.length > 0) {
            this.languages.next(items);
        }
    }
}
