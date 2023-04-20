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

import { of, throwError } from 'rxjs';
import { taskDetailsMock } from '../mock/task-details.mock';
import { TaskDetailsCloudModel } from '../models/task-details-cloud.model';
import { HttpErrorResponse } from '@angular/common/http';
import { setupTestBed } from '@alfresco/adf-core';
import { TaskCloudService } from '../../services/task-cloud.service';
import { TranslateModule } from '@ngx-translate/core';
import { ProcessServiceCloudTestingModule } from './../../../testing/process-service-cloud.testing.module';

describe('StartTaskCloudService', () => {

    let service: TaskCloudService;
    const fakeAppName: string = 'fake-app';

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ProcessServiceCloudTestingModule
        ]
    });

    beforeEach(() => {
        service = TestBed.inject(TaskCloudService);
    });

    it('should able to create a new task ', (done) => {
        spyOn(service, 'createNewTask').and.returnValue(of({id: 'fake-id', name: 'fake-name'}));
        service.createNewTask(taskDetailsMock, fakeAppName).subscribe(
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
        service.createNewTask(taskDetailsMock, fakeAppName)
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
