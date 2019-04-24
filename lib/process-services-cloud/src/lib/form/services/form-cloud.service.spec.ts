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
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormCloudService } from './form-cloud.service';
import { AlfrescoApiService, CoreModule, setupTestBed, AppConfigService, AppConfigServiceMock } from '@alfresco/adf-core';
import { of } from 'rxjs';

declare let jasmine: any;

const responseBody = {
    entry:
        { id: 'id', name: 'name', formKey: 'form-key' }
};

const alfrescoApiServiceStub = {
    getInstance() { },
    load() { }
};

const oauth2Auth = jasmine.createSpyObj('oauth2Auth', ['callCustomApi']);

describe('Form Cloud service', () => {

    let service: FormCloudService;
    let apiService: AlfrescoApiService;
    const appName = 'app-name';
    const taskId = 'task-id';

    setupTestBed({
        imports: [
            NoopAnimationsModule,
            CoreModule.forRoot()
        ],
        providers: [
            FormCloudService,
            { provide: AlfrescoApiService, useValue: alfrescoApiServiceStub },
            { provide: AppConfigService, useClass: AppConfigServiceMock }
        ]
    });

    beforeEach(() => {
        service = TestBed.get(FormCloudService);
        apiService = TestBed.get(AlfrescoApiService);
        spyOn(apiService, 'getInstance').and.returnValue({ oauth2Auth: oauth2Auth });
    });

    describe('Form tests', () => {
        it('should fetch and parse form', (done) => {
            const formId = 'form-id';
            oauth2Auth.callCustomApi.and.returnValue(Promise.resolve({ formRepresentation: { id: formId, name: 'task-form', taskId: 'task-id' } }));

            service.getForm(appName, formId).subscribe((result) => {
                expect(result).toBeDefined();
                expect(result.formRepresentation.id).toBe(formId);
                expect(result.formRepresentation.name).toBe('task-form');
                expect(oauth2Auth.callCustomApi.calls.mostRecent().args[0].endsWith(`${appName}/form/v1/forms/${formId}`)).toBeTruthy();
                expect(oauth2Auth.callCustomApi.calls.mostRecent().args[1]).toBe('GET');
                done();
            });
        });

        it('should parse valid form json ', () => {
            const formId = 'form-id';
            const json = { formRepresentation: { id: formId, name: 'task-form', taskId: 'task-id', formDefinition: {} } };

            const result = service.parseForm(json);
            expect(result).toBeDefined();
            expect(result.id).toBe(formId);
            expect(result.name).toBe('task-form');
        });
    });

    describe('Task tests', () => {
        it('should fetch and parse task', (done) => {
            oauth2Auth.callCustomApi.and.returnValue(Promise.resolve(responseBody));

            service.getTask(appName, taskId).subscribe((result) => {
                expect(result).toBeDefined();
                expect(result.id).toBe(responseBody.entry.id);
                expect(result.name).toBe(responseBody.entry.name);
                expect(oauth2Auth.callCustomApi.calls.mostRecent().args[0].endsWith(`${appName}/query/v1/tasks/${taskId}`)).toBeTruthy();
                expect(oauth2Auth.callCustomApi.calls.mostRecent().args[1]).toBe('GET');
                done();
            });

        });

        it('should fetch task variables', (done) => {
            oauth2Auth.callCustomApi.and.returnValue(Promise.resolve({
                'list': {
                  'entries': [
                    {
                      'entry': {
                        'serviceName': 'fake-rb',
                        'serviceFullName': 'fake-rb',
                        'serviceVersion': '',
                        'appName': 'fake',
                        'appVersion': '',
                        'serviceType': null,
                        'id': 25,
                        'type': 'string',
                        'name': 'fakeProperty',
                        'createTime': 1556112661342,
                        'lastUpdatedTime': 1556112661342,
                        'executionId': null,
                        'value': 'fakeValue',
                        'markedAsDeleted': false,
                        'processInstanceId': '18e16bc7-6694-11e9-9c1b-0a586460028a',
                        'taskId': '18e192da-6694-11e9-9c1b-0a586460028a',
                        'taskVariable': true
                      }
                    }
                  ],
                  'pagination': {
                    'skipCount': 0,
                    'maxItems': 100,
                    'count': 1,
                    'hasMoreItems': false,
                    'totalItems': 1
                  }
                }
              }));

            service.getTaskVariables(appName, taskId).subscribe((result) => {
                expect(result).toBeDefined();
                expect(result.length).toBe(1);
                expect(result[0].name).toBe('fakeProperty');
                expect(result[0].value).toBe('fakeValue');
                expect(oauth2Auth.callCustomApi.calls.mostRecent().args[0].endsWith(`${appName}/query/v1/tasks/${taskId}/variables`)).toBeTruthy();
                expect(oauth2Auth.callCustomApi.calls.mostRecent().args[1]).toBe('GET');
                done();
            });

        });

        it('should fetch task form', (done) => {
            spyOn(service, 'getTask').and.returnValue(of(responseBody.entry));
            spyOn(service, 'getForm').and.returnValue(of({ formRepresentation: { name: 'task-form' } }));

            service.getTaskForm(appName, taskId).subscribe((result) => {
                expect(result).toBeDefined();
                expect(result.formRepresentation.name).toBe('task-form');
                expect(result.formRepresentation.taskId).toBe(responseBody.entry.id);
                expect(result.formRepresentation.taskName).toBe(responseBody.entry.name);
                done();
            });

        });

        it('should save task form', (done) => {
            oauth2Auth.callCustomApi.and.returnValue(Promise.resolve(responseBody));
            const formId = 'form-id';

            service.saveTaskForm(appName, taskId, formId, {}).subscribe((result: any) => {
                expect(result).toBeDefined();
                expect(result.id).toBe('id');
                expect(result.name).toBe('name');
                expect(oauth2Auth.callCustomApi.calls.mostRecent().args[0].endsWith(`${appName}/form/v1/forms/${formId}/save`)).toBeTruthy();
                expect(oauth2Auth.callCustomApi.calls.mostRecent().args[1]).toBe('POST');
                done();
            });

        });

        it('should complete task form', (done) => {
            oauth2Auth.callCustomApi.and.returnValue(Promise.resolve(responseBody));
            const formId = 'form-id';

            service.completeTaskForm(appName, taskId, formId, {}, '').subscribe((result: any) => {
                expect(result).toBeDefined();
                expect(result.id).toBe('id');
                expect(result.name).toBe('name');
                expect(oauth2Auth.callCustomApi.calls.mostRecent().args[0].endsWith(`${appName}/form/v1/forms/${formId}/submit`)).toBeTruthy();
                expect(oauth2Auth.callCustomApi.calls.mostRecent().args[1]).toBe('POST');
                done();
            });

        });

    });
});
