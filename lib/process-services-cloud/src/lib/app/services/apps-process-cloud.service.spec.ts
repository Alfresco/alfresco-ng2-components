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
import { throwError } from 'rxjs';
import { setupTestBed, CoreModule, AppConfigService, AlfrescoApiService, AlfrescoApiServiceMock } from '@alfresco/adf-core';
import { HttpErrorResponse } from '@angular/common/http';
import { AppsProcessCloudService } from './apps-process-cloud.service';
import { fakeApplicationInstance } from '../mock/app-model.mock';
import { ApplicationInstanceModel } from '../models/application-instance.model';
import { ProcessServiceCloudTestingModule } from '../../testing/process-service-cloud.testing.module';

describe('AppsProcessCloudService', () => {

    let service: AppsProcessCloudService;
    let appConfigService: AppConfigService;
    let apiService: AlfrescoApiService;

    const apiMock = {
        oauth2Auth: {
            callCustomApi: () => Promise.resolve({list : { entries: [ {entry: fakeApplicationInstance[0]}, {entry: fakeApplicationInstance[1]}] }})
        }
    };

    setupTestBed({
        imports: [CoreModule.forRoot(), ProcessServiceCloudTestingModule],
        providers: [AppsProcessCloudService, AppConfigService,
            { provide: AlfrescoApiService, useClass: AlfrescoApiServiceMock } ]
    });

    beforeEach(() => {
        service = TestBed.get(AppsProcessCloudService);
        appConfigService = TestBed.get(AppConfigService);
        apiService = TestBed.get(AlfrescoApiService);
        spyOn(apiService, 'getInstance').and.returnValue(apiMock);
    });

    it('should get the deployed applications no apps are specified in app.config', (done) => {
        spyOn(appConfigService, 'get').and.returnValue([]);
        service.loadApps();
        service.getDeployedApplicationsByStatus('fake').subscribe(
            (res: ApplicationInstanceModel[]) => {
                expect(res).toBeDefined();
                expect(res.length).toEqual(2);
                expect(res[0].name).toEqual('application-new-1');
                expect(res[1].name).toEqual('application-new-2');
                done();
            }
        );
    });

    it('should get apps from app.config when apps are specified in app.config', (done) => {
        spyOn(appConfigService, 'get').and.returnValue([fakeApplicationInstance[0]]);
        service.loadApps();
        service.getDeployedApplicationsByStatus('fake').subscribe(
            (res: ApplicationInstanceModel[]) => {
                expect(res).toBeDefined();
                expect(res.length).toEqual(1);
                expect(res[0]).toEqual(fakeApplicationInstance[0]);
                expect(res[0].name).toEqual('application-new-1');
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
                () => fail('expected an error, not applications'),
                (error) => {
                    expect(error.status).toEqual(404);
                    expect(error.statusText).toEqual('Not Found');
                    expect(error.error).toEqual('Mock Error');
                }
            );
    });
});
