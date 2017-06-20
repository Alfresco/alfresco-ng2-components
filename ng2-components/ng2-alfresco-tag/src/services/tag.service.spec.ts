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

<<<<<<< HEAD
import { async, TestBed } from '@angular/core/testing';
import { AppConfigModule, CoreModule } from 'ng2-alfresco-core';
=======
import { TestBed, async } from '@angular/core/testing';
import { CoreModule } from 'ng2-alfresco-core';
>>>>>>> [ADF-847] upgrade to use application configuration service (#1986)
import { TagService } from '../services/tag.service';

declare let jasmine: any;

describe('TagService', () => {

    let service: TagService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
<<<<<<< HEAD
                CoreModule.forRoot(),
                AppConfigModule.forRoot('app.config.json', {
                    ecmHost: 'http://localhost:9876/ecm'
                })
=======
                CoreModule.forRoot()
>>>>>>> [ADF-847] upgrade to use application configuration service (#1986)
            ],
            providers: [
                TagService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        service = TestBed.get(TagService);
    });

    beforeEach(() => {
        jasmine.Ajax.install();
    });

    afterEach(() => {
        jasmine.Ajax.uninstall();
    });

    describe('Content tests', () => {

        it('removeTag should perform a call against the server', (done) => {
            service.removeTag('fake-node-id', 'fake-tag').subscribe(() => {
                expect(jasmine.Ajax.requests.mostRecent().method).toBe('DELETE');
                expect(jasmine.Ajax.requests.mostRecent().url)
<<<<<<< HEAD
                    .toBe('http://localhost:9876/ecm/alfresco/api/-default-/public/alfresco/versions/1/nodes/fake-node-id/tags/fake-tag');
=======
                    .toBe('http://localhost:3000/ecm/alfresco/api/-default-/public/alfresco/versions/1/nodes/fake-node-id/tags/fake-tag');
>>>>>>> [ADF-847] upgrade to use application configuration service (#1986)
                done();
            });

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200
            });
        });

        it('addTag should perform a call against the server', (done) => {
            service.addTag('fake-node-id', 'fake-tag').subscribe(() => {
                expect(jasmine.Ajax.requests.mostRecent().method).toBe('POST');
                expect(jasmine.Ajax.requests.mostRecent().url)
<<<<<<< HEAD
                    .toBe('http://localhost:9876/ecm/alfresco/api/-default-/public/alfresco/versions/1/nodes/fake-node-id/tags');
=======
                    .toBe('http://localhost:3000/ecm/alfresco/api/-default-/public/alfresco/versions/1/nodes/fake-node-id/tags');
>>>>>>> [ADF-847] upgrade to use application configuration service (#1986)
                done();
            });

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200
            });
        });

        it('getAllTheTags should perform a call against the server', (done) => {
            service.getAllTheTags().subscribe(() => {
                expect(jasmine.Ajax.requests.mostRecent().method).toBe('GET');
                expect(jasmine.Ajax.requests.mostRecent().url)
<<<<<<< HEAD
                    .toBe('http://localhost:9876/ecm/alfresco/api/-default-/public/alfresco/versions/1/tags');
=======
                    .toBe('http://localhost:3000/ecm/alfresco/api/-default-/public/alfresco/versions/1/tags');
>>>>>>> [ADF-847] upgrade to use application configuration service (#1986)
                done();
            });

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200
            });
        });

        it('getTagsByNodeId should perform a call against the server', (done) => {
            service.getTagsByNodeId('fake-node-id').subscribe(() => {
                expect(jasmine.Ajax.requests.mostRecent().method).toBe('GET');
                expect(jasmine.Ajax.requests.mostRecent().url)
<<<<<<< HEAD
                    .toBe('http://localhost:9876/ecm/alfresco/api/-default-/public/alfresco/versions/1/nodes/fake-node-id/tags');
=======
                    .toBe('http://localhost:3000/ecm/alfresco/api/-default-/public/alfresco/versions/1/nodes/fake-node-id/tags');
>>>>>>> [ADF-847] upgrade to use application configuration service (#1986)
                done();
            });

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200
            });
        });

        it('getTagsByNodeId catch errors call', (done) => {
            service.getTagsByNodeId('fake-node-id').subscribe(() => {
            }, () => {
                done();
            });

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 403
            });
        });

        it('delete tag should trigger a refresh event', (done) => {
            service.refresh.subscribe(() => {
                done();
            });

            service.removeTag('fake-node-id', 'fake-tag');

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200
            });
        });

        it('add tag should trigger a refresh event', (done) => {
            service.refresh.subscribe(() => {
                done();
            });

            service.addTag('fake-node-id', 'fake-tag');

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200
            });
        });
    });

});
