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

import { HttpClientModule } from '@angular/common/http';
import { Injector } from '@angular/core';
import { getTestBed, TestBed } from '@angular/core/testing';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { TranslateLoaderService } from './translate-loader.service';
import { provideTranslations, TranslationService } from './translation.service';
import { AppConfigService } from '../app-config/app-config.service';
import { AppConfigServiceMock } from '../common/mock/app-config.service.mock';

declare let jasmine: any;

describe('TranslationService', () => {
    let injector: Injector;
    let translationService: TranslationService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useClass: TranslateLoaderService
                    }
                })
            ],
            providers: [
                { provide: AppConfigService, useClass: AppConfigServiceMock },
                provideTranslations('@alfresco/adf-core', 'assets/ng2-alfresco-core')
            ]
        });

        jasmine.Ajax.install();

        injector = getTestBed();
        translationService = injector.get(TranslationService);
        translationService.addTranslationFolder('fake-name', 'fake-path');
    });

    afterEach(() => {
        jasmine.Ajax.uninstall();
    });

    it('should be able to get translations of the KEY: TEST', () => {
        translationService.get('TEST').subscribe((res: string) => {
            expect(res).toEqual('This is a test');
        });

        jasmine.Ajax.requests.mostRecent().respondWith({
            status: 200,
            contentType: 'application/json',
            responseText: JSON.stringify({ TEST: 'This is a test', TEST2: 'This is another test' })
        });
    });

    it('should be able to get translations of the KEY: TEST2', () => {
        translationService.get('TEST2').subscribe((res: string) => {
            expect(res).toEqual('This is another test');
        });

        jasmine.Ajax.requests.mostRecent().respondWith({
            status: 200,
            contentType: 'application/json',
            responseText: JSON.stringify({ TEST: 'This is a test', TEST2: 'This is another test' })
        });
    });

    it('should return empty string for missing key when getting instant translations', () => {
        expect(translationService.instant(null)).toEqual('');
        expect(translationService.instant('')).toEqual('');
        expect(translationService.instant(undefined)).toEqual('');
    });
});
