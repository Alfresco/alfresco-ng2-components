"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var http_1 = require("@angular/http");
var core_1 = require("@adf/core");
var form_definition_model_1 = require("../models/form-definition.model");
var form_service_mock_1 = require("./assets/form.service.mock");
var ecm_model_service_1 = require("./ecm-model.service");
var form_service_1 = require("./form.service");
var fakeGroupResponse = {
    'size': 2,
    'total': 2,
    'start': 0,
    'data': [{
            'id': 2004,
            'name': 'PEOPLE_GROUP',
            'externalId': null,
            'status': 'active',
            'groups': null
        }, { 'id': 2005, 'name': 'PEOPLE_GROUP_2', 'externalId': null, 'status': 'active', 'groups': null }]
};
var fakePeopleResponse = {
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
describe('Form service', function () {
    var service;
    var apiService;
    var logService;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            imports: [],
            providers: [
                ecm_model_service_1.EcmModelService,
                form_service_1.FormService
            ]
        }).compileComponents();
    }));
    beforeEach(function () {
        service = testing_1.TestBed.get(form_service_1.FormService);
        apiService = testing_1.TestBed.get(core_1.AlfrescoApiService);
        logService = testing_1.TestBed.get(core_1.LogService);
    });
    beforeEach(function () {
        jasmine.Ajax.install();
    });
    afterEach(function () {
        jasmine.Ajax.uninstall();
    });
    describe('Content tests', function () {
        var responseBody = {
            data: [
                { id: '1' },
                { id: '2' }
            ]
        };
        var values = {
            field1: 'one',
            field2: 'two'
        };
        var simpleResponseBody = { id: 1, modelType: 'test' };
        it('should fetch and parse process definitions', function (done) {
            service.getProcessDefinitions().subscribe(function (result) {
                expect(jasmine.Ajax.requests.mostRecent().url.endsWith('/process-definitions')).toBeTruthy();
                expect(result).toEqual(JSON.parse(jasmine.Ajax.requests.mostRecent().response).data);
                done();
            });
            jasmine.Ajax.requests.mostRecent().respondWith({
                'status': 200,
                contentType: 'application/json',
                responseText: JSON.stringify(responseBody)
            });
        });
        it('should fetch and parse tasks', function (done) {
            service.getTasks().subscribe(function (result) {
                expect(jasmine.Ajax.requests.mostRecent().url.endsWith('/tasks/query')).toBeTruthy();
                expect(result).toEqual(JSON.parse(jasmine.Ajax.requests.mostRecent().response).data);
                done();
            });
            jasmine.Ajax.requests.mostRecent().respondWith({
                'status': 200,
                contentType: 'application/json',
                responseText: JSON.stringify(responseBody)
            });
        });
        it('should fetch and parse the task by id', function (done) {
            service.getTask('1').subscribe(function (result) {
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
        it('should save task form', function (done) {
            service.saveTaskForm('1', values).subscribe(function () {
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
        it('should complete task form', function (done) {
            service.completeTaskForm('1', values).subscribe(function () {
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
        it('should complete task form with a specific outcome', function (done) {
            service.completeTaskForm('1', values, 'custom').subscribe(function () {
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
        it('should get task form by id', function (done) {
            service.getTaskForm('1').subscribe(function (result) {
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
        it('should get form definition by id', function (done) {
            service.getFormDefinitionById('1').subscribe(function (result) {
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
        it('should get form definition id by name', function (done) {
            var formName = 'form1';
            var formId = 1;
            var response = {
                data: [
                    { id: formId }
                ]
            };
            service.getFormDefinitionByName(formName).subscribe(function (result) {
                expect(jasmine.Ajax.requests.mostRecent().url.endsWith("models?filter=myReusableForms&filterText=" + formName + "&modelType=2")).toBeTruthy();
                expect(result).toEqual(formId);
                done();
            });
            jasmine.Ajax.requests.mostRecent().respondWith({
                'status': 200,
                contentType: 'application/json',
                responseText: JSON.stringify(response)
            });
        });
        it('should get start form definition by process definition id', function (done) {
            var processApiSpy = jasmine.createSpyObj(['getProcessDefinitionStartForm']);
            spyOn(apiService, 'getInstance').and.returnValue({
                activiti: {
                    processApi: processApiSpy
                }
            });
            processApiSpy.getProcessDefinitionStartForm.and.returnValue(Promise.resolve({ id: '1' }));
            service.getStartFormDefinition('myprocess:1').subscribe(function (result) {
                expect(processApiSpy.getProcessDefinitionStartForm).toHaveBeenCalledWith('myprocess:1');
                done();
            });
        });
        it('should not get form id from response', function () {
            var response = new http_1.Response(new http_1.ResponseOptions({ body: null }));
            expect(service.getFormId(response)).toBeNull();
            response = new http_1.Response(new http_1.ResponseOptions({ body: {} }));
            expect(service.getFormId(response)).toBeNull();
            response = new http_1.Response(new http_1.ResponseOptions({ body: { data: null } }));
            expect(service.getFormId(response)).toBeNull();
            response = new http_1.Response(new http_1.ResponseOptions({ body: { data: [] } }));
            expect(service.getFormId(response)).toBeNull();
            expect(service.getFormId(null)).toBeNull();
        });
        it('should fallback to empty json array', function () {
            expect(service.toJsonArray(null)).toEqual([]);
            var response = new http_1.Response(new http_1.ResponseOptions({ body: {} }));
            expect(service.toJsonArray(response)).toEqual([]);
            response = new http_1.Response(new http_1.ResponseOptions({ body: { data: null } }));
            expect(service.toJsonArray(response)).toEqual([]);
        });
        it('should handle error with generic message', function () {
            service.handleError(null).subscribe(function () {
            }, function (error) {
                expect(error).toBe(form_service_1.FormService.UNKNOWN_ERROR_MESSAGE);
            });
        });
        it('should handle error with error message', function () {
            var message = '<error>';
            service.handleError({ message: message }).subscribe(function () {
            }, function (error) {
                expect(error).toBe(message);
            });
        });
        it('should handle error with detailed message', function () {
            service.handleError({
                status: '400',
                statusText: 'Bad request'
            }).subscribe(function () {
            }, function (error) {
                expect(error).toBe('400 - Bad request');
            });
        });
        it('should handle error with generic message', function () {
            service.handleError({}).subscribe(function () {
            }, function (error) {
                expect(error).toBe(form_service_1.FormService.GENERIC_ERROR_MESSAGE);
            });
        });
        it('should get all the forms with modelType=2', function (done) {
            service.getForms().subscribe(function (result) {
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
        it('should search for Form with modelType=2', function (done) {
            var response = { data: [{ id: 1, name: 'findme' }, { id: 2, name: 'testform' }] };
            service.searchFrom('findme').subscribe(function (result) {
                expect(jasmine.Ajax.requests.mostRecent().url.endsWith('models?modelType=2')).toBeTruthy();
                expect(result.name).toEqual('findme');
                expect(result.id).toEqual(1);
                done();
            });
            jasmine.Ajax.requests.mostRecent().respondWith({
                'status': 200,
                contentType: 'application/json',
                responseText: JSON.stringify(response)
            });
        });
        it('should create a Form with modelType=2', function (done) {
            service.createForm('testName').subscribe(function (result) {
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
        it('should add form fields to a form', function (done) {
            var formId = '100';
            var name = 'testName';
            var data = [{ name: 'name' }, { name: 'email' }];
            var formDefinitionModel = new form_definition_model_1.FormDefinitionModel(formId, name, 'testUserName', '2016-09-05T14:41:19.049Z', data);
            service.addFieldsToAForm(formId, formDefinitionModel).subscribe(function (result) {
                expect(jasmine.Ajax.requests.mostRecent().url.endsWith('/form-models/' + formId)).toBeTruthy();
                expect(JSON.parse(jasmine.Ajax.requests.mostRecent().params).formRepresentation.name).toEqual(name);
                done();
            });
            jasmine.Ajax.requests.mostRecent().respondWith({
                'status': 200,
                contentType: 'application/json',
                responseText: JSON.stringify(simpleResponseBody)
            });
        });
        it('should return list of people', function (done) {
            spyOn(service, 'getUserProfileImageApi').and.returnValue('/app/rest/users/2002/picture');
            var fakeFilter = 'whatever';
            service.getWorkflowUsers(fakeFilter).subscribe(function (result) {
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
        it('should return list of groups', function (done) {
            var fakeFilter = 'whatever';
            service.getWorkflowGroups(fakeFilter).subscribe(function (result) {
                expect(result).toBeDefined();
                expect(result.length).toBe(2);
                expect(result[0].id).toBe(2004);
                expect(result[0].name).toBe('PEOPLE_GROUP');
                done();
            });
            jasmine.Ajax.requests.mostRecent().respondWith({
                'status': 200,
                contentType: 'application/json',
                responseText: JSON.stringify(fakeGroupResponse)
            });
        });
        it('should parse a Form Definition with tabs', function () {
            expect(form_service_mock_1.formModelTabs.formDefinition).toBeDefined();
            var formParsed = service.parseForm(form_service_mock_1.formModelTabs);
            expect(formParsed).toBeDefined();
        });
        it('should create a Form form a Node', function (done) {
            var nameForm = 'testNode';
            var formId = 100;
            stubCreateForm();
            stubGetEcmModel();
            stubAddFieldsToAForm();
            service.createFormFromANode(nameForm).subscribe(function (result) {
                expect(result.id).toEqual(formId);
                done();
            });
            function stubCreateForm() {
                jasmine.Ajax.stubRequest('http://localhost:9876/bpm/activiti-app/api/enterprise/models').andReturn({
                    status: 200,
                    statusText: 'HTTP/1.1 200 OK',
                    contentType: 'text/xml;charset=UTF-8',
                    responseText: { id: formId, name: 'test', lastUpdatedByFullName: 'uset', lastUpdated: '12-12-2016' }
                });
            }
            function stubGetEcmModel() {
                jasmine.Ajax.stubRequest('http://localhost:9876/ecm/alfresco/api/-default-/private/alfresco/versions/1/cmm/activitiFormsModel/types').andReturn({
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
                jasmine.Ajax.stubRequest('http://localhost:9876/bpm/activiti-app/api/enterprise/editor/form-models/' + formId).andReturn({
                    status: 200,
                    statusText: 'HTTP/1.1 200 OK',
                    contentType: 'text/xml;charset=UTF-8',
                    responseText: { id: formId, name: 'test', lastUpdatedByFullName: 'user', lastUpdated: '12-12-2016' }
                });
            }
        });
    });
});
