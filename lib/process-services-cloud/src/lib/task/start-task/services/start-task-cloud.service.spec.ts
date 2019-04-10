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

import { TestBed } from '@angular/core/testing';

import { setupTestBed } from '@alfresco/adf-core';
import { StartTaskCloudService } from './start-task-cloud.service';
import { StartTaskCloudTestingModule } from '../testing/start-task-cloud.testing.module';
import { of, throwError } from 'rxjs';
import { taskDetailsMock } from '../mock/task-details.mock';
import { TaskDetailsCloudModel } from '../models/task-details-cloud.model';
import { HttpErrorResponse } from '@angular/common/http';
import {
    AlfrescoApiService,
    AppConfigService,
    LogService,
    StorageService
} from '@alfresco/adf-core';

describe('StartTaskCloudService', () => {

    let service: StartTaskCloudService;

    setupTestBed({
        imports: [StartTaskCloudTestingModule],
        providers: [StartTaskCloudService, AlfrescoApiService, AppConfigService, LogService, StorageService]
    });

    beforeEach(() => {
        service = TestBed.get(StartTaskCloudService);
    });

    it('should able to create a new task ', (done) => {
        spyOn(service, 'createNewTask').and.returnValue(of({id: 'fake-id', name: 'fake-name'}));
        service.createNewTask(taskDetailsMock).subscribe(
            (res: TaskDetailsCloudModel) => {
                expect(res).toBeDefined();
                expect(res.id).toEqual('fake-id');
                expect(res.name).toEqual('fake-name');
                done();
            }
        );
    });

    it('Should not able to create a task if error occurred', () => {
        const errorResponse = new HttpErrorResponse({
            error: 'Mock Error',
            status: 404, statusText: 'Not Found'
        });

        spyOn(service, 'createNewTask').and.returnValue(throwError(errorResponse));
        service.createNewTask(taskDetailsMock)
            .subscribe(
                () => {
                    fail('expected an error, not applications');
                },
                (error) => {
                    expect(error.status).toEqual(404);
                    expect(error.statusText).toEqual('Not Found');
                    expect(error.error).toEqual('Mock Error');
                }
            );
    });
});
