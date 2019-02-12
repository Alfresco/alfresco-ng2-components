/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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
import { Title } from '@angular/platform-browser';
import { AppConfigService } from '../app-config/app-config.service';
import { TranslationService } from './translation.service';

@Injectable({
    providedIn: 'root'
})
export class PageTitleService {

    private originalTitle: string = '';
    private translatedTitle: string = '';

    constructor(
        private titleService: Title,
        private appConfig: AppConfigService,
        private translationService: TranslationService) {
        translationService.translate.onLangChange.subscribe(() => this.onLanguageChanged());
        translationService.translate.onTranslationChange.subscribe(() => this.onLanguageChanged());
    }

    /**
     * Sets the page title.
     * @param value The new title
     */
    setTitle(value: string = '') {
        this.originalTitle = value;
        this.translatedTitle = this.translationService.instant(value);

        this.updateTitle();
    }

    private onLanguageChanged() {
        this.translatedTitle = this.translationService.instant(this.originalTitle);
        this.updateTitle();
    }

    private updateTitle() {
        const name = this.appConfig.get('application.name') || 'Alfresco ADF Application';

        const title = this.translatedTitle ? `${this.translatedTitle} - ${name}` : `${name}`;
        this.titleService.setTitle(title);
    }
}
