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

import { HttpClientModule } from '@angular/common/http';
import { Injector } from '@angular/core';
import { getTestBed, TestBed } from '@angular/core/testing';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { AppConfigService } from '../app-config/app-config.service';

import { AlfrescoApiService } from '../services/alfresco-api.service';
import { LogService } from './log.service';
import { StorageService } from './storage.service';
import { TranslateLoaderService } from './translate-loader.service';
import { TRANSLATION_PROVIDER, TranslationService } from './translation.service';
import { UserPreferencesService } from './user-preferences.service';

let componentJson1 = ' {"TEST": "This is a test", "TEST2": "This is another test"} ' ;

declare let jasmine: any;

describe('TranslateLoader', () => {
    let injector: Injector;
    let translationService: TranslationService;
    let customLoader: TranslateLoaderService;

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
                TranslationService,
                LogService,
                AlfrescoApiService,
                StorageService,
                UserPreferencesService,
                AppConfigService,
                {
                    provide: TRANSLATION_PROVIDER,
                    multi: true,
                    useValue: {
                        name: '@alfresco/core',
                        source: 'assets/ng2-alfresco-core'
                    }
                }
            ]
        });
        injector = getTestBed();
        translationService = injector.get(TranslationService);
        customLoader = <TranslateLoaderService> translationService.translate.currentLoader;

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

    it('should return the Json translation ', () => {
        customLoader.registerProvider('login', 'path/login');
        customLoader.getTranslation('en').subscribe(
            (response) => {
                expect(response).toBeDefined();
                expect(response).toEqual(JSON.parse(componentJson1));
            }
        );

        jasmine.Ajax.requests.mostRecent().respondWith({
            'status': 200,
            contentType: 'application/json',
            responseText: componentJson1
        });
    });

});
