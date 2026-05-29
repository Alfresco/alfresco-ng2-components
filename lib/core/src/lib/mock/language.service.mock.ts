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

import { LanguageServiceInterface } from '../language-menu/service/language.service.interface';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LanguageItem } from '../common/services/language-item.interface';

@Injectable()
export class LanguageServiceMock implements LanguageServiceInterface {
    private readonly languages = new BehaviorSubject<LanguageItem[]>([
        { key: 'de-DE', label: 'Deutsch' },
        { key: 'en', label: 'English' },
        { key: 'es-ES', label: 'Español' },
        { key: 'fr-FR', label: 'Français' },
        { key: 'it-IT', label: 'Italiano' },
        { key: 'ja-JP', label: '日本語' },
        { key: 'nb-NO', label: 'Bokmål' },
        { key: 'nl-NL', label: 'Nederlands' },
        { key: 'pt-BR', label: 'Português (Brasil)' },
        { key: 'ru-RU', label: 'Русский' },
        { key: 'zh-CN', label: '中文简体' },
        { key: 'cs-CZ', label: 'Čeština' },
        { key: 'da-DK', label: 'Dansk' },
        { key: 'fi-FI', label: 'Suomi' },
        { key: 'pl-PL', label: 'Polski' },
        { key: 'sv-SE', label: 'Svenska' },
        { key: 'ar-SA', label: 'العربية', direction: 'rtl' }
    ]);

    languages$ = this.languages.asObservable();

    changeLanguage(_language: LanguageItem): void {}

    setLanguages(items: LanguageItem[]): void {
        if (items?.length > 0) {
            this.languages.next(items);
        }
    }
}
