/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

import { ProcessCloudService } from './process-cloud.service';
import { CoreModule, setupTestBed } from '@alfresco/adf-core';
import { async, TestBed } from '@angular/core/testing';
import { fakeProcessInstance, fakeProcessInstanceStatusCompleted } from '../start-process/mock/start-process.component.mock';

describe('Process Cloud Service', () => {

    let service: ProcessCloudService;

    setupTestBed({
        imports: [
            CoreModule.forRoot()
        ]
    });

    beforeEach(async(() => {
        service = TestBed.get(ProcessCloudService);
    }));

    it('should canCancelProcess return true when current user is process initiator and process status is RUNNING', () => {
        const mockValidInitiator = 'usermock';
        expect(service.canCancelProcess(fakeProcessInstance, mockValidInitiator)).toBeTruthy();
    });

    it('should canCancelProcess return false when current user is not the process initiator and process status is RUNNING', () => {
        const mockInvalidInitiator = 'mock-user';
        expect(service.canCancelProcess(fakeProcessInstance, mockInvalidInitiator)).toBeFalsy();
    });

    it('should canCancelProcess return false when process status is not RUNNING', () => {
        expect(service.canCancelProcess(fakeProcessInstanceStatusCompleted, 'usermock')).toBeFalsy();
    });

});
