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

import { TestBed, async } from '@angular/core/testing';
import { AppConfigModule } from './app-config.service';
import { AlfrescoSettingsService } from './alfresco-settings.service';

describe('AlfrescoSettingsService', () => {

    let service: AlfrescoSettingsService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                AppConfigModule
            ],
            declarations: [
            ],
            providers: [
                AlfrescoSettingsService
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
