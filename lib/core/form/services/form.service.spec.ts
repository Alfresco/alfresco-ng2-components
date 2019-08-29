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
import { Response, ResponseOptions } from '@angular/http';
import { AlfrescoApiService } from '../../services/alfresco-api.service';
import { formModelTabs, AlfrescoApiServiceMock } from '../../mock';
import { FormService } from './form.service';
import { setupTestBed } from '../../testing/setupTestBed';
import { CoreModule } from '../../core.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

declare let jasmine: any;

const fakeGroupResponse = {
    'size': 2,
    'total': 2,
    'start': 0,
    'data': [{
        'id': '2004',
        'name': 'PEOPLE_GROUP',
        'externalId': null,
        'status': 'active',
        'groups': null
    }, { 'id': 2005, 'name': 'PEOPLE_GROUP_2', 'externalId': null, 'status': 'active', 'groups': null }]
};

const fakePeopleResponse = {
    'size': 3,
    'total': 3,
    'start': 0,
    'data': [{ 'id': 2002, 'firstName': 'Peo', 'lastName': 'Ple', 'email': 'people' }, {
        'id': 2003,
        'firstName': 'Peo02',
        'lastName': 'Ple02',
        'email': 'people02'
    }, { 'id': 2004, 'firstName': 'Peo03', 'lastName': 'Ple03', 'email': 'people03' }]
};

