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

import { AdfHttpClient } from '@alfresco/adf-core/api';
import { StorageService } from '../common';
import { StoragePrefixFactory } from './app-config-storage-prefix.factory';
import { loadAppConfig } from './app-config.loader';
import { AppConfigService, AppConfigValues } from './app-config.service';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { of } from 'rxjs';

describe('loadAppConfig', () => {
    let appConfigServiceSpy: jasmine.SpyObj<AppConfigService>;
    let storageServiceSpy: jasmine.SpyObj<StorageService>;
    let adfHttpClientSpy: jasmine.SpyObj<AdfHttpClient>;
    let storagePrefixFactorySpy: jasmine.SpyObj<StoragePrefixFactory>;

    let appConfigGetSpy: jasmine.Spy;
    let appConfigLoadSpy: jasmine.Spy;

    let factoryFunction: () => void;

    beforeEach(() => {
        adfHttpClientSpy = jasmine.createSpyObj('AdfHttpClient', ['setDefaultSecurityOption']);
        storagePrefixFactorySpy = jasmine.createSpyObj('StoragePrefixFactory', ['getPrefix']);

        TestBed.configureTestingModule({
            imports: [HttpClientModule],
            providers: [
                { provide: AppConfigService },
                { provide: StorageService },
                {
                    provide: AdfHttpClient,
                    useValue: adfHttpClientSpy
                },
                { provide: StoragePrefixFactory, useValue: storagePrefixFactorySpy }
            ]
        });

        appConfigServiceSpy = TestBed.inject(AppConfigService) as jasmine.SpyObj<AppConfigService>;
        appConfigGetSpy = spyOn(appConfigServiceSpy, 'get');
        appConfigLoadSpy = spyOn(appConfigServiceSpy, 'load');
        appConfigLoadSpy.and.callFake((callback: () => void) => {
            callback();
        });

        storageServiceSpy = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;
        spyOnProperty(storageServiceSpy, 'prefix', 'get').and.callThrough();

        storagePrefixFactorySpy.getPrefix.and.returnValue({ subscribe: () => {} } as any);

        factoryFunction = loadAppConfig(appConfigServiceSpy, storageServiceSpy, adfHttpClientSpy, storagePrefixFactorySpy);
    });

    it('should disable CSRF based on app config', () => {
        appConfigGetSpy.and.callFake((key: string): any => {
            if (key === AppConfigValues.DISABLECSRF) {
                return true;
            }
        });

        factoryFunction();

        expect(appConfigServiceSpy.get).toHaveBeenCalledWith('disableCSRF', true);
        expect(adfHttpClientSpy.disableCsrf).toBeTrue();
    });

    it('should set default security option when auth.withCredentials is defined', () => {
        appConfigServiceSpy.get.and.callFake((key: string): any => {
            if (key === AppConfigValues.AUTH_WITH_CREDENTIALS) {
                return true;
            }
        });

        factoryFunction();

        expect(adfHttpClientSpy.setDefaultSecurityOption).toHaveBeenCalledWith({ withCredentials: true });
    });

    it('should set storage prefix from app config', () => {
        appConfigServiceSpy.get.and.callFake((key: string, _default): any => {
            if (key === AppConfigValues.STORAGE_PREFIX) {
                return 'test-prefix';
            }
        });

        factoryFunction();

        expect(appConfigServiceSpy.get).toHaveBeenCalledWith(AppConfigValues.STORAGE_PREFIX, '');
        expect(storageServiceSpy.prefix).toEqual('test-prefix_');
    });

    it('should update storage prefix from storagePrefixFactory', fakeAsync(() => {
        storagePrefixFactorySpy.getPrefix.and.returnValue(of('new-amazing-prefix'));

        factoryFunction();
        tick();

        expect(storagePrefixFactorySpy.getPrefix).toHaveBeenCalled();
        expect(storageServiceSpy.prefix).toEqual('new-amazing-prefix_');
    }));

    it('should call appConfigService.load with the init function', () => {
        factoryFunction();

        expect(appConfigLoadSpy).toHaveBeenCalledWith(jasmine.any(Function));
    });
});
