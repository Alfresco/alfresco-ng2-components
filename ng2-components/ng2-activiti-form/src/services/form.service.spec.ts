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

import { it, inject, describe, expect, beforeEach, beforeEachProviders, afterEach } from '@angular/core/testing';
import { AlfrescoAuthenticationService, AlfrescoSettingsService } from 'ng2-alfresco-core';
import { Response, ResponseOptions } from '@angular/http';
import { FormService } from './form.service';

declare let jasmine: any;

describe('FormService', () => {

    let responseBody: any, formService: FormService;

    beforeEachProviders(() => {
        return [
            FormService,
            AlfrescoSettingsService,
            AlfrescoAuthenticationService
        ];
    });

    beforeEach(inject([FormService], (service: FormService) => {
        jasmine.Ajax.install();
        formService = service;
    }));

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

        formService.getProcessDefinitions().subscribe(result => {
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
                { id: '1' },
                { id: '2' }
            ]
        };

        formService.getTasks().subscribe(result => {
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

        formService.getTask('1').subscribe(result => {
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

        formService.saveTaskForm('1', values).subscribe(() => {
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

        formService.completeTaskForm('1', values).subscribe(() => {
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

        formService.completeTaskForm('1', values, 'custom').subscribe(() => {
            expect(jasmine.Ajax.requests.mostRecent().url.endsWith('/task-forms/1')).toBeTruthy();
            expect(JSON.parse(jasmine.Ajax.requests.mostRecent().params).values.field2).toEqual(values.field2);
            expect(JSON.parse(jasmine.Ajax.requests.mostRecent().params).outcome).toEqual('custom' );

            done();
        });

        jasmine.Ajax.requests.mostRecent().respondWith({
            'status': 200,
            contentType: 'application/json',
            responseText: JSON.stringify(responseBody)
        });
    });

    it('should get task form by id', (done) => {
        responseBody = { id: 1 };

        formService.getTaskForm('1').subscribe(result => {
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
        responseBody = { id: 1 };

        formService.getFormDefinitionById('1').subscribe(result => {
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
                { id: formId }
            ]
        };

        formService.getFormDefinitionByName(formName).subscribe(result => {
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
        let response = new Response(new ResponseOptions({ body: null }));
        expect(formService.getFormId(response)).toBeNull();

        response = new Response(new ResponseOptions({ body: {} }));
        expect(formService.getFormId(response)).toBeNull();

        response = new Response(new ResponseOptions({ body: { data: null } }));
        expect(formService.getFormId(response)).toBeNull();

        response = new Response(new ResponseOptions({ body: { data: [] } }));
        expect(formService.getFormId(response)).toBeNull();

        expect(formService.getFormId(null)).toBeNull();
    });

    it('should fallback to empty json array', () => {
        expect(formService.toJsonArray(null)).toEqual([]);

        let response = new Response(new ResponseOptions({ body: {} }));
        expect(formService.toJsonArray(response)).toEqual([]);

        response = new Response(new ResponseOptions({ body: { data: null } }));
        expect(formService.toJsonArray(response)).toEqual([]);
    });

    it('should handle error with generic message', () => {
        spyOn(console, 'error').and.stub();

        formService.handleError(null);
        expect(console.error).toHaveBeenCalledWith(FormService.UNKNOWN_ERROR_MESSAGE);
    });

    it('should handle error with error message', () => {
        spyOn(console, 'error').and.stub();

        const message = '<error>';
        formService.handleError({ message: message });

        expect(console.error).toHaveBeenCalledWith(message);
    });

    it('should handle error with detailed message', () => {
        spyOn(console, 'error').and.stub();
        formService.handleError({
            status: '400',
            statusText: 'Bad request'
        });
        expect(console.error).toHaveBeenCalledWith('400 - Bad request');
    });

    it('should handle error with generic message', () => {
        spyOn(console, 'error').and.stub();
        formService.handleError({});
        expect(console.error).toHaveBeenCalledWith(FormService.GENERIC_ERROR_MESSAGE);
    });
});
