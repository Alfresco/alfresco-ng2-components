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
import { fakeApps } from '../mock/apps-service.mock';
import { AppsProcessService } from './apps-process.service';
import { setupTestBed } from '../testing/setupTestBed';
import { CoreTestingModule } from '../testing/core.testing.module';

declare let jasmine: any;

/* tslint:disable:adf-file-name */

describe('AppsProcessService', () => {

    let service: AppsProcessService;

    setupTestBed({
        imports: [CoreTestingModule]
    });

    beforeEach(() => {
        service = TestBed.get(AppsProcessService);
    });

    beforeEach(() => {
        jasmine.Ajax.install();
    });

    afterEach(() => {
        jasmine.Ajax.uninstall();
    });

    it('should get the deployed apps ', (done) => {
        service.getDeployedApplications().subscribe(
            (res: any) => {
                expect(res).toBeDefined();
                expect(res.length).toEqual(2);
                expect(res[0].name).toEqual('Sales-Fakes-App');
                expect(res[0].description).toEqual('desc-fake1');
                expect(res[0].deploymentId).toEqual('111');
                expect(res[1].name).toEqual('health-care-Fake');
                expect(res[1].description).toEqual('desc-fake2');
                expect(res[1].deploymentId).toEqual('444');
                done();
            }
        );

        jasmine.Ajax.requests.mostRecent().respondWith({
            'status': 200,
            contentType: 'application/json',
            responseText: JSON.stringify(fakeApps)
        });
    });

    it('should get the filter deployed app ', (done) => {
        service.getDeployedApplicationsByName('health-care-Fake').subscribe(
            (res: any) => {
                expect(res).toBeDefined();
                expect(res.name).toEqual('health-care-Fake');
                expect(res.description).toEqual('desc-fake2');
                expect(res.deploymentId).toEqual('444');
                done();
            }
        );

        jasmine.Ajax.requests.mostRecent().respondWith({
            'status': 200,
            contentType: 'application/json',
            responseText: JSON.stringify(fakeApps)
        });
    });

    it('should get the deployed app details by id ', (done) => {
        service.getApplicationDetailsById(1).subscribe(
            (app: any) => {
                expect(app).toBeDefined();
                expect(app.name).toEqual('Sales-Fakes-App');
                expect(app.description).toEqual('desc-fake1');
                expect(app.deploymentId).toEqual('111');
                done();
            }
        );

        jasmine.Ajax.requests.mostRecent().respondWith({
            'status': 200,
            contentType: 'application/json',
            responseText: JSON.stringify(fakeApps)
        });
    });
});
