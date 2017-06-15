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

import { TestBed, inject } from '@angular/core/testing';
import { HttpModule, XHRBackend, Response, ResponseOptions } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { AppConfigModule, AppConfigService } from './app-config.service';

describe('AppConfigService', () => {

    let appConfigService: AppConfigService;
    const mockResponse = {
        'ecmHost': 'http://localhost:4000/ecm',
        'bpmHost': 'http://localhost:4000/ecm',
        'application': {
            'name': 'Custom Name'
        }
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpModule,
                AppConfigModule
            ],
            providers: [
                { provide: XHRBackend, useClass: MockBackend }
            ]
        });
    });

    beforeEach(
        inject([AppConfigService, XHRBackend], (appConfig: AppConfigService, mockBackend) => {
            appConfigService = appConfig;
            mockBackend.connections.subscribe((connection: MockConnection) => {
                connection.mockRespond(new Response(new ResponseOptions({
                    body: JSON.stringify(mockResponse)
                })));
            });
        })
    );

    it('should export service in the module', () => {
        const service = TestBed.get(AppConfigService);
        expect(service).toBeDefined();
    });

    it('should load external settings', () => {
        appConfigService.load().then(config => {
            expect(config).toEqual(mockResponse);
        });
    });

    it('should retrieve settings', () => {
        appConfigService.load().then(() => {
            expect(appConfigService.get('ecmHost')).toBe(mockResponse.ecmHost);
            expect(appConfigService.get('bpmHost')).toBe(mockResponse.bpmHost);
            expect(appConfigService.get('application.name')).toBe(mockResponse.application.name);
        });
    });

    it('should use default config file', () => {
        expect(appConfigService.configFile).toBeNull();
        appConfigService.load().then(() => {
            expect(appConfigService.configFile).toBe('app.config.json');
        });
    });

    it('should take custom config file', () => {
        expect(appConfigService.configFile).toBeNull();

        const name = 'custom.config.json';
        appConfigService.load(name).then(() => {
            expect(appConfigService.configFile).toBe(name);
        });
    });
});
