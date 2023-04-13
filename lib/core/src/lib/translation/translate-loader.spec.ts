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

import { TestBed } from '@angular/core/testing';
import { TranslateLoaderService } from './translate-loader.service';
import { TranslationService } from './translation.service';
import { setupTestBed } from '../testing/setup-test-bed';
import { TranslateModule } from '@ngx-translate/core';
import { CoreModule } from '../core.module';

declare let jasmine: any;

describe('TranslateLoader', () => {
    let translationService: TranslationService;
    let customLoader: TranslateLoaderService;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            CoreModule.forRoot()
        ],
        providers: [
            TranslationService
        ]
    });

    beforeEach(() => {
        translationService = TestBed.inject(TranslationService);
        customLoader = translationService.translate.currentLoader as TranslateLoaderService;

        jasmine.Ajax.install();
    });

    afterEach(() => {
        jasmine.Ajax.uninstall();
    });

    it('should be able to provide any TranslateLoader', () => {
        expect(translationService).toBeDefined();
        expect(translationService.translate.currentLoader).toBeDefined();
        expect(translationService.translate.currentLoader instanceof TranslateLoaderService).toBeTruthy();
    });

    it('should add the component to the list', () => {
        customLoader.registerProvider('login', 'path/login');
        expect(customLoader.providerRegistered('login')).toBeTruthy();
    });
});
