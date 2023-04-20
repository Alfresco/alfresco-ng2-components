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

import { TestBed } from '@angular/core/testing';
import { AppConfigService, setupTestBed } from '@alfresco/adf-core';
import { DiagramsService } from './diagrams.service';
import { InsightsTestingModule } from '../../testing/insights.testing.module';
import { TranslateModule } from '@ngx-translate/core';

declare let jasmine: any;

describe('DiagramsService', () => {

    let service: DiagramsService;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            InsightsTestingModule
        ]
    });

    beforeEach(() => {
        const appConfig: AppConfigService = TestBed.inject(AppConfigService);
        appConfig.config.ecmHost = 'http://localhost:9876/ecm';

        service = TestBed.inject(DiagramsService);
    });

    beforeEach(() => {
        jasmine.Ajax.install();
    });

    afterEach(() => {
        jasmine.Ajax.uninstall();
    });

    it('getProcessDefinitionModel should perform a call against the server', (done) => {
        service.getProcessDefinitionModel('fake-processDefinitionId').subscribe(() => {
            done();
        });

        jasmine.Ajax.requests.mostRecent().respondWith({
            status: 200
        });
    });

    it('getRunningProcessDefinitionModel should perform a call against the server', (done) => {
        service.getRunningProcessDefinitionModel('fake-processInstanceId').subscribe(() => {
            done();
        });

        jasmine.Ajax.requests.mostRecent().respondWith({
            status: 200
        });
    });

    it('getTagsByNodeId catch errors call', (done) => {
        service.getProcessDefinitionModel('fake-processDefinitionId').subscribe(() => {
        }, () => {
            done();
        });

        jasmine.Ajax.requests.mostRecent().respondWith({
            status: 403
        });
    });
});
