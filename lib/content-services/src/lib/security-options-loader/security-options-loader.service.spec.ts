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

import { SecurityOptionsLoaderService } from './security-options-loader.service';
import { AppConfigService, AppConfigValues } from '@alfresco/adf-core';
import { AdfHttpClient } from '@alfresco/adf-core/api';

describe('SecurityOptionsLoaderService', () => {
    let service: SecurityOptionsLoaderService;
    let appConfigServiceSpy: jasmine.SpyObj<AppConfigService>;
    let adfHttpClientSpy: jasmine.SpyObj<AdfHttpClient>;

    beforeEach(() => {
        appConfigServiceSpy = jasmine.createSpyObj('AppConfigService', ['get']);
        adfHttpClientSpy = jasmine.createSpyObj('AdfHttpClient', ['setDefaultSecurityOption']);

        service = new SecurityOptionsLoaderService(appConfigServiceSpy, adfHttpClientSpy);
    });

    it('should set withCredentials when value is true', () => {
        appConfigServiceSpy.get.and.callFake((key: string): any => {
            if (key === AppConfigValues.AUTH_WITH_CREDENTIALS) {
                return true;
            }
        });

        service.load();

        expect(adfHttpClientSpy.setDefaultSecurityOption).toHaveBeenCalledWith({ withCredentials: true });
    });

    it('should set withCredentials when value is false', () => {
        appConfigServiceSpy.get.and.callFake((key: string): any => {
            if (key === AppConfigValues.AUTH_WITH_CREDENTIALS) {
                return false;
            }
        });

        service.load();

        expect(adfHttpClientSpy.setDefaultSecurityOption).toHaveBeenCalledWith({ withCredentials: false });
    });

    it('should not call setDefaultSecurityOption when value is undefined', () => {
        appConfigServiceSpy.get.and.returnValue(undefined);

        service.load();

        expect(adfHttpClientSpy.setDefaultSecurityOption).not.toHaveBeenCalled();
    });

    it('should not call setDefaultSecurityOption when value is null', () => {
        appConfigServiceSpy.get.and.returnValue(null);

        service.load();

        expect(adfHttpClientSpy.setDefaultSecurityOption).not.toHaveBeenCalled();
    });
});
