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

import { Component, EventEmitter, Output } from '@angular/core';
import { LanguageService } from './service/language.service';
import { Observable } from 'rxjs';
import { LanguageItem } from '../common/services/language-item.interface';

@Component({
    selector: 'adf-language-menu',
    template: `
        <button
            mat-menu-item
            *ngFor="let language of languages$ | async"
            [attr.lang]="language.key"
            (click)="changeLanguage(language)">{{language.label}}</button>
    `
})
export class LanguageMenuComponent {

    /** Emitted when the language change */
    @Output()
    changedLanguage: EventEmitter<LanguageItem> = new EventEmitter<LanguageItem>();

    languages$: Observable<LanguageItem[]>;

    constructor(private languageService: LanguageService) {
        this.languages$ = languageService.languages$;
    }

    changeLanguage(language: LanguageItem) {
        this.changedLanguage.emit(language);
        this.languageService.changeLanguage(language);
    }
}
