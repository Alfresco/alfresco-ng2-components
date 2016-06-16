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

import { describe, it, beforeEach } from '@angular/core/testing';
import { AlfrescoSettingsService } from './AlfrescoSettingsService.service';

describe('AlfrescoSettingsService', () => {

    let service: AlfrescoSettingsService;

    beforeEach(() => {
        service = new AlfrescoSettingsService();
    });

    it('should have default host', () => {
        expect(service.host).toBe(AlfrescoSettingsService.DEFAULT_HOST_ADDRESS);
    });

    it('should change host', () => {
        // this test ensures 'host' getter/setter working properly
        let address = 'http://192.168.0.1';
        service.host = address;
        expect(service.host).toBe(address);
    });

    it('should format api url', () => {
        let address = 'http://192.168.0.1';
        let expectedUrl =
            `${address}${AlfrescoSettingsService.DEFAULT_CONTEXT_PATH}${AlfrescoSettingsService.DEFAULT_BASE_API_PATH}`;
        service.host = address;
        expect(service.getApiBaseUrl()).toBe(expectedUrl);
    });
});
