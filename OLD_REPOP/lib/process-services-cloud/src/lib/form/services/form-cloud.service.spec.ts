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
import { FORM_CLOUD_SERVICE_FIELD_VALIDATORS_TOKEN, FormCloudService } from './form-cloud.service';
import { of } from 'rxjs';
import { AdfHttpClient } from '@alfresco/adf-core/api';
import { FORM_FIELD_VALIDATORS, FormFieldValidator, NoopAuthModule } from '@alfresco/adf-core';

const mockTaskResponseBody = {
    entry: { id: 'id', name: 'name', formKey: 'form-key' }
};

const mockFormResponseBody = { formRepresentation: { id: 'form-id', name: 'task-form', taskId: 'task-id' } };

const fakeValidator = {
    supportedTypes: ['test'],
    isSupported: () => true,
    validate: () => true
} as FormFieldValidator;

describe('Form Cloud service', () => {
    let service: FormCloudService;
    let adfHttpClient: AdfHttpClient;
    let requestSpy: jasmine.Spy;
    const appName = 'app-name';
    const taskId = 'task-id';
    const processInstanceId = 'process-instance-id';

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NoopAuthModule],
            providers: [{ provide: FORM_CLOUD_SERVICE_FIELD_VALIDATORS_TOKEN, useValue: [fakeValidator] }]
        });
        service = TestBed.inject(FormCloudService);
        adfHttpClient = TestBed.inject(AdfHttpClient);
        requestSpy = spyOn(adfHttpClient, 'request');
    });

    describe('Form tests', () => {
        it('should fetch and parse form', (done) => {
            const formId = 'form-id';
            requestSpy.and.returnValue(Promise.resolve(mockFormResponseBody));

            service.getForm(appName, formId).subscribe((result) => {
                expect(result).toBeDefined();
                expect(result.formRepresentation.id).toBe(formId);
                expect(result.formRepresentation.name).toBe('task-form');
                expect(requestSpy.calls.mostRecent().args[0]).toContain(`${appName}/form/v1/forms/${formId}`);
                expect(requestSpy.calls.mostRecent().args[1].httpMethod).toBe('GET');
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

        it('should create form with injected validators', () => {
            const formId = 'form-id';
            const json = { formRepresentation: { id: formId, name: 'task-form', taskId: 'task-id', formDefinition: {} } };
            const result = service.parseForm(json, undefined, undefined);
            expect(result).toBeDefined();
            expect(result.fieldValidators).toEqual([...FORM_FIELD_VALIDATORS, fakeValidator]);
        });
    });

    describe('Task tests', () => {
        it('should fetch and parse task', (done) => {
            requestSpy.and.returnValue(Promise.resolve(mockTaskResponseBody));

            service.getTask(appName, taskId).subscribe((result) => {
                expect(result).toBeDefined();
                expect(result.id).toBe('id');
                expect(result.name).toBe('name');
                expect(requestSpy.calls.mostRecent().args[0]).toContain(`${appName}/query/v1/tasks/${taskId}`);
                expect(requestSpy.calls.mostRecent().args[1].httpMethod).toBe('GET');
                done();
            });
        });

        it('should fetch task variables', (done) => {
            requestSpy.and.returnValue(
                Promise.resolve({
                    list: {
                        entries: [
                            {
                                entry: {
                                    serviceName: 'fake-rb',
                                    serviceFullName: 'fake-rb',
                                    serviceVersion: '',
                                    appName: 'fake',
                                    appVersion: '',
                                    serviceType: null,
                                    id: 25,
                                    type: 'string',
                                    name: 'fakeProperty',
                                    createTime: 1556112661342,
                                    lastUpdatedTime: 1556112661342,
                                    executionId: null,
                                    value: 'fakeValue',
                                    markedAsDeleted: false,
                                    processInstanceId: '18e16bc7-6694-11e9-9c1b-0a586460028a',
                                    taskId: '18e192da-6694-11e9-9c1b-0a586460028a',
                                    taskVariable: true
                                }
                            }
                        ],
                        pagination: {
                            skipCount: 0,
                            maxItems: 100,
                            count: 1,
                            hasMoreItems: false,
                            totalItems: 1
                        }
                    }
                })
            );

            service.getTaskVariables(appName, taskId).subscribe((result) => {
                expect(result).toBeDefined();
                expect(result.length).toBe(1);
                expect(result[0].name).toBe('fakeProperty');
                expect(result[0].value).toBe('fakeValue');
                expect(requestSpy.calls.mostRecent().args[0]).toContain(`${appName}/query/v1/tasks/${taskId}/variables`);
                expect(requestSpy.calls.mostRecent().args[1].httpMethod).toBe('GET');
                done();
            });
        });

        it('should fetch result if the variable value is 0', (done) => {
            requestSpy.and.returnValue(
                Promise.resolve({
                    list: {
                        entries: [
                            {
                                entry: {
                                    serviceName: 'fake-rb',
                                    serviceFullName: 'fake-rb',
                                    serviceVersion: '',
                                    appName: 'fake',
                                    appVersion: '',
                                    serviceType: null,
                                    id: 25,
                                    type: 'string',
                                    name: 'fakeProperty',
                                    createTime: 1556112661342,
                                    lastUpdatedTime: 1556112661342,
                                    executionId: null,
                                    value: 0,
                                    markedAsDeleted: false,
                                    processInstanceId: '18e16bc7-6694-11e9-9c1b-0a586460028a',
                                    taskId: '18e192da-6694-11e9-9c1b-0a586460028a',
                                    taskVariable: true
                                }
                            }
                        ],
                        pagination: {
                            skipCount: 0,
                            maxItems: 100,
                            count: 1,
                            hasMoreItems: false,
                            totalItems: 1
                        }
                    }
                })
            );

            service.getTaskVariables(appName, taskId).subscribe((result) => {
                expect(result).toBeDefined();
                expect(result.length).toBe(1);
                expect(result[0].name).toBe('fakeProperty');
                expect(result[0].value).toBe(0);
                done();
            });
        });

        it('should fetch task form flattened', (done) => {
            spyOn(service, 'getTask').and.returnValue(of(mockTaskResponseBody.entry));
            spyOn(service, 'getForm').and.returnValue(
                of({
                    formRepresentation: {
                        name: 'task-form',
                        formDefinition: {}
                    }
                } as any)
            );

            service.getTaskForm(appName, taskId).subscribe((result) => {
                expect(result).toBeDefined();
                expect(result.name).toBe('task-form');
                expect(result.taskId).toBe('id');
                expect(result.taskName).toBe('name');
                done();
            });
        });

        it('should save task form', (done) => {
            requestSpy.and.returnValue(Promise.resolve(mockTaskResponseBody));
            const formId = 'form-id';

            service.saveTaskForm(appName, taskId, processInstanceId, formId, {}).subscribe((result: any) => {
                expect(result).toBeDefined();
                expect(result.id).toBe('id');
                expect(result.name).toBe('name');
                expect(requestSpy.calls.mostRecent().args[0]).toContain(`${appName}/form/v1/forms/${formId}/save`);
                expect(requestSpy.calls.mostRecent().args[1].httpMethod).toBe('POST');
                done();
            });
        });

        it('should complete task form', (done) => {
            requestSpy.and.returnValue(Promise.resolve(mockTaskResponseBody));
            const formId = 'form-id';

            service.completeTaskForm(appName, taskId, processInstanceId, formId, {}, '', 1).subscribe((result: any) => {
                expect(result).toBeDefined();
                expect(result.id).toBe('id');
                expect(result.name).toBe('name');
                expect(requestSpy.calls.mostRecent().args[0]).toContain(`${appName}/form/v1/forms/${formId}/submit/versions/1`);
                expect(requestSpy.calls.mostRecent().args[1].httpMethod).toBe('POST');
                done();
            });
        });
    });
});
