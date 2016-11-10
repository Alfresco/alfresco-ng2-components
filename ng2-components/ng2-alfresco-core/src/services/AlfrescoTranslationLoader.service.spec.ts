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

import { TranslateLoader } from 'ng2-translate/ng2-translate';
import { AlfrescoTranslationLoader } from '../services/AlfrescoTranslationLoader.service';
import { AlfrescoTranslationService } from '../services/AlfrescoTranslation.service';
import { Injector } from '@angular/core';
import { XHRBackend, HttpModule } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import {
    TranslateModule
} from 'ng2-translate/ng2-translate';
import {getTestBed, TestBed} from '@angular/core/testing';

describe('TranslateLoader', () => {
    let injector: Injector;
    let backend: MockBackend;
    let alfrescoTranslationService: AlfrescoTranslationService;
    let connection: MockConnection; // this will be set when a new connection is emitted from the backend.

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpModule, TranslateModule.forRoot({
                provide: TranslateLoader,
                useClass: AlfrescoTranslationLoader
            })],
            providers: [
                AlfrescoTranslationService,
                {provide: XHRBackend, useClass: MockBackend}
            ]
        });
        injector = getTestBed();
        backend = injector.get(XHRBackend);
        alfrescoTranslationService = injector.get(AlfrescoTranslationService);
        backend.connections.subscribe((c: MockConnection) => connection = c);
    });

    it('should be able to provide any TranslateLoader', () => {
        expect(alfrescoTranslationService).toBeDefined();
        expect(alfrescoTranslationService.translate.currentLoader).toBeDefined();
        expect(alfrescoTranslationService.translate.currentLoader instanceof AlfrescoTranslationLoader).toBeTruthy();
    });
});
