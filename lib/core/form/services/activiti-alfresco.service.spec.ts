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
import { ActivitiContentService } from './activiti-alfresco.service';
import { setupTestBed } from '../../testing/setupTestBed';
import { CoreModule } from '../../core.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AlfrescoApiService } from '../../services/alfresco-api.service';
import { AlfrescoApiServiceMock } from '../../mock/alfresco-api.service.mock';
import { MinimalNodeEntryEntity } from 'alfresco-js-api';
import { ExternalContent } from '../components/widgets/core/external-content';

declare let jasmine: any;

describe('ActivitiContentService', () => {

    let service: ActivitiContentService;

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
        service = TestBed.get(ActivitiContentService);
    });

    beforeEach(() => {
        jasmine.Ajax.install();
    });

    afterEach(() => {
        jasmine.Ajax.uninstall();
    });

    it('Should fetch node from content repository', (done) => {
        let responseBody = {
            data: [
                {
                    folder: true,
                    id: 'fake-folder-id',
                    simpleType: 'folder',
                    title: 'fake-folder'
                }
            ],
            size: 1,
            start: 0,
            total: 1
        };

        service.getAlfrescoNodes('alfresco-2', 'fake-node-id').subscribe(result => {
            expect(jasmine.Ajax.requests.mostRecent().url.endsWith('enterprise/integration/alfresco/2/folders/fake-node-id/content')).toBeTruthy();
            expect(result[0].id).toBe('fake-folder-id');
            expect(result[0].folder).toBeTruthy();
            done();
        });

        jasmine.Ajax.requests.mostRecent().respondWith({
            'status': 200,
            contentType: 'application/json',
            responseText: JSON.stringify(responseBody)
        });
    });

    it('Should fetch the repository list for the selected tenant', (done) => {
        const fakeRepositoryListAnswer = {
            data: [
                {
                    'authorized': true,
                    'serviceId': 'alfresco-9999-SHAREME',
                    'metaDataAllowed': true,
                    'name': 'SHAREME'
                },
                {
                    'authorized': true,
                    'serviceId': 'alfresco-0000-GOKUSHARE',
                    'metaDataAllowed': true,
                    'name': 'GOKUSHARE'
                }],
            size: 2,
            start: 0,
            total: 2
        };

        service.getAlfrescoRepositories(0, true).subscribe(result => {
            expect(jasmine.Ajax.requests.mostRecent().url.endsWith('enterprise/profile/accounts/alfresco?tenantId=0&includeAccounts=true')).toBeTruthy();
            expect(result[0].serviceId).toBe('alfresco-9999-SHAREME');
            expect(result[1].serviceId).toBe('alfresco-0000-GOKUSHARE');
            done();
        });

        jasmine.Ajax.requests.mostRecent().respondWith({
            'status': 200,
            contentType: 'application/json',
            responseText: JSON.stringify(fakeRepositoryListAnswer)
        });
    });

    it('Should be able to link an alfresco content', (done) => {
        const fakeContentCreated = {
            contentAvailable: true,
            created: '2018-05-18T09:01:02.614Z',
            createdBy: {
                company: 'fake-company',
                email: 'fake-email',
                externalId: 'fake-external-id',
                firstName: 'fake-first-name',
                id: 9999999,
                lastName: 'fake-last-name',
                pictureId: 999999
            },
            id: 999,
            link: true,
            linkUrl: 'fake-link-url',
            mimeType: 'fake-mimeType',
            name: 'fake-name',
            previewStatus: 'fake-previous-status',
            relatedContent: true,
            simpleType: 'fake-simple-type',
            source: 'fake-source',
            sourceId: 'fake-source-id',
            thumbnailStatus: 'fake-thumbnail-status'
        };

        const alfRepoAccountId = 'alfresco-2';
        const siteId = 'sample-workspace';
        const externalContentNode: ExternalContent = {
          id: 'da196918-1324-4e97-9d26-d28f1837a0b6',
          simpleType: 'content',
          title: 'simple.txt',
          folder: false
        };

        service.linkAlfrescoNode(alfRepoAccountId, externalContentNode, siteId).subscribe(result => {
            expect(jasmine.Ajax.requests.mostRecent().url.endsWith('api/enterprise/content')).toBeTruthy();
            expect(jasmine.Ajax.requests.mostRecent().data().name).toBe(externalContentNode.title);
            expect(jasmine.Ajax.requests.mostRecent().data().simpleType).toBe(externalContentNode.simpleType);
            expect(jasmine.Ajax.requests.mostRecent().data().link).toBeTruthy();
            expect(jasmine.Ajax.requests.mostRecent().data().sourceId).toBe(externalContentNode.id + '@' + siteId);
            expect(jasmine.Ajax.requests.mostRecent().data().source).toBe(alfRepoAccountId);
            expect(result.id).toBe(999);
            done();
        });

        jasmine.Ajax.requests.mostRecent().respondWith({
            'status': 200,
            contentType: 'application/json',
            response: JSON.stringify(fakeContentCreated)
        });
    });

    it('Should be able to upload an alfresco content with site id', (done) => {
        const fakeContentCreated = {
            contentAvailable: true,
            created: '2018-05-18T09:01:02.614Z',
            createdBy: {
                company: 'fake-company',
                email: 'fake-email',
                externalId: 'fake-external-id',
                firstName: 'fake-first-name',
                id: 9999999,
                lastName: 'fake-last-name',
                pictureId: 999999
            },
            id: 999,
            link: true,
            linkUrl: 'fake-link-url',
            mimeType: 'fake-mimeType',
            name: 'fake-name',
            previewStatus: 'fake-previous-status',
            relatedContent: true,
            simpleType: 'fake-simple-type',
            source: 'fake-source',
            sourceId: 'fake-source-id',
            thumbnailStatus: 'fake-thumbnail-status'
        };

        const alfRepoAccountId = 'alfresco-2';
        const siteId = 'sample-workspace';
        const minimalNode: MinimalNodeEntryEntity = {
          id: 'da196918-1324-4e97-9d26-d28f1837a0b6',
          name: 'fake-node-sample',
          isFolder: false,
          content: {
              mimeType: 'fake-mimeType'
          },
          properties: { ['cm:versionLabel']: '1.0' }
        };

        service.applyAlfrescoNode(minimalNode, siteId, alfRepoAccountId).subscribe(result => {
            expect(jasmine.Ajax.requests.mostRecent().url.endsWith('api/enterprise/content')).toBeTruthy();
            expect(jasmine.Ajax.requests.mostRecent().data().name).toBe(minimalNode.name);
            expect(jasmine.Ajax.requests.mostRecent().data().mimeType).toBe(minimalNode.content.mimeType);
            expect(jasmine.Ajax.requests.mostRecent().data().link).toBeFalsy();
            expect(jasmine.Ajax.requests.mostRecent().data().sourceId).toBe(minimalNode.id + ';' + minimalNode.properties['cm:versionLabel'] + '@' + siteId);
            expect(jasmine.Ajax.requests.mostRecent().data().source).toBe(alfRepoAccountId);
            expect(result.id).toBe(999);
            done();
        });

        jasmine.Ajax.requests.mostRecent().respondWith({
            'status': 200,
            contentType: 'application/json',
            response: JSON.stringify(fakeContentCreated)
        });
    });

    it('Should be able to upload an alfresco content retrieving the siteId from the node path', (done) => {
        const fakeContentCreated = {
            contentAvailable: true,
            created: '2018-05-18T09:01:02.614Z',
            createdBy: {
                company: 'fake-company',
                email: 'fake-email',
                externalId: 'fake-external-id',
                firstName: 'fake-first-name',
                id: 9999999,
                lastName: 'fake-last-name',
                pictureId: 999999
            },
            id: 999,
            link: true,
            linkUrl: 'fake-link-url',
            mimeType: 'fake-mimeType',
            name: 'fake-name',
            previewStatus: 'fake-previous-status',
            relatedContent: true,
            simpleType: 'fake-simple-type',
            source: 'fake-source',
            sourceId: 'fake-source-id',
            thumbnailStatus: 'fake-thumbnail-status'
        };

        const alfRepoAccountId = 'alfresco-2';
        const minimalNode: any = {
            id: 'da196918-1324-4e97-9d26-d28f1837a0b6',
            name: 'fake-node-sample',
            isFolder: false,
            path: {
                elements: [
                    { id: 'fake-parent-1', name: 'no-site', nodeType: 'cm:fake' },
                    { id: 'fake-parent-2', name: 'Sites', nodeType: 'st:site' },
                    { id: 'fake-parent-3', name: 'good-site', nodeType: 'st:site' }
                ]
            },
            content: {
                mimeType: 'fake-mimeType'
            },
            properties: { ['cm:versionLabel']: '1.0' }
        };

        service.applyAlfrescoNode(minimalNode, null, alfRepoAccountId).subscribe(result => {
            expect(jasmine.Ajax.requests.mostRecent().url.endsWith('api/enterprise/content')).toBeTruthy();
            expect(jasmine.Ajax.requests.mostRecent().data().name).toBe(minimalNode.name);
            expect(jasmine.Ajax.requests.mostRecent().data().mimeType).toBe(minimalNode.content.mimeType);
            expect(jasmine.Ajax.requests.mostRecent().data().link).toBeFalsy();
            expect(jasmine.Ajax.requests.mostRecent().data().sourceId).toBe(minimalNode.id + ';' + minimalNode.properties['cm:versionLabel'] + '@good-site');
            expect(jasmine.Ajax.requests.mostRecent().data().source).toBe(alfRepoAccountId);
            expect(result.id).toBe(999);
            done();
        });

        jasmine.Ajax.requests.mostRecent().respondWith({
            'status': 200,
            contentType: 'application/json',
            response: JSON.stringify(fakeContentCreated)
        });
    });

});
