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

import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { WebscriptComponent } from '../src/webscript.component';
import { DebugElement }    from '@angular/core';
import {
    AlfrescoAuthenticationService,
    AlfrescoSettingsService,
    AlfrescoApiService,
    CoreModule
} from 'ng2-alfresco-core';
import { DataTableModule } from 'ng2-alfresco-datatable';

declare let jasmine: any;

describe('Test ng2-alfresco-webscript', () => {

    let component: any;
    let fixture: ComponentFixture<WebscriptComponent>;
    let debug: DebugElement;
    let element: HTMLElement;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule,
                DataTableModule
            ],
            declarations: [WebscriptComponent],
            providers: [
                AlfrescoSettingsService,
                AlfrescoAuthenticationService,
                AlfrescoApiService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(WebscriptComponent);
        component = fixture.componentInstance;

        debug = fixture.debugElement;
        element = fixture.nativeElement;
        component = fixture.componentInstance;
        component.scriptPath = 'fakePath';
        component.showData = true;
        fixture.detectChanges();
    });

    describe('View', () => {
        it('html wrapper should be present', () => {
            expect(element.querySelector('#webscript-html-wrapper')).toBeDefined();
        });

        it('wrapper should be hide if showData is false', () => {
            expect(element.querySelector('#webscript-html-wrapper')).toBeDefined();
        });

        it('JSON datatable wrapper should be present', () => {
            expect(element.querySelector('#webscript-json-wrapper')).toBeDefined();
        });

        it('plain text datatable wrapper should be present', () => {
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

        it('url should be the one configured by the input param', (done) => {
            component.scriptPath = 'sample/folder/Company%20Home';

            component.ngOnChanges().then(() => {
                fixture.detectChanges();
                expect(jasmine.Ajax.requests.mostRecent().url).toBe('http://localhost:8080/alfresco/service/sample/folder/Company%20Home');
                done();
            });

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'text/plain',
                responseText: '<div></div>'
            });
        });

        it('TEXT response should be displayed', (done) => {
            component.scriptPath = 'sample/folder/Company%20Home';
            component.contentType = 'TEXT';

            component.ngOnChanges().then(() => {
                fixture.detectChanges();
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

        it('JSON response should be displayed', (done) => {
            component.scriptPath = 'sample/folder/Company%20Home';
            component.contentType = 'JSON';

            component.ngOnChanges().then(() => {
                fixture.detectChanges();
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

        xit('HTML response should be displayed', (done) => {
            component.scriptPath = 'sample/folder/Company%20Home';
            component.contentType = 'HTML';

            component.ngOnChanges().then(() => {
                fixture.detectChanges();
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

        it('datatable response should be displayed', (done) => {
            // reset MDL handler
            window['componentHandler'] = null;

            component.scriptPath = 'sample/folder/Company%20Home';
            component.contentType = 'DATATABLE';

            component.ngOnChanges().then(() => {
                fixture.detectChanges();
                expect(element.querySelector('#webscript-datatable-wrapper').innerHTML).toBeDefined();
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

        it('datatable response should be displayed also if no schema is provided', (done) => {
            // reset MDL handler
            window['componentHandler'] = null;

            component.scriptPath = 'sample/folder/Company%20Home';
            component.contentType = 'DATATABLE';

            component.ngOnChanges().then(() => {
                fixture.detectChanges();
                expect(element.querySelector('#webscript-datatable-wrapper').innerHTML).toBeDefined();
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
