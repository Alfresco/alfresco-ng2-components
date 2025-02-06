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

import { TestBed } from '@angular/core/testing';
import { BasicAlfrescoAuthService } from './basic-alfresco-auth.service';
import { AppConfigService, AppConfigValues } from '../../app-config/app-config.service';
import { ProcessAuth } from './process-auth';
import { ContentAuth } from './content-auth';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('BasicAlfrescoAuthService', () => {
    let basicAlfrescoAuthService: BasicAlfrescoAuthService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [BasicAlfrescoAuthService]
        });
        basicAlfrescoAuthService = TestBed.inject(BasicAlfrescoAuthService);
        spyOn(TestBed.inject(ProcessAuth), 'getToken').and.returnValue('Mock Process Auth ticket');
        spyOn(TestBed.inject(ContentAuth), 'getToken').and.returnValue('Mock Content Auth ticket');
        const appConfigSpy = spyOn(TestBed.inject(AppConfigService), 'get');
        appConfigSpy.withArgs(AppConfigValues.CONTEXTROOTBPM).and.returnValue('activiti-app');
        appConfigSpy.withArgs(AppConfigValues.CONTEXTROOTECM).and.returnValue('alfresco');
    });

    it('should return content services ticket when requestUrl contains ECM context root', () => {
        const ticket = basicAlfrescoAuthService.getTicketEcmBase64('http://www.exmple.com/alfresco/mock-api-url');
        const base64Segment = ticket.split('Basic ')[1];
        expect(atob(base64Segment)).toEqual('Mock Content Auth ticket');
    });

    it('should return process services ticket when requestUrl contains ECM context root', () => {
        const ticket = basicAlfrescoAuthService.getTicketEcmBase64('http://www.example.com/activiti-app/mock-api-url');
        expect(ticket).toEqual('Basic Mock Process Auth ticket');
    });

    it('should return content services ticket when requestUrl contains both ECM and BPM context root, but ECM context root comes before', () => {
        const ticket = basicAlfrescoAuthService.getTicketEcmBase64('http://www.exmple.com/alfresco/activiti-app/mock-api-url');
        const base64Segment = ticket.split('Basic ')[1];
        expect(atob(base64Segment)).toEqual('Mock Content Auth ticket');
    });

    it('should return process services ticket when requestUrl contains both ECM and BPM context root, but BPM context root comes before', () => {
        const ticket = basicAlfrescoAuthService.getTicketEcmBase64('http://www.example.com/activiti-app/alfresco/mock-api-url');
        expect(ticket).toEqual('Basic Mock Process Auth ticket');
    });
});
