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

import { it, describe, expect, beforeEach } from '@angular/core/testing';
import { Http, RequestOptionsArgs, Response, ResponseOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { AlfrescoAuthenticationService, AlfrescoSettingsService } from 'ng2-alfresco-core';

import { FormService } from './form.service';
import { FormValues } from './../components/widgets/core/index';

describe('FormService', () => {

    let http: Http;
    let responseBody: any;
    let formService: FormService;
    let authService: AlfrescoAuthenticationService;
    let settingsService: AlfrescoSettingsService;

    let createResponse = (url, body): Observable<Response> => {
        return Observable.create(observer => {
            let response = new Response(new ResponseOptions({
                url: url,
                body: body
            }));
            observer.next(response);
            observer.complete();
        });
    };

    beforeEach(() => {

        http = <Http> {
            get(url: string, options?: RequestOptionsArgs): Observable<Response> {
                return createResponse(url, responseBody);
            },
            post(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
                return createResponse(url, responseBody);
            }
        };

        settingsService = new AlfrescoSettingsService();
        settingsService.setProviders([]);

        authService = new AlfrescoAuthenticationService(settingsService, null);
        formService = new FormService(http, authService, settingsService);
    });

    it('should resolve host address via settings service', () => {
        const url = '<url>';
        settingsService.bpmHost = url;
        expect(formService.getHostAddress()).toBe(url);
    });

    it('should fetch and parse process definitions', (done) => {
        spyOn(http, 'get').and.callThrough();

        responseBody = {
            data: [
                { id: '1' },
                { id: '2' }
            ]
        };

        formService.getProcessDefinitions().subscribe(result => {
            expect(http.get).toHaveBeenCalled();

            let args: any[] = (<any>http).get.calls.argsFor(0);
            expect(args[0].endsWith('/process-definitions')).toBeTruthy();

            expect(result).toEqual(responseBody.data);
            done();
        });
    });

    it('should fetch and parse tasks', (done) => {
        spyOn(http, 'post').and.callThrough();

        responseBody = {
            data: [
                { id: '1' },
                { id: '2' }
            ]
        };

        formService.getTasks().subscribe(result => {
            expect(http.post).toHaveBeenCalled();

            let args: any[] = (<any>http).post.calls.argsFor(0);
            expect(args[0].endsWith('/tasks/query')).toBeTruthy();

            expect(result).toEqual(responseBody.data);
            done();
        });
    });

    it('should fetch and parse the task by id', (done) => {
        spyOn(http, 'get').and.callThrough();

        responseBody = {
            id: '1'
        };

        formService.getTask('1').subscribe(result => {
            expect(http.get).toHaveBeenCalled();

            let args: any[] = (<any>http).get.calls.argsFor(0);
            expect(args[0].endsWith('/tasks/1')).toBeTruthy();

            expect(result).toEqual(responseBody);
            done();
        });
    });

    it('should save task form', (done) => {
        spyOn(http, 'post').and.callThrough();

        let values = <FormValues> {
            field1: 'one',
            field2: 'two'
        };

        formService.saveTaskForm('1', values).subscribe(() => {
            expect(http.post).toHaveBeenCalled();

            let args: any[] = (<any>http).post.calls.argsFor(0);
            expect(args[0].endsWith('/task-forms/1/save-form')).toBeTruthy();
            expect(args[1]).toEqual(JSON.stringify({ values: values }));

            done();
        });
    });

    it('should complete task form', (done) => {
        spyOn(http, 'post').and.callThrough();

        let values = <FormValues> {
            field1: 'one',
            field2: 'two'
        };

        formService.completeTaskForm('1', values).subscribe(() => {
            expect(http.post).toHaveBeenCalled();

            let args: any[] = (<any>http).post.calls.argsFor(0);
            expect(args[0].endsWith('/task-forms/1')).toBeTruthy();
            expect(args[1]).toEqual(JSON.stringify({ values: values }));

            done();
        });
    });

    it('should complete task form with a specific outcome', (done) => {
        spyOn(http, 'post').and.callThrough();

        let values = <FormValues> {
            field1: 'one',
            field2: 'two'
        };

        formService.completeTaskForm('1', values, 'custom').subscribe(() => {
            expect(http.post).toHaveBeenCalled();

            let args: any[] = (<any>http).post.calls.argsFor(0);
            expect(args[0].endsWith('/task-forms/1')).toBeTruthy();
            expect(args[1]).toEqual(JSON.stringify({ values: values, outcome: 'custom' }));

            done();
        });
    });

    it('should get task form by id', (done) => {
        spyOn(http, 'get').and.callThrough();

        responseBody = { id: '1' };

        formService.getTaskForm('1').subscribe(result => {
            expect(http.get).toHaveBeenCalled();

            let args: any[] = (<any>http).get.calls.argsFor(0);
            expect(args[0].endsWith('/task-forms/1')).toBeTruthy();

            expect(result).toEqual(responseBody);
            done();
        });
    });

    it('should get form definition by id', (done) => {
        spyOn(http, 'get').and.callThrough();

        responseBody = { id: '1' };

        formService.getFormDefinitionById('1').subscribe(result => {
            expect(http.get).toHaveBeenCalled();

            let args: any[] = (<any>http).get.calls.argsFor(0);
            expect(args[0].endsWith('/form-models/1')).toBeTruthy();

            expect(result).toEqual(responseBody);
            done();
        });
    });

    it('should get form definition id by name', (done) => {
        spyOn(http, 'get').and.callThrough();

        const formName = 'form1';
        const formId = 1;
        responseBody = {
            data: [
                { id: formId }
            ]
        };

        formService.getFormDefinitionByName(formName).subscribe(result => {
            expect(http.get).toHaveBeenCalled();

            let args: any[] = (<any>http).get.calls.argsFor(0);
            expect(args[0].endsWith(`models?filter=myReusableForms&filterText=${formName}&modelType=2`)).toBeTruthy();

            expect(result).toEqual(formId);
            done();
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

    it('should convert response to json object', () => {
        let data = { id: 1 };
        let response = new Response(new ResponseOptions({ body: data }));
        expect(formService.toJson(response)).toEqual(data);
    });

    it('should fallback to empty json object', () => {
        let response = new Response(new ResponseOptions({ body: null }));
        expect(formService.toJson(response)).toEqual({});

        expect(formService.toJson(null)).toEqual({});
    });

    it('should convert response to json array', () => {
        let payload = {
            data: [
                { id: 1 }
            ]
        };

        let response = new Response(new ResponseOptions({ body: JSON.stringify(payload) }));
        expect(formService.toJsonArray(response)).toEqual(payload.data);
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