describe('Form service', () => {

    let service: FormService;
    let apiService: AlfrescoApiService;

    setupTestBed({
        imports: [
            NoopAnimationsModule,
            CoreModule.forRoot()
        ],
        providers: [
            { provide: AlfrescoApiService, useClass: AlfrescoApiServiceMock }
        ]
    });

    beforeEach(() => {
        service = TestBed.get(FormService);
        apiService = TestBed.get(AlfrescoApiService);
        jasmine.Ajax.install();
    });

    afterEach(() => {
        jasmine.Ajax.uninstall();
    });

    describe('Content tests', () => {

        const responseBody = {
            data: [
                { id: '1' },
                { id: '2' }
            ]
        };

        const values = {
            field1: 'one',
            field2: 'two'
        };

        const simpleResponseBody = { id: 1, modelType: 'test' };

        it('should fetch and parse process definitions', (done) => {
            service.getProcessDefinitions().subscribe(() => {
                expect(jasmine.Ajax.requests.mostRecent().url.endsWith('/process-definitions')).toBeTruthy();
                expect( [ { id: '1' }, { id: '2' } ]).toEqual(JSON.parse(jasmine.Ajax.requests.mostRecent().response).data);
                done();
            });

            jasmine.Ajax.requests.mostRecent().respondWith({
                'status': 200,
                contentType: 'application/json',
                responseText: JSON.stringify(responseBody)
            });
        });

        it('should fetch and parse tasks', (done) => {
            service.getTasks().subscribe(() => {
                expect(jasmine.Ajax.requests.mostRecent().url.endsWith('/tasks/query')).toBeTruthy();
                expect( [ { id: '1' }, { id: '2' } ]).toEqual(JSON.parse(jasmine.Ajax.requests.mostRecent().response).data);
                done();
            });

            jasmine.Ajax.requests.mostRecent().respondWith({
                'status': 200,
                contentType: 'application/json',
                responseText: JSON.stringify(responseBody)
            });
        });

        it('should fetch and parse the task by id', (done) => {
            service.getTask('1').subscribe((result) => {
                expect(jasmine.Ajax.requests.mostRecent().url.endsWith('/tasks/1')).toBeTruthy();
                expect(result.id).toEqual('1');
                done();
            });

            jasmine.Ajax.requests.mostRecent().respondWith({
                'status': 200,
                contentType: 'application/json',
                responseText: JSON.stringify({ id: '1' })
            });
        });

        it('should save task form', (done) => {
            service.saveTaskForm('1', values).subscribe(() => {
                expect(jasmine.Ajax.requests.mostRecent().url.endsWith('/task-forms/1/save-form')).toBeTruthy();
                expect(JSON.parse(jasmine.Ajax.requests.mostRecent().params).values.field1).toEqual(values.field1);
                expect(JSON.parse(jasmine.Ajax.requests.mostRecent().params).values.field2).toEqual(values.field2);
                done();
            });

            jasmine.Ajax.requests.mostRecent().respondWith({
                'status': 200,
                contentType: 'application/json',
                responseText: JSON.stringify(responseBody)
            });
        });

        it('should complete task form', (done) => {
            service.completeTaskForm('1', values).subscribe(() => {
                expect(jasmine.Ajax.requests.mostRecent().url.endsWith('/task-forms/1')).toBeTruthy();
                expect(JSON.parse(jasmine.Ajax.requests.mostRecent().params).values.field1).toEqual(values.field1);
                expect(JSON.parse(jasmine.Ajax.requests.mostRecent().params).values.field2).toEqual(values.field2);
                done();
            });

            jasmine.Ajax.requests.mostRecent().respondWith({
                'status': 200,
                contentType: 'application/json',
                responseText: JSON.stringify(responseBody)
            });
        });

        it('should complete task form with a specific outcome', (done) => {
            service.completeTaskForm('1', values, 'custom').subscribe(() => {
                expect(jasmine.Ajax.requests.mostRecent().url.endsWith('/task-forms/1')).toBeTruthy();
                expect(JSON.parse(jasmine.Ajax.requests.mostRecent().params).values.field2).toEqual(values.field2);
                expect(JSON.parse(jasmine.Ajax.requests.mostRecent().params).outcome).toEqual('custom');

                done();
            });

            jasmine.Ajax.requests.mostRecent().respondWith({
                'status': 200,
                contentType: 'application/json',
                responseText: JSON.stringify(responseBody)
            });
        });

        it('should get task form by id', (done) => {
            service.getTaskForm('1').subscribe((result) => {
                expect(jasmine.Ajax.requests.mostRecent().url.endsWith('/task-forms/1')).toBeTruthy();
                expect(result.id).toEqual(1);
                done();
            });

            jasmine.Ajax.requests.mostRecent().respondWith({
                'status': 200,
                contentType: 'application/json',
                responseText: JSON.stringify({ id: 1 })
            });
        });

        it('should get form definition by id', (done) => {
            service.getFormDefinitionById(1).subscribe((result) => {
                expect(jasmine.Ajax.requests.mostRecent().url.endsWith('/form-models/1')).toBeTruthy();
                expect(result.id).toEqual(1);
                done();
            });

            jasmine.Ajax.requests.mostRecent().respondWith({
                'status': 200,
                contentType: 'application/json',
                responseText: JSON.stringify({ id: 1 })
            });
        });

        it('should get form definition id by name', (done) => {
            const formName = 'form1';
            const formId = 1;
            const response = {
                data: [
                    { id: formId }
                ]
            };

            service.getFormDefinitionByName(formName).subscribe((result) => {
                expect(jasmine.Ajax.requests.mostRecent().url.endsWith(`models?filter=myReusableForms&filterText=${formName}&modelType=2`)).toBeTruthy();
                expect(result).toEqual(formId);
                done();
            });

            jasmine.Ajax.requests.mostRecent().respondWith({
                'status': 200,
                contentType: 'application/json',
                responseText: JSON.stringify(response)
            });
        });

        it('should get start form definition by process definition id', (done) => {

            const processApiSpy = jasmine.createSpyObj(['getProcessDefinitionStartForm']);
            spyOn(apiService, 'getInstance').and.returnValue({
                activiti: {
                    processApi: processApiSpy
                }
            });
            processApiSpy.getProcessDefinitionStartForm.and.returnValue(Promise.resolve({ id: '1' }));

            service.getStartFormDefinition('myprocess:1').subscribe(() => {
                expect(processApiSpy.getProcessDefinitionStartForm).toHaveBeenCalledWith('myprocess:1');
                done();
            });
        });

        it('should not get form id from response', () => {
            let response = new Response(new ResponseOptions({ body: null }));
            expect(service.getFormId(response)).toBeNull();

            response = new Response(new ResponseOptions({ body: {} }));
            expect(service.getFormId(response)).toBeNull();

            response = new Response(new ResponseOptions({ body: { data: null } }));
            expect(service.getFormId(response)).toBeNull();

            response = new Response(new ResponseOptions({ body: { data: [] } }));
            expect(service.getFormId(response)).toBeNull();

            expect(service.getFormId(null)).toBeNull();
        });

        it('should fallback to empty json array', () => {
            expect(service.toJsonArray(null)).toEqual([]);

            let response = new Response(new ResponseOptions({ body: {} }));
            expect(service.toJsonArray(response)).toEqual([]);

            response = new Response(new ResponseOptions({ body: { data: null } }));
            expect(service.toJsonArray(response)).toEqual([]);
        });

        it('should handle error with generic message', () => {
            service.handleError(null).subscribe(() => {
            }, (error) => {
                expect(error).toBe(FormService.UNKNOWN_ERROR_MESSAGE);
            });
        });

        it('should handle error with error message', () => {
            const message = '<error>';

            service.handleError({ message: message }).subscribe(() => {
            }, (error) => {
                expect(error).toBe(message);
            });
        });

        it('should handle error with detailed message', () => {
            service.handleError({
                status: '400',
                statusText: 'Bad request'
            }).subscribe(
                () => {
                },
                (error) => {
                    expect(error).toBe('400 - Bad request');
                });
        });

        it('should handle error with generic message', () => {
            service.handleError({}).subscribe(() => {
            }, (error) => {
                expect(error).toBe(FormService.GENERIC_ERROR_MESSAGE);
            });
        });

        it('should get all the forms with modelType=2', (done) => {
            service.getForms().subscribe((result) => {
                expect(jasmine.Ajax.requests.mostRecent().url.endsWith('models?modelType=2')).toBeTruthy();
                expect(result.length).toEqual(2);
                done();
            });

            jasmine.Ajax.requests.mostRecent().respondWith({
                'status': 200,
                contentType: 'application/json',
                responseText: JSON.stringify({
                    data: [
                        { name: 'FakeName-1', lastUpdatedByFullName: 'FakeUser-1', lastUpdated: '2017-01-02' },
                        { name: 'FakeName-2', lastUpdatedByFullName: 'FakeUser-2', lastUpdated: '2017-01-03' }
                    ]
                })
            });
        });

        it('should search for Form with modelType=2', (done) => {
            const response = { data: [{ id: 1, name: 'findMe' }, { id: 2, name: 'testForm' }] };

            service.searchFrom('findMe').subscribe((result) => {
                expect(jasmine.Ajax.requests.mostRecent().url.endsWith('models?modelType=2')).toBeTruthy();
                expect(result.name).toEqual('findMe');
                expect(result.id).toEqual(1);
                done();
            });

            jasmine.Ajax.requests.mostRecent().respondWith({
                'status': 200,
                contentType: 'application/json',
                responseText: JSON.stringify(response)
            });
        });

        it('should create a Form with modelType=2', (done) => {
            service.createForm('testName').subscribe(() => {
                expect(jasmine.Ajax.requests.mostRecent().url.endsWith('/models')).toBeTruthy();
                expect(JSON.parse(jasmine.Ajax.requests.mostRecent().params).modelType).toEqual(2);
                expect(JSON.parse(jasmine.Ajax.requests.mostRecent().params).name).toEqual('testName');
                done();
            });

            jasmine.Ajax.requests.mostRecent().respondWith({
                'status': 200,
                contentType: 'application/json',
                responseText: JSON.stringify(simpleResponseBody)
            });
        });

        it('should return list of people', (done) => {
            spyOn(service, 'getUserProfileImageApi').and.returnValue('/app/rest/users/2002/picture');
            const fakeFilter: string = 'whatever';

            service.getWorkflowUsers(fakeFilter).subscribe((result) => {
                expect(result).toBeDefined();
                expect(result.length).toBe(3);
                expect(result[0].id).toBe(2002);
                expect(result[0].firstName).toBe('Peo');
                done();
            });

            jasmine.Ajax.requests.mostRecent().respondWith({
                'status': 200,
                contentType: 'application/json',
                responseText: JSON.stringify(fakePeopleResponse)
            });
        });

        it('should return list of groups', (done) => {
            const fakeFilter: string = 'whatever';

            service.getWorkflowGroups(fakeFilter).subscribe((result) => {
                expect(result).toBeDefined();
                expect(result.length).toBe(2);
                expect(result[0].id).toBe('2004');
                expect(result[0].name).toBe('PEOPLE_GROUP');
                done();
            });

            jasmine.Ajax.requests.mostRecent().respondWith({
                'status': 200,
                contentType: 'application/json',
                responseText: JSON.stringify(fakeGroupResponse)
            });
        });

        it('should parse a Form Definition with tabs', () => {
            expect(formModelTabs.formDefinition).toBeDefined();
            const formParsed = service.parseForm(formModelTabs);
            expect(formParsed).toBeDefined();
        });

        it('should create a Form form a Node', (done) => {

            const nameForm = 'testNode';

            const formId = 100;

            stubCreateForm();

            stubGetEcmModel();

            stubAddFieldsToAForm();

            service.createFormFromANode(nameForm).subscribe((result) => {
                expect(result.id).toEqual(formId);
                done();
            });

            function stubCreateForm() {
                jasmine.Ajax.stubRequest(
                    'http://localhost:9876/bpm/activiti-app/api/enterprise/models'
                ).andReturn({
                    status: 200,
                    statusText: 'HTTP/1.1 200 OK',
                    contentType: 'text/xml;charset=UTF-8',
                    responseText: { id: formId, name: 'test', lastUpdatedByFullName: 'uset', lastUpdated: '12-12-2016' }
                });
            }

            function stubGetEcmModel() {
                jasmine.Ajax.stubRequest(
                    'http://localhost:9876/ecm/alfresco/api/-default-/private/alfresco/versions/1/cmm/activitiFormsModel/types'
                ).andReturn({
                    status: 200,
                    statusText: 'HTTP/1.1 200 OK',
                    contentType: 'text/xml;charset=UTF-8',
                    responseText: {
                        list: {
                            entries: [{
                                entry: {
                                    prefixedName: nameForm,
                                    title: nameForm,
                                    properties: [{ name: 'name' }, { name: 'email' }]
                                }
                            }, { entry: { prefixedName: 'notme', title: 'notme' } }]
                        }
                    }
                });
            }

            function stubAddFieldsToAForm() {
                jasmine.Ajax.stubRequest(
                    'http://localhost:9876/bpm/activiti-app/api/enterprise/editor/form-models/' + formId
                ).andReturn({
                    status: 200,
                    statusText: 'HTTP/1.1 200 OK',
                    contentType: 'text/xml;charset=UTF-8',
                    responseText: { id: formId, name: 'test', lastUpdatedByFullName: 'user', lastUpdated: '12-12-2016' }
                });
            }
        });

    });
});
