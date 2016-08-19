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
import { DropdownWidget } from './dropdown.widget';
import { FormModel } from './../core/form.model';
import { FormFieldModel } from './../core/form-field.model';

describe('DropdownWidget', () => {

    let http: Http;
    let widget: DropdownWidget;

    beforeEach(() => {
        http = <Http> {
            get(url: string, options?: RequestOptionsArgs): Observable<Response> {
                return null;
            }
        };
        widget = new DropdownWidget(http);
    });

    it('should fetch and parse REST data on init', () => {

        let data = [
            { uid: '1', text: 'One' },
            { uid: '2', text: 'Two' }
        ];

        spyOn(http, 'get').and.callFake((url) => {
            return Observable.create(observer => {
                let options = new ResponseOptions({
                    body: data,
                    url: url
                });
                let response = new Response(options);
                observer.next(response);
                observer.complete();
            });
        });

        let field = new FormFieldModel(new FormModel(), {
            optionType: 'rest',
            restUrl: 'http://<address>',
            restIdProperty: 'uid',
            restLabelProperty: 'text'
        });

        widget.field = field;
        widget.ngOnInit();


        expect((<any>http.get).calls.argsFor(0)).toEqual([field.restUrl]);
        expect(field.options.length).toBe(2);

        expect(field.options[0].id).toBe(data[0].uid);
        expect(field.options[0].name).toBe(data[0].text);

        expect(field.options[1].id).toBe(data[1].uid);
        expect(field.options[1].name).toBe(data[1].text);
    });

    it('should require REST settings to fetch data', () => {
        let form = new FormModel();
        spyOn(http, 'get').and.stub();

        // 1) Null field
        widget.field = null;
        widget.ngOnInit();
        expect(http.get).not.toHaveBeenCalled();

        // 2) Missing [optionType]
        widget.field = new FormFieldModel(form, {
            optionType: null,
            restUrl: 'http://<address>',
            restIdProperty: 'uid',
            restLabelProperty: 'text'
        });
        widget.ngOnInit();
        expect(http.get).not.toHaveBeenCalled();

        // 3) Missing [restUrl]
        widget.field = new FormFieldModel(form, {
            optionType: 'rest',
            restUrl: null,
            restIdProperty: 'uid',
            restLabelProperty: 'text'
        });
        widget.ngOnInit();
        expect(http.get).not.toHaveBeenCalled();

        // 4) Missing [restIdProperty]
        widget.field = new FormFieldModel(form, {
            optionType: 'rest',
            restUrl: 'http://<address>',
            restIdProperty: null,
            restLabelProperty: 'text'
        });
        widget.ngOnInit();
        expect(http.get).not.toHaveBeenCalled();

        // 4) Missing [restLabelProperty]
        widget.field = new FormFieldModel(form, {
            optionType: 'rest',
            restUrl: 'http://<address>',
            restIdProperty: null,
            restLabelProperty: null
        });
        widget.ngOnInit();
        expect(http.get).not.toHaveBeenCalled();
    });

    it('should parse only array response', () => {
        expect(widget.loadFromJson([])).toBeFalsy();

        widget.field = new FormFieldModel(new FormModel());
        expect(widget.loadFromJson([])).toBeTruthy();

        expect(widget.loadFromJson(null)).toBeFalsy();
        expect(widget.loadFromJson({})).toBeFalsy();
    });

    it('should bind to nested properties', () => {
        let data = [
            { uid: { value: 1 }, name: { fullName: 'John Doe' } }
        ];

        spyOn(http, 'get').and.callFake((url) => {
            return Observable.create(observer => {
                let options = new ResponseOptions({
                    body: data,
                    url: url
                });
                let response = new Response(options);
                observer.next(response);
                observer.complete();
            });
        });

        let field = new FormFieldModel(new FormModel(), {
            optionType: 'rest',
            restUrl: 'http://<address>',
            restIdProperty: 'uid.value',
            restLabelProperty: 'name.fullName'
        });

        widget.field = field;
        widget.ngOnInit();

        expect(field.options.length).toBe(1);
        expect(field.options[0].id).toBe(data[0].uid.value.toString());
        expect(field.options[0].name).toBe(data[0].name.fullName);
    });

    it('should update form upon loading REST data', () => {
        let field = new FormFieldModel(new FormModel());
        widget.field = field;

        spyOn(field, 'updateForm').and.stub();

        expect(widget.loadFromJson([])).toBeTruthy();
        expect(field.updateForm).toHaveBeenCalled();
    });

    it('should handle error with generic message', () => {
        spyOn(console, 'error').and.stub();

        widget.handleError(null);
        expect(console.error).toHaveBeenCalledWith(DropdownWidget.UNKNOWN_ERROR_MESSAGE);
    });

    it('should handle error with error message', () => {
        spyOn(console, 'error').and.stub();

        const message = '<error>';
        widget.handleError({ message: message });

        expect(console.error).toHaveBeenCalledWith(message);
    });

    it('should handle error with detailed message', () => {
        spyOn(console, 'error').and.stub();
        widget.handleError({
            status: '400',
            statusText: 'Bad request'
        });
        expect(console.error).toHaveBeenCalledWith('400 - Bad request');
    });

    it('should handle error with generic message', () => {
        spyOn(console, 'error').and.stub();
        widget.handleError({});
        expect(console.error).toHaveBeenCalledWith(DropdownWidget.GENERIC_ERROR_MESSAGE);
    });

});
