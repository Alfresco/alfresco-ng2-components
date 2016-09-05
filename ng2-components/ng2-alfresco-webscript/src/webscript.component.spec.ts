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

import { describe, expect, it, inject, beforeEachProviders, beforeEach, afterEach, xit } from '@angular/core/testing';
import { TestComponentBuilder } from '@angular/compiler/testing';
import { WebscriptComponent } from '../src/webscript.component';

import { AlfrescoAuthenticationService, AlfrescoSettingsService, AlfrescoApiService } from 'ng2-alfresco-core';

declare let jasmine: any;

describe('Test ng2-alfresco-webscript', () => {

    let webscriptComponentFixture, element, component;

    beforeEachProviders(() => {
        return [
            AlfrescoSettingsService,
            AlfrescoApiService,
            AlfrescoAuthenticationService
        ];
    });

    beforeEach(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
        return tcb
            .createAsync(WebscriptComponent)
            .then(fixture => {
                webscriptComponentFixture = fixture;
                element = webscriptComponentFixture.nativeElement;
                component = webscriptComponentFixture.componentInstance;
                component.scriptPath = 'fakePath';
                component.showData = true;
            });
    }));

    describe('View', () => {
        it('webscript html wrapper should be present', () => {
            expect(element.querySelector('#webscript-html-wrapper')).toBeDefined();
        });

        it('webscript wrapper should be hide if showData is false', () => {
            webscriptComponentFixture.detectChanges();
            expect(element.querySelector('#webscript-html-wrapper')).toBe.undefined;
        });

        it('webscript JSON datatable wrapper should be present', () => {
            webscriptComponentFixture.detectChanges();

            expect(element.querySelector('#webscript-json-wrapper')).toBeDefined();
        });

        it('webscript plain text datatable wrapper should be present', () => {
            webscriptComponentFixture.detectChanges();

            expect(element.querySelector('#webscript-plaintext-wrapper')).toBeDefined();
        });
    });

    describe('Content tests', () => {

        beforeEach(() => {
            jasmine.Ajax.install();
        });

        afterEach(() => {
            jasmine.Ajax.uninstall();
        });

        it('webscript url should be the one configured by the input param', (done) => {
            component.scriptPath = 'sample/folder/Company%20Home';

            component.ngOnChanges().then(() => {
                webscriptComponentFixture.detectChanges();
                let request = jasmine.Ajax.requests.mostRecent();
                expect(request.url).toBe('http://localhost:8080/alfresco/service/sample/folder/Company%20Home');
                done();
            });

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'text/plain',
                responseText: '<div></div>'
            });
        });

        it('webscript TEXT response should be displayed', (done) => {

            component.scriptPath = 'sample/folder/Company%20Home';
            component.contentType = 'TEXT';

            component.ngOnChanges().then(() => {
                webscriptComponentFixture.detectChanges();
                expect(element.querySelector('#webscript-data-TEXT').innerHTML)
                    .toBe('text test');
                done();
            });

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'text/html',
                responseText: 'text test'
            });
        });

        it('webscript JSON response should be displayed', (done) => {

            component.scriptPath = 'sample/folder/Company%20Home';
            component.contentType = 'JSON';

            component.ngOnChanges().then(() => {
                webscriptComponentFixture.detectChanges();
                expect(JSON.parse(element.querySelector('#webscript-data-JSON').innerHTML)[0].name).toBe('Name 1');
                expect(JSON.parse(element.querySelector('#webscript-data-JSON').innerHTML)[1].name).toBe('Name 2');
                done();
            });

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: [{id: 1, name: 'Name 1'},
                    {id: 2, name: 'Name 2'}]
            });
        });

        xit('webscript HTML response should be displayed', (done) => {

            component.scriptPath = 'sample/folder/Company%20Home';
            component.contentType = 'HTML';

            component.ngOnChanges().then(() => {
                webscriptComponentFixture.detectChanges();
                expect(element.querySelector('#webscript-data-HTML').innerHTML)
                    .toBe('&lt;test-element-id&gt;&lt;test-elemt-id&gt;');
                done();
            });

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'text/html',
                responseText: '<test-element-id><test-elemt-id>'
            });
        });

        it('webscript Datatable response should be displayed', (done) => {

            component.scriptPath = 'sample/folder/Company%20Home';
            component.contentType = 'DATATABLE';

            component.ngOnChanges().then(() => {
                webscriptComponentFixture.detectChanges();
                expect(element.querySelector('#webscript-datatable-wrapper').innerHTML).not.toBe.undefined;
                done();
            });

            let dataTable = {
                data: [
                    {id: 1, name: 'Name 1'},
                    {id: 2, name: 'Name 2'}
                ],
                schema: [{
                    type: 'text',
                    key: 'id',
                    title: 'Id',
                    sortable: true
                }, {
                    type: 'text',
                    key: 'name',
                    title: 'Name',
                    sortable: true
                }]
            };

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: dataTable
            });
        });

        it('webscript Datatable response should be displayed also if no schema is provided', (done) => {

            component.scriptPath = 'sample/folder/Company%20Home';
            component.contentType = 'DATATABLE';

            component.ngOnChanges().then(() => {
                webscriptComponentFixture.detectChanges();
                expect(element.querySelector('#webscript-datatable-wrapper').innerHTML).not.toBe.undefined;
                done();
            });

            let dataTable = {
                data: [
                    {id: 1, name: 'Name 1'},
                    {id: 2, name: 'Name 2'}
                ]
            };

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: dataTable
            });
        });
    });
});
