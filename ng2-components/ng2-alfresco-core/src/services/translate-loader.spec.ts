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
import {getTestBed, TestBed} from '@angular/core/testing';
import { HttpModule, Response, ResponseOptions, XHRBackend } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { AlfrescoTranslateLoader } from './alfresco-translate-loader.service';
import { AlfrescoTranslationService } from './alfresco-translation.service';
import { LogService } from './log.service';

let componentJson1 = ' {"TEST": "This is a test", "TEST2": "This is another test"} ' ;

const mockBackendResponse = (connection: MockConnection, response: string) => {
    connection.mockRespond(new Response(new ResponseOptions({body: response})));
};

describe('TranslateLoader', () => {
    let injector: Injector;
    let backend: any;
    let alfrescoTranslationService: AlfrescoTranslationService;
    let connection: MockConnection; // this will be set when a new connection is emitted from the backend.
    let customLoader;

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
        customLoader = alfrescoTranslationService.translate.currentLoader;
    });

    it('should be able to provide any TranslateLoader', () => {
        expect(alfrescoTranslationService).toBeDefined();
        expect(alfrescoTranslationService.translate.currentLoader).toBeDefined();
        expect(alfrescoTranslationService.translate.currentLoader instanceof AlfrescoTranslateLoader).toBeTruthy();
    });

    it('should add the component to the list', () => {
        customLoader.addComponentList('login', 'path/login');
        expect(customLoader.existComponent('login')).toBeTruthy();
    });

    it('should return the Json translation ', () => {
        customLoader.addComponentList('login', 'path/login');
        customLoader.getTranslation('en').subscribe(
            (response) => {
                expect(response).toBeDefined();
                expect(response).toEqual(JSON.parse(componentJson1));
            }
        );

        mockBackendResponse(connection, componentJson1);
    });

});
