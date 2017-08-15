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

import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AppConfigModule, CoreModule } from 'ng2-alfresco-core';
import { TagNodeListComponent } from '../components/tag-node-list.component';
import { TagService } from '../services/tag.service';
import { MaterialModule } from './material.module';

declare let jasmine: any;

describe('TagNodeList', () => {

    let dataTag = {
        'list': {
            'pagination': {
                'count': 3,
                'hasMoreItems': false,
                'totalItems': 3,
                'skipCount': 0,
                'maxItems': 100
            },
            'entries': [{
                'entry': {'tag': 'test1', 'id': '0ee933fa-57fc-4587-8a77-b787e814f1d2'}
            }, {'entry': {'tag': 'test2', 'id': 'fcb92659-1f10-41b4-9b17-851b72a3b597'}}, {
                'entry': {'tag': 'test3', 'id': 'fb4213c0-729d-466c-9a6c-ee2e937273bf'}
            }]
        }
    };

    let component: any;
    let fixture: ComponentFixture<TagNodeListComponent>;
    let debug: DebugElement;
    let element: HTMLElement;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                MaterialModule,
                CoreModule.forRoot(),
                AppConfigModule.forRoot('app.config.json', {
                    ecmHost: 'http://localhost:9876/ecm'
                })
            ],
            declarations: [
                TagNodeListComponent
            ],
            providers: [
                TagService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TagNodeListComponent);

        debug = fixture.debugElement;
        element = fixture.nativeElement;
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    describe('Rendering tests', () => {

        beforeEach(() => {
            jasmine.Ajax.install();
        });

        afterEach(() => {
            jasmine.Ajax.uninstall();
        });

        it('Tag list relative a single node should be rendered', (done) => {
            component.nodeId = 'fake-node-id';

            component.results.subscribe(() => {
                fixture.detectChanges();

                expect(element.querySelector('#tag_name_0').innerHTML).toBe('test1');
                expect(element.querySelector('#tag_name_1').innerHTML).toBe('test2');
                expect(element.querySelector('#tag_name_2').innerHTML).toBe('test3');

                expect(element.querySelector('#tag_delete_0')).not.toBe(null);
                expect(element.querySelector('#tag_delete_1')).not.toBe(null);
                expect(element.querySelector('#tag_delete_2')).not.toBe(null);

                done();
            });

            component.ngOnChanges();

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: dataTag
            });
        });

        it('Tag list click on delete button should delete the tag', (done) => {
            component.nodeId = 'fake-node-id';

            component.results.subscribe(() => {
                fixture.detectChanges();

                let deleteButton: any = element.querySelector('#tag_delete_0');
                deleteButton.click();

                expect(jasmine.Ajax.requests.mostRecent().url).
                toContain('0ee933fa-57fc-4587-8a77-b787e814f1d2');
                expect(jasmine.Ajax.requests.mostRecent().method).toBe('DELETE');

                jasmine.Ajax.requests.mostRecent().respondWith({
                    status: 200,
                    contentType: 'json'
                });

                done();
            });

            component.ngOnChanges();

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: dataTag
            });
        });
    });
});
