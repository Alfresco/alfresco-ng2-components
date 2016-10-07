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
import {
    AlfrescoAuthenticationService,
    AlfrescoSettingsService,
    AlfrescoApiService
} from 'ng2-alfresco-core';
import { FormService } from './form.service';
import { EcmModelService } from './ecm-model.service';
import { FormDefinitionModel } from '../models/form-definition.model';
import { HttpModule, Response, ResponseOptions } from '@angular/http';

declare let jasmine: any;

describe('FormService', () => {

    let responseBody: any, service: FormService;

    beforeAll(() => {
        TestBed.configureTestingModule({
            imports: [HttpModule],
            providers: [
                AlfrescoAuthenticationService,
                AlfrescoSettingsService,
                EcmModelService,
                AlfrescoApiService,
                FormService
            ]
        });
        service = TestBed.get(FormService);
    });

    beforeEach(() => {
        jasmine.Ajax.install();
    });

    afterEach(() => {
        jasmine.Ajax.uninstall();
    });

    it('should fetch and parse process definitions', (done) => {
        responseBody = {
            data: [
                {id: '1'},
                {id: '2'}
            ]
        };

        service.getProcessDefinitions().subscribe(result => {
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

    it('should fetch and parse tasks', (done) => {
        responseBody = {
            data: [
                {id: '1'},
                {id: '2'}
            ]
        };

        service.getTasks().subscribe(result => {
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

    it('should fetch and parse the task by id', (done) => {
        responseBody = {
            id: '1'
        };

        service.getTask('1').subscribe(result => {
            expect(jasmine.Ajax.requests.mostRecent().url.endsWith('/tasks/1')).toBeTruthy();
            expect(result.id).toEqual(responseBody.id);
            done();
        });

        jasmine.Ajax.requests.mostRecent().respondWith({
            'status': 200,
            contentType: 'application/json',
            responseText: JSON.stringify(responseBody)
        });
    });

    it('should save task form', (done) => {
        let values = {
            field1: 'one',
            field2: 'two'
        };

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
        let values = {
            field1: 'one',
            field2: 'two'
        };

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
        let values = {
            field1: 'one',
            field2: 'two'
        };

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
        responseBody = {id: 1};

        service.getTaskForm('1').subscribe(result => {
            expect(jasmine.Ajax.requests.mostRecent().url.endsWith('/task-forms/1')).toBeTruthy();
            expect(result.id).toEqual(responseBody.id);
            done();
        });

        jasmine.Ajax.requests.mostRecent().respondWith({
            'status': 200,
            contentType: 'application/json',
            responseText: JSON.stringify(responseBody)
        });
    });

    it('should get form definition by id', (done) => {
        responseBody = {id: 1};

        service.getFormDefinitionById('1').subscribe(result => {
            expect(jasmine.Ajax.requests.mostRecent().url.endsWith('/form-models/1')).toBeTruthy();
            expect(result.id).toEqual(responseBody.id);
            done();
        });

        jasmine.Ajax.requests.mostRecent().respondWith({
            'status': 200,
            contentType: 'application/json',
            responseText: JSON.stringify(responseBody)
        });
    });

    it('should get form definition id by name', (done) => {
        const formName = 'form1';
        const formId = 1;
        responseBody = {
            data: [
                {id: formId}
            ]
        };

        service.getFormDefinitionByName(formName).subscribe(result => {
            expect(jasmine.Ajax.requests.mostRecent().url.endsWith(`models?filter=myReusableForms&filterText=${formName}&modelType=2`)).toBeTruthy();
            expect(result).toEqual(formId);
            done();
        });

        jasmine.Ajax.requests.mostRecent().respondWith({
            'status': 200,
            contentType: 'application/json',
            responseText: JSON.stringify(responseBody)
        });
    });

    it('should not get form id from response', () => {
        let response = new Response(new ResponseOptions({body: null}));
        expect(service.getFormId(response)).toBeNull();

        response = new Response(new ResponseOptions({body: {}}));
        expect(service.getFormId(response)).toBeNull();

        response = new Response(new ResponseOptions({body: {data: null}}));
        expect(service.getFormId(response)).toBeNull();

        response = new Response(new ResponseOptions({body: {data: []}}));
        expect(service.getFormId(response)).toBeNull();

        expect(service.getFormId(null)).toBeNull();
    });

    it('should fallback to empty json array', () => {
        expect(service.toJsonArray(null)).toEqual([]);

        let response = new Response(new ResponseOptions({body: {}}));
        expect(service.toJsonArray(response)).toEqual([]);

        response = new Response(new ResponseOptions({body: {data: null}}));
        expect(service.toJsonArray(response)).toEqual([]);
    });

    it('should handle error with generic message', () => {
        spyOn(console, 'error').and.stub();

        service.handleError(null);
        expect(console.error).toHaveBeenCalledWith(FormService.UNKNOWN_ERROR_MESSAGE);
    });

    it('should handle error with error message', () => {
        spyOn(console, 'error').and.stub();

        const message = '<error>';
        service.handleError({message: message});

        expect(console.error).toHaveBeenCalledWith(message);
    });

    it('should handle error with detailed message', () => {
        spyOn(console, 'error').and.stub();
        service.handleError({
            status: '400',
            statusText: 'Bad request'
        });
        expect(console.error).toHaveBeenCalledWith('400 - Bad request');
    });

    it('should handle error with generic message', () => {
        spyOn(console, 'error').and.stub();
        service.handleError({});
        expect(console.error).toHaveBeenCalledWith(FormService.GENERIC_ERROR_MESSAGE);
    });

    it('should get all the forms with modelType=2', (done) => {
        responseBody = {};

        service.getForms().subscribe(result => {
            expect(jasmine.Ajax.requests.mostRecent().url.endsWith('models?modelType=2')).toBeTruthy();
            expect(result).toEqual(responseBody);
            done();
        });

        jasmine.Ajax.requests.mostRecent().respondWith({
            'status': 200,
            contentType: 'application/json',
            responseText: JSON.stringify(responseBody)
        });
    });

    it('should search for Form with modelType=2', (done) => {
        responseBody = {data: [{id: 1, name: 'findme'}, {id: 2, name: 'testform'}]};

        service.searchFrom('findme').subscribe(result => {
            expect(jasmine.Ajax.requests.mostRecent().url.endsWith('models?modelType=2')).toBeTruthy();
            expect(result.name).toEqual('findme');
            expect(result.id).toEqual(1);
            done();
        });

        jasmine.Ajax.requests.mostRecent().respondWith({
            'status': 200,
            contentType: 'application/json',
            responseText: JSON.stringify(responseBody)
        });
    });

    it('should create a Form with modelType=2', (done) => {
        responseBody = {id: 1, modelType: 'test'};

        service.createForm('testName').subscribe(result => {
            expect(jasmine.Ajax.requests.mostRecent().url.endsWith('/models')).toBeTruthy();
            expect(JSON.parse(jasmine.Ajax.requests.mostRecent().params).modelType).toEqual(2);
            expect(JSON.parse(jasmine.Ajax.requests.mostRecent().params).name).toEqual('testName');
            done();
        });

        jasmine.Ajax.requests.mostRecent().respondWith({
            'status': 200,
            contentType: 'application/json',
            responseText: JSON.stringify(responseBody)
        });
    });

    it('should add form fields to a form', (done) => {
        responseBody = {id: 1, modelType: 'test'};

        let formId = '100';
        let name = 'testName';
        let data = [{name: 'name'}, {name: 'email'}];
        let formDefinitionModel = new FormDefinitionModel(formId, name, 'testUserName', '2016-09-05T14:41:19.049Z', data);

        service.addFieldsToAForm(formId, formDefinitionModel).subscribe(result => {
            expect(jasmine.Ajax.requests.mostRecent().url.endsWith('/form-models/' + formId)).toBeTruthy();
            expect(JSON.parse(jasmine.Ajax.requests.mostRecent().params).formRepresentation.name).toEqual(name);
            done();
        });

        jasmine.Ajax.requests.mostRecent().respondWith({
            'status': 200,
            contentType: 'application/json',
            responseText: JSON.stringify(responseBody)
        });
    });

    it('should create a Form form a Node', (done) => {

        let nameForm = 'testNode';

        responseBody = {id: 1, modelType: 'test'};

        let formId = 100;

        stubCreateForm();

        stubGetEcmModel();

        stubAddFieldsToAForm();

        service.createFormFromANode(nameForm).subscribe(result => {
            expect(result.id).toEqual(formId);
            done();
        });

        function stubCreateForm() {
            jasmine.Ajax.stubRequest(
                'http://localhost:9999/activiti-app/api/enterprise/models'
            ).andReturn({
                status: 200,
                statusText: 'HTTP/1.1 200 OK',
                contentType: 'text/xml;charset=UTF-8',
                responseText: {id: formId, name: 'test', lastUpdatedByFullName: 'uset', lastUpdated: '12-12-2016'}
            });
        }

        function stubGetEcmModel() {
            jasmine.Ajax.stubRequest(
                'http://localhost:8080/alfresco/api/-default-/private/alfresco/versions/1/cmm/activitiFormsModel/types'
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
                                properties: [{name: 'name'}, {name: 'email'}]
                            }
                        }, {entry: {prefixedName: 'notme', title: 'notme'}}]
                    }
                }
            });
        }

        function stubAddFieldsToAForm() {
            jasmine.Ajax.stubRequest(
                'http://localhost:9999/activiti-app/api/enterprise/editor/form-models/' + formId
            ).andReturn({
                status: 200,
                statusText: 'HTTP/1.1 200 OK',
                contentType: 'text/xml;charset=UTF-8',
                responseText: {id: formId, name: 'test', lastUpdatedByFullName: 'user', lastUpdated: '12-12-2016'}
            });
        }
    });
});
