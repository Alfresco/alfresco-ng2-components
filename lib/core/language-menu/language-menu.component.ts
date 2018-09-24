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

import { Component, OnInit } from '@angular/core';
import { AppConfigService, AppConfigValues } from '../app-config/app-config.service';
import { UserPreferencesService } from '../services/user-preferences.service';

@Component({
    selector: 'adf-language-menu',
    templateUrl: 'language-menu.component.html'
})
export class LanguageMenuComponent implements OnInit {

    languages: Array<any> = [
        { key: 'en', label: 'English'}
    ];

    constructor(
        private appConfig: AppConfigService,
        private userPreference: UserPreferencesService) {
    }

    ngOnInit() {
        const languagesConfigApp = this.appConfig.get<Array<any>>(AppConfigValues.APP_CONFIG_LANGUAGES_KEY);
        if (languagesConfigApp) {
            this.languages = languagesConfigApp;
        }
    }

    changeLanguage(lang: string) {
        this.userPreference.locale = lang;
    }

}
