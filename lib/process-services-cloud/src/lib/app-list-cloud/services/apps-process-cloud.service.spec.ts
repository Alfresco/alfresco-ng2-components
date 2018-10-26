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

import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { setupTestBed } from '@alfresco/adf-core';
import { HttpErrorResponse } from '@angular/common/http';
import { AppsProcessCloudService } from './apps-process-cloud.service';
import { fakeApplicationInstance } from '../mock/app-model.mock';
import { ApplicationInstanceModel } from '../models/application-instance.model';
import { ProcessServiceCloudTestingModule } from '../../testing/process-service-cloud.testing.module';

describe('AppsProcessCloudService', () => {

    let service: AppsProcessCloudService;

    setupTestBed({
        imports: [ProcessServiceCloudTestingModule],
        providers: [AppsProcessCloudService]
    });

    beforeEach(() => {
        service = TestBed.get(AppsProcessCloudService);
    });

    it('should get the deployed applications ', (done) => {
        spyOn(service, 'getDeployedApplicationsByStatus').and.returnValue(of(fakeApplicationInstance));
        service.getDeployedApplicationsByStatus('fake').subscribe(
            (res: ApplicationInstanceModel[]) => {
                expect(res).toBeDefined();
                expect(res.length).toEqual(2);
                expect(res).toEqual(fakeApplicationInstance);
                expect(res[0]).toEqual(fakeApplicationInstance[0]);
                expect(res[0].name).toEqual('application-new-1');
                expect(res[1]).toEqual(fakeApplicationInstance[1]);
                expect(res[1].name).toEqual('application-new-2');
                done();
            }
        );
    });

    it('Should not fetch deployed applications if error occurred', () => {
        const errorResponse = new HttpErrorResponse({
            error: 'Mock Error',
            status: 404, statusText: 'Not Found'
        });

        spyOn(service, 'getDeployedApplicationsByStatus').and.returnValue(throwError(errorResponse));
        service.getDeployedApplicationsByStatus('fake')
            .subscribe(
                users => fail('expected an error, not applications'),
                error => {
                    expect(error.status).toEqual(404);
                    expect(error.statusText).toEqual('Not Found');
                    expect(error.error).toEqual('Mock Error');
                }
            );
    });
});
