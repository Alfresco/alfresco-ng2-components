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

import { EventEmitter, Injectable, NgModule } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideTranslateService, TranslateLoader } from '@ngx-translate/core';
import { TranslationService } from '../translation/translation.service';
import { LangChangeEvent } from '../mock';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NoopTranslationService implements TranslationService {
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

@NgModule({
    imports: [HttpClientTestingModule],
    providers: [
        { provide: TranslationService, useClass: NoopTranslationService },
        provideTranslateService({
            loader: {
                provide: TranslateLoader,
                useClass: NoopTranslationService
            }
        })
    ]
})
export class NoopTranslateModule {}
