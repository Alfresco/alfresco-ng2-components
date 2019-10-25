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

import { EventEmitter } from '@angular/core';
import { Observable, of } from 'rxjs';
import { TranslationService } from '../services/translation.service';

export interface LangChangeEvent {
    lang: string;
    translations: any;
}

export class TranslationMock implements TranslationService {

    defaultLang: string = 'en';
    userLang: string;
    customLoader: any;

    translate: any = {
        onLangChange: new EventEmitter<LangChangeEvent>()
    };

    addTranslationFolder() {}

    onTranslationChanged() {}

    use(): any {}

    loadTranslation() {}

    get(key: string | Array<string>): Observable<string | any> {
        return of(key);
    }

    instant(key: string | Array<string>): string | any {
        return key;
    }

}
