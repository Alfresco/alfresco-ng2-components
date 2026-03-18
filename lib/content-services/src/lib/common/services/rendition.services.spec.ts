/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { TranslationService, ViewUtilService } from '@alfresco/adf-core';
import { ContentApi, Rendition, RenditionEntry, RenditionPaging, RenditionsApi, VersionsApi } from '@alfresco/js-api';
import { AlfrescoApiService } from '../../services/alfresco-api.service';
import { RenditionService } from './rendition.service';

const getRenditionEntry = (status: Rendition.StatusEnum): RenditionEntry => ({
    entry: {
        id: 'pdf',
        status,
        content: { mimeType: 'application/pdf', mimeTypeName: 'application/pdf', sizeInBytes: 10 }
    }
});

const getRenditionPaging = (status: Rendition.StatusEnum): RenditionPaging => ({
    list: {
        entries: [getRenditionEntry(status)]
    }
});

describe('RenditionService', () => {
    let renditionService: RenditionService;
    let renditionsApi: jasmine.SpyObj<RenditionsApi>;
    let versionsApiSpy: jasmine.SpyObj<VersionsApi>;
    let contentApiSpy: jasmine.SpyObj<ContentApi>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                RenditionService,
                { provide: AlfrescoApiService, useValue: {} },
                { provide: TranslationService, useValue: {} },
                { provide: ViewUtilService, useValue: {} },
                {
                    provide: RenditionsApi,
                    useValue: {
                        listRenditions: jasmine.createSpy('listRenditions'),
                        getRendition: jasmine.createSpy('getRendition'),
                        createRendition: jasmine.createSpy('createRendition')
                    }
                },
                {
                    provide: VersionsApi,
                    useValue: {
                        listVersionRenditions: jasmine.createSpy('listVersionRenditions'),
                        createVersionRendition: jasmine.createSpy('createVersionRendition').and.returnValue(Promise.resolve()),
                        getVersionRendition: jasmine.createSpy('getVersionRendition')
                    }
                },
                {
                    provide: ContentApi,
                    useValue: {
                        getVersionRenditionUrl: jasmine.createSpy('getVersionRenditionUrl').and.returnValue('version-rendition-url')
                    }
                }
            ]
        });
        renditionService = TestBed.inject(RenditionService);
        renditionsApi = TestBed.inject(RenditionsApi) as jasmine.SpyObj<RenditionsApi>;
        versionsApiSpy = TestBed.inject(VersionsApi) as jasmine.SpyObj<VersionsApi>;
        contentApiSpy = TestBed.inject(ContentApi) as jasmine.SpyObj<ContentApi>;
        spyOnProperty(renditionService, 'renditionsApi').and.returnValue(renditionsApi);
        spyOnProperty(renditionService, 'versionsApi').and.returnValue(versionsApiSpy);
        spyOnProperty(renditionService, 'contentApi').and.returnValue(contentApiSpy);
    });

    describe('getRendition', () => {
        it('should retry getting the rendition until maxRetries if status is NOT_CREATED', async () => {
            const mockRenditionPaging: RenditionPaging = getRenditionPaging(Rendition.StatusEnum.NOTCREATED);
            const mockRenditionEntry: RenditionEntry = getRenditionEntry(Rendition.StatusEnum.NOTCREATED);

            renditionsApi.listRenditions.and.returnValue(Promise.resolve(mockRenditionPaging));
            renditionsApi.getRendition.and.returnValue(Promise.resolve(mockRenditionEntry));

            await renditionService.getRendition('nodeId', 'pdf');
            expect(renditionsApi.getRendition).toHaveBeenCalledTimes(renditionService.maxRetries);
        }, 10000);
    });

    it('should return the rendition when status transitions from PENDING to CREATED', async () => {
        const mockRenditionPaging: RenditionPaging = getRenditionPaging(Rendition.StatusEnum.NOTCREATED);
        const mockRenditionEntry: RenditionEntry = getRenditionEntry(Rendition.StatusEnum.CREATED);

        renditionsApi.listRenditions.and.returnValue(Promise.resolve(mockRenditionPaging));
        renditionsApi.getRendition.and.returnValues(
            Promise.resolve(getRenditionEntry(Rendition.StatusEnum.NOTCREATED)),
            Promise.resolve(getRenditionEntry(Rendition.StatusEnum.NOTCREATED)),
            Promise.resolve(mockRenditionEntry)
        );

        const result = await renditionService.getRendition('nodeId', 'pdf');

        expect(result).toEqual(mockRenditionEntry);
        expect(renditionsApi.getRendition).toHaveBeenCalledTimes(3);
    });

    it('should return the rendition when status is CREATED on the first run', async () => {
        const mockRenditionPaging: RenditionPaging = getRenditionPaging(Rendition.StatusEnum.CREATED);

        renditionsApi.listRenditions.and.returnValue(Promise.resolve(mockRenditionPaging));

        const result = await renditionService.getRendition('nodeId', 'pdf');

        expect(result).toEqual(mockRenditionPaging.list.entries[0]);
        expect(renditionsApi.getRendition).not.toHaveBeenCalled();
    });

    it('should pass renditionId (not mimeType) to getVersionRenditionUrl when version rendition transitions to CREATED', async () => {
        const nodeId = 'nodeId';
        const versionId = 'versionId';
        const renditionId = 'pdf';
        const mimeType = 'application/pdf';

        versionsApiSpy.listVersionRenditions.and.returnValue(Promise.resolve(getRenditionPaging(Rendition.StatusEnum.NOTCREATED)));
        versionsApiSpy.getVersionRendition.and.returnValue(Promise.resolve(getRenditionEntry(Rendition.StatusEnum.CREATED)));

        const result = await renditionService.getNodeRendition(nodeId, versionId);

        expect(contentApiSpy.getVersionRenditionUrl).toHaveBeenCalledWith(nodeId, versionId, renditionId);
        expect(contentApiSpy.getVersionRenditionUrl).not.toHaveBeenCalledWith(nodeId, versionId, mimeType);
        expect(result.url).toBe('version-rendition-url');
    }, 10100);
});
