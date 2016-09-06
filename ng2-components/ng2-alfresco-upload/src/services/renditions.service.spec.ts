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

import { it, describe, inject, beforeEach, beforeEachProviders } from '@angular/core/testing';
import { EventEmitter } from '@angular/core';
import { RenditionsService } from './renditions.service';
import { AlfrescoSettingsService, AlfrescoApiService, AlfrescoAuthenticationService } from 'ng2-alfresco-core';

declare let AlfrescoApi: any;
declare let jasmine: any;

describe('RenditionsService', () => {
    let service: any;

    beforeEachProviders(() => {
        return [
            AlfrescoSettingsService,
            AlfrescoApiService,
            AlfrescoAuthenticationService,
            RenditionsService
        ];
    });

    beforeEach( inject([RenditionsService, AlfrescoApiService], (renditionsService: RenditionsService, apiService: AlfrescoApiService) => {
        jasmine.Ajax.install();
        service = renditionsService;
        apiService.setInstance(new AlfrescoApi({}));
    }));

    afterEach(() => {
        jasmine.Ajax.uninstall();
    });

    it('', (done) => {

    });
});
