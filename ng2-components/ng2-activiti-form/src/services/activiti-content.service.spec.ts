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
import { CoreModule } from 'ng2-alfresco-core';
import { ActivitiContentService } from './activiti-content-service';

declare let jasmine: any;

describe('ActivitiContentService', () => {

    let service: ActivitiContentService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule.forRoot()
            ],
            providers: [
                ActivitiContentService
            ]
        });
        service = TestBed.get(ActivitiContentService);
    });

    beforeEach(() => {
        jasmine.Ajax.install();
    });

    afterEach(() => {
        jasmine.Ajax.uninstall();
    });

    it('Should fetch the attachements', (done) => {
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
});
