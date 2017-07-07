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

import { Injector } from '@angular/core';
import { getTestBed, TestBed } from '@angular/core/testing';
import { HttpModule, Response, ResponseOptions, XHRBackend } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { AlfrescoTranslateLoader } from './alfresco-translate-loader.service';
import { AlfrescoTranslationService } from './alfresco-translation.service';
import { LogService } from './log.service';

const mockBackendResponse = (connection: MockConnection, response: string) => {
    connection.mockRespond(new Response(new ResponseOptions({body: response})));
};

describe('AlfrescoTranslationService', () => {
    let injector: Injector;
    let backend: any;
    let alfrescoTranslationService: AlfrescoTranslationService;
    let connection: MockConnection; // this will be set when a new connection is emitted from the backend.

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpModule,
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useClass: AlfrescoTranslateLoader
                    }
                })
            ],
            providers: [
                AlfrescoTranslationService,
                LogService,
                {provide: XHRBackend, useClass: MockBackend}
            ]
        });
        injector = getTestBed();
        backend = injector.get(XHRBackend);
        alfrescoTranslationService = injector.get(AlfrescoTranslationService);
        backend.connections.subscribe((c: MockConnection) => connection = c);
        alfrescoTranslationService.addTranslationFolder('fake-name', 'fake-path');
    });

    it('is defined', () => {
        expect(AlfrescoTranslationService).toBeDefined();
        expect(alfrescoTranslationService instanceof AlfrescoTranslationService).toBeTruthy();
    });

    it('should be able to get translations of the KEY: TEST', () => {
        alfrescoTranslationService.get('TEST').subscribe((res: string) => {
            expect(res).toEqual('This is a test');
        });

        mockBackendResponse(connection, '{"TEST": "This is a test", "TEST2": "This is another test"}');
    });

    it('should be able to get translations of the KEY: TEST2', () => {
        alfrescoTranslationService.get('TEST2').subscribe((res: string) => {
            expect(res).toEqual('This is another test');
        });

        mockBackendResponse(connection, '{"TEST": "This is a test", "TEST2": "This is another test"}');
    });

});
