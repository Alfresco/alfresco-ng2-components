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

import { async, TestBed } from '@angular/core/testing';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { AlfrescoApiService } from './alfresco-api.service';
import { AlfrescoSettingsService } from './alfresco-settings.service';
import { AppConfigModule } from './app-config.service';
import { LogService } from './log.service';
import { StorageService } from './storage.service';
import { AlfrescoTranslateLoader } from './translate-loader.service';
import { UserPreferencesService } from './user-preferences.service';

describe('AlfrescoSettingsService', () => {

    let service: AlfrescoSettingsService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                AppConfigModule,
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useClass: AlfrescoTranslateLoader
                    }
                })
            ],
            providers: [
                AlfrescoApiService,
                AlfrescoSettingsService,
                UserPreferencesService,
                StorageService,
                LogService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        service = TestBed.get(AlfrescoSettingsService);
    });

    it('should be exposed by the module', () => {
        expect(service).toBeDefined();
    });
});
