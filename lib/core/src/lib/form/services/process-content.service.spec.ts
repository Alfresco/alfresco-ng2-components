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
import { of } from 'rxjs';
import { ProcessContentService } from './process-content.service';
import { setupTestBed } from '../../testing/setupTestBed';
import { CoreModule } from '../../core.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AlfrescoApiService } from '../../services/alfresco-api.service';
import { AlfrescoApiServiceMock } from '../../mock/alfresco-api.service.mock';

declare let jasmine: any;

const fileContentPdfResponseBody = {
    id: 999,
    name: 'fake-name.pdf',
    created: '2017-01-23T12:12:53.219+0000',
    createdBy: { id: 2, firstName: 'fake-admin', lastName: 'fake-last', 'email': 'fake-admin' },
    relatedContent: false,
    contentAvailable: true,
    link: false,
    mimeType: 'application/pdf',
    simpleType: 'pdf',
    previewStatus: 'created',
    thumbnailStatus: 'created'
};

const fileContentJpgResponseBody = {
    id: 888,
    name: 'fake-name.jpg',
    created: '2017-01-23T12:12:53.219+0000',
    createdBy: { id: 2, firstName: 'fake-admin', lastName: 'fake-last', 'email': 'fake-admin' },
    relatedContent: false,
    contentAvailable: true,
    link: false,
    mimeType: 'image/jpeg',
    simpleType: 'image',
    previewStatus: 'unsupported',
    thumbnailStatus: 'unsupported'
};

function createFakeBlob() {
    const data = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

    const bytes = new Uint8Array(data.length / 2);

    for (let i = 0; i < data.length; i += 2) {
        bytes[i / 2] = parseInt(data.substring(i, i + 2), /* base = */ 16);
    }
    return new Blob([bytes], { type: 'image/png' });
}

describe('ProcessContentService', () => {

    let service: ProcessContentService;

    setupTestBed({
        imports: [
            NoopAnimationsModule,
            CoreModule.forRoot()
        ],
        providers: [
            { provide: AlfrescoApiService, useClass: AlfrescoApiServiceMock }
        ]
    });

    beforeEach(() => {
        service = TestBed.get(ProcessContentService);
    });

    beforeEach(() => {
        jasmine.Ajax.install();
    });

    afterEach(() => {
        jasmine.Ajax.uninstall();
    });

    it('Should fetch the attachments', (done) => {
        service.getTaskRelatedContent('1234').subscribe((res) => {
            expect(res.data).toBeDefined();
            expect(res.data.length).toBe(2);
            expect(res.data[0].name).toBe('fake.zip');
            expect(res.data[0].mimeType).toBe('application/zip');
            expect(res.data[0].relatedContent).toBeTruthy();
            expect(res.data[1].name).toBe('fake.jpg');
            expect(res.data[1].mimeType).toBe('image/jpeg');
            expect(res.data[1].relatedContent).toBeTruthy();
            done();
        });

        jasmine.Ajax.requests.mostRecent().respondWith({
            'status': 200,
            contentType: 'application/json',
            responseText: JSON.stringify({
                size: 2,
                total: 2,
                start: 0,
                data: [
                    {
                        id: 8,
                        name: 'fake.zip',
                        created: 1494595697381,
                        createdBy: {id: 2, firstName: 'user', lastName: 'user', email: 'user@user.com'},
                        relatedContent: true,
                        contentAvailable: true,
                        link: false,
                        mimeType: 'application/zip',
                        simpleType: 'content',
                        previewStatus: 'unsupported',
                        thumbnailStatus: 'unsupported'
                    },
                    {
                        id: 9,
                        name: 'fake.jpg',
                        created: 1494595655381,
                        createdBy: {id: 2, firstName: 'user', lastName: 'user', email: 'user@user.com'},
                        relatedContent: true,
                        contentAvailable: true,
                        link: false,
                        mimeType: 'image/jpeg',
                        simpleType: 'image',
                        previewStatus: 'unsupported',
                        thumbnailStatus: 'unsupported'
                    }
                ]
            })
        });
    });

    it('should return the unsupported content when the file is an image', (done) => {
        const contentId: number = 888;

        service.getFileContent(contentId).subscribe((result) => {
            expect(result.id).toEqual(contentId);
            expect(result.name).toEqual('fake-name.jpg');
            expect(result.simpleType).toEqual('image');
            expect(result.thumbnailStatus).toEqual('unsupported');
            done();
        });

        jasmine.Ajax.requests.mostRecent().respondWith({
            'status': 200,
            contentType: 'application/json',
            responseText: JSON.stringify(fileContentJpgResponseBody)
        });
    });

    it('should return the supported content when the file is a pdf', (done) => {
        const contentId: number = 999;

        service.getFileContent(contentId).subscribe((result) => {
            expect(result.id).toEqual(contentId);
            expect(result.name).toEqual('fake-name.pdf');
            expect(result.simpleType).toEqual('pdf');
            expect(result.thumbnailStatus).toEqual('created');
            done();
        });

        jasmine.Ajax.requests.mostRecent().respondWith({
            'status': 200,
            contentType: 'application/json',
            responseText: JSON.stringify(fileContentPdfResponseBody)
        });
    });

    it('should return the raw content URL', () => {
        const contentId: number = 999;
        const contentUrl = service.getFileRawContentUrl(contentId);
        expect(contentUrl).toContain(`/api/enterprise/content/${contentId}/raw`);
    });

    it('should return a Blob as thumbnail', (done) => {
        const contentId: number = 999;
        const blob = createFakeBlob();
        spyOn(service, 'getContentThumbnail').and.returnValue(of(blob));
        service.getContentThumbnail(contentId).subscribe((result) => {
            expect(result).toEqual(jasmine.any(Blob));
            expect(result.size).toEqual(48);
            expect(result.type).toEqual('image/png');
            done();
        });
    });
});
