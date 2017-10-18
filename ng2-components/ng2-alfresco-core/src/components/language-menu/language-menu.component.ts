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
import { AppConfigService } from '../../services/app-config.service';
import { UserPreferencesService } from '../../services/user-preferences.service';

@Component({
    selector: 'adf-lanugage-menu',
    template: `
            <button mat-menu-item *ngFor="let language of languages" (click)="changeLanguage(language.key)">{{language.label}}</button>
    `
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
        const languagesCongifApp = this.appConfig.get<Array<any>>(AppConfigService.APP_CONFIG_LANGUAGES_KEY);
        if (languagesCongifApp) {
            this.languages = languagesCongifApp;
        }
    }

    changeLanguage(lang: string) {
        this.userPreference.locale = lang;
    }

}
