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
import { fakeRendition, fakeRenditionCreated, fakeRenditionsList, fakeRenditionsListWithACreated } from '../mock/renditionsService.mock';
import { RenditionsService } from './renditions.service';
import { setupTestBed } from '../testing/setupTestBed';
import { CoreModule } from '../core.module';
import { AlfrescoApiService } from './alfresco-api.service';
import { AlfrescoApiServiceMock } from '../mock/alfresco-api.service.mock';
import { RenditionEntry } from '@alfresco/js-api';

declare let jasmine: any;

describe('RenditionsService', () => {
    let service: RenditionsService;

    setupTestBed({
        imports: [
            CoreModule.forRoot()
        ],
        providers: [
            { provide: AlfrescoApiService, useClass: AlfrescoApiServiceMock }
        ]
    });

    beforeEach(() => {
        jasmine.Ajax.install();
        service = TestBed.get(RenditionsService);
    });

    afterEach(() => {
        jasmine.Ajax.uninstall();
    });

    it('Should return the image rendition for the file if no rendition is already available', (done) => {
        service.getAvailableRenditionForNode('fake-node-id').subscribe((res: RenditionEntry) => {
            expect(res.entry.status).toBe('NOT_CREATED');
            expect(res.entry.id).toBe('imgpreview');
            done();
        });

        jasmine.Ajax.requests.mostRecent().respondWith({
            'status': 200,
            contentType: 'application/json',
            responseText: JSON.stringify(fakeRenditionsList)
        });
    });

    it('Should return the available rendition for the file', (done) => {
        service.getAvailableRenditionForNode('fake-node-id').subscribe((res: RenditionEntry) => {
            expect(res.entry.status).toBe('CREATED');
            expect(res.entry.id).toBe('pdf');
            done();
        });

        jasmine.Ajax.requests.mostRecent().respondWith({
            'status': 200,
            contentType: 'application/json',
            responseText: JSON.stringify(fakeRenditionsListWithACreated)
        });
    });

    it('Get rendition list service should return the list', (done) => {
        service.getRenditionsListByNodeId('fake-node-id').subscribe((res) => {
            expect(res.list.entries[0].entry.id).toBe('avatar');
            done();
        });

        jasmine.Ajax.requests.mostRecent().respondWith({
            'status': 200,
            contentType: 'application/json',
            responseText: JSON.stringify(fakeRenditionsList)
        });
    });

    it('Create rendition service should call the server with the ID passed and the asked encoding', (done) => {
        service.createRendition('fake-node-id', 'pdf').subscribe(() => {
            expect(jasmine.Ajax.requests.mostRecent().method).toBe('POST');
            expect(jasmine.Ajax.requests.mostRecent().url).toContain('/ecm/alfresco/api/-default-/public/alfresco/versions/1/nodes/fake-node-id/renditions');
            done();
        });

        jasmine.Ajax.requests.mostRecent().respondWith({
            'status': 200,
            contentType: 'application/json',
            responseText: ''
        });
    });

    describe('convert', () => {

        it('should call the server with the ID passed and the asked encoding for creation', (done) => {
            service.convert('fake-node-id', 'pdf', 1000);

            expect(jasmine.Ajax.requests.mostRecent().method).toBe('POST');
            expect(jasmine.Ajax.requests.mostRecent().url).toContain('/ecm/alfresco/api/-default-/public/alfresco/versions/1/nodes/fake-node-id/renditions');
            done();
        });
    });

    it('Get rendition service should catch the error', (done) => {
        service.getRenditionsListByNodeId('fake-node-id').subscribe(() => {
            }, () => {
                done();
            }
        );

        jasmine.Ajax.requests.mostRecent().respondWith({
            'status': 403,
            contentType: 'application/json',
            responseText: 'error'
        });
    });

    it('isConversionPossible should return true if is possible convert', (done) => {
        service.isConversionPossible('fake-node-id', 'pdf').subscribe((res) => {
            expect(res).toBe(true);
            done();
        });

        jasmine.Ajax.requests.mostRecent().respondWith({
            'status': 200,
            contentType: 'application/json',
            responseText: JSON.stringify(fakeRendition)
        });
    });

    it('isConversionPossible should return false if is not possible to convert', (done) => {
        service.isConversionPossible('fake-node-id', 'pdf').subscribe((res) => {
            expect(res).toBe(false);
            done();
        });

        jasmine.Ajax.requests.mostRecent().respondWith({
            'status': 403,
            contentType: 'application/json'
        });
    });

    it('isRenditionsAvailable should return true if the conversion exist', (done) => {
        service.isRenditionAvailable('fake-node-id', 'pdf').subscribe((res) => {
            expect(res).toBe(true);
            done();
        });

        jasmine.Ajax.requests.mostRecent().respondWith({
            'status': 200,
            contentType: 'application/json',
            responseText: JSON.stringify(fakeRenditionCreated)
        });
    });

    it('isRenditionsAvailable should return false if the conversion not exist', (done) => {
        service.isRenditionAvailable('fake-node-id', 'pdf').subscribe((res) => {
            expect(res).toBe(false);
            done();
        });

        jasmine.Ajax.requests.mostRecent().respondWith({
            'status': 200,
            contentType: 'application/json',
            responseText: JSON.stringify(fakeRendition)
        });
    });

    it('isRenditionsAvailable should return false if the conversion get error', (done) => {
        service.isRenditionAvailable('fake-node-id', 'pdf').subscribe((res) => {
            expect(res).toBe(false);
            done();
        });

        jasmine.Ajax.requests.mostRecent().respondWith({
            'status': 400,
            contentType: 'application/json'
        });
    });
});
