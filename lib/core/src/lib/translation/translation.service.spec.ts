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

import { TestBed } from '@angular/core/testing';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslationService } from './translation.service';
import { of } from 'rxjs';
import { provideAppConfigTesting } from '../testing';

describe('TranslationService', () => {
    let translationService: TranslationService;

    class FakeLoader implements TranslateLoader {
        init = (): void => {
            // No implementation needed for this test
        };

        setDefaultLang = (_lang: string): void => {
            // No implementation needed for this test
        };

        getTranslation = (lang: string) => {
            const translations = {
                en: {
                    TEST: 'This is a test',
                    TEST2: 'This is another test'
                },
                fr: {
                    TEST: 'This is a test',
                    TEST2: 'This is another test'
                }
            };

            return of(translations[lang]);
        };
    }

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useClass: FakeLoader
                    }
                })
            ],
            providers: [TranslationService, provideAppConfigTesting()]
        });

        translationService = TestBed.inject(TranslationService);
    });

    it('should be able to get translations of the KEY: TEST', (done) => {
        translationService.get('TEST').subscribe((res: string) => {
            expect(res).toEqual('This is a test');
            done();
        });
    });

    it('should be able to get translations of the KEY: TEST2', () => {
        translationService.get('TEST2').subscribe((res: string) => {
            expect(res).toEqual('This is another test');
        });
    });

    it('should return empty string for missing key when getting instant translations', () => {
        expect(translationService.instant(null)).toEqual('');
        expect(translationService.instant('')).toEqual('');
        expect(translationService.instant(undefined)).toEqual('');
    });
});
