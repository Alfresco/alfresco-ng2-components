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

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { AppConfigService } from './app-config.service';
import { AppConfigModule } from './app-config.module';
import { ExtensionConfig, ExtensionService } from '@alfresco/adf-extensions';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
class TestExtensionService extends ExtensionService {

    onSetup(config: ExtensionConfig) {
        this.onSetup$.next(config);
    }
}

describe('AppConfigService', () => {

    let appConfigService: AppConfigService;
    let extensionService: ExtensionService;
    let httpClient: HttpClient;

    const mockResponse = {
        ecmHost: 'http://localhost:4000/ecm',
        bpmHost: 'http://localhost:4000/ecm',
        application: {
            name: 'Custom Name'
        },
        files: {
            excluded: ['excluded']
        },
        logLevel: 'silent',
        alfrescoRepositoryName: 'alfresco-1'
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                AppConfigModule
            ],
            providers: [
                { provide: ExtensionService, useClass: TestExtensionService }
            ]
        });
    });

    beforeEach(() => {
        httpClient = TestBed.inject(HttpClient);
        spyOn(httpClient, 'get').and.returnValue(of(mockResponse));

        extensionService = TestBed.inject(ExtensionService);
        appConfigService = TestBed.inject(AppConfigService);
    });

    it('should merge the configs from extensions', () => {
        appConfigService.config = {
            application: {
                name: 'application name'
            }
        };

        (extensionService as TestExtensionService).onSetup({
            appConfig: {
                application: {
                    name: 'custom name'
                }
            }
        } as any);

        expect(appConfigService.get('application.name')).toEqual('custom name');
    });

    it('should merge the configs upon new data loaded', async () => {
        appConfigService.config = {
            application: {
                name: 'application name'
            }
        };

        (extensionService as TestExtensionService).onSetup({
            appConfig: {
                application: {
                    name: 'custom name'
                }
            }
        } as any);

        expect(appConfigService.get('application.name')).toEqual('custom name');

        await appConfigService.load();

        expect(appConfigService.get('application.name')).toEqual('custom name');
    });

    it('should stream only the selected attribute when using select', (done) => {
        appConfigService.select('testProp').subscribe((property) => {
            expect(property).toEqual(true);
            done();
        });

        appConfigService.config.testProp = true;
        appConfigService.load();
    });

    it('should stream the value when is set', (done) => {
        appConfigService.onLoad.subscribe((config) => {
            expect(config.testProp).toBe(true);
            done();
        });

        appConfigService.config.testProp = true;
        appConfigService.load();
    });

    it('should skip the optional port number', () => {
        appConfigService.config.testUrl = 'http://{hostname}{:port}';

        spyOn(appConfigService, 'getLocationHostname').and.returnValue('localhost');
        spyOn(appConfigService, 'getLocationPort').and.returnValue('');

        expect(appConfigService.get('testUrl')).toBe('http://localhost');
    });

    it('should set the optional port number', () => {
        appConfigService.config.testUrl = 'http://{hostname}{:port}';

        spyOn(appConfigService, 'getLocationHostname').and.returnValue('localhost');
        spyOn(appConfigService, 'getLocationPort').and.returnValue(':9090');

        expect(appConfigService.get('testUrl')).toBe('http://localhost:9090');
    });

    it('should set the mandatory port number', () => {
        appConfigService.config.testUrl = 'http://{hostname}:{port}';

        spyOn(appConfigService, 'getLocationHostname').and.returnValue('localhost');
        spyOn(appConfigService, 'getLocationPort').and.returnValue('9090');

        expect(appConfigService.get('testUrl')).toBe('http://localhost:9090');
    });

    it('should use protocol value', () => {
        spyOn(appConfigService, 'getLocationPort').and.returnValue('9090');
        const protocolSpy = spyOn(appConfigService, 'getLocationProtocol');
        appConfigService.config.testUrl = '{protocol}//{hostname}:{port}';

        protocolSpy.and.returnValue('https:');
        expect(appConfigService.get('testUrl')).toBe('https://localhost:9090');

        protocolSpy.and.returnValue('ftp:');
        expect(appConfigService.get('testUrl')).toBe('ftp://localhost:9090');
    });

    it('should load external settings', async () => {
        const config = await appConfigService.load();

        expect(config).toEqual(mockResponse);
    });

    it('should retrieve settings', async () => {
        await appConfigService.load();

        expect(appConfigService.get('ecmHost')).toBe(mockResponse.ecmHost);
        expect(appConfigService.get('bpmHost')).toBe(mockResponse.bpmHost);
        expect(appConfigService.get('application.name')).toBe(mockResponse.application.name);
    });

    it('should take excluded file list', async () => {
        await appConfigService.load();

        expect(appConfigService.get('files.excluded')[0]).toBe('excluded');
    });
});
