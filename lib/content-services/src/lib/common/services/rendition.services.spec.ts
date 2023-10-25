/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { AlfrescoApiService, LogService, TranslationService, ViewUtilService } from '@alfresco/adf-core';
import { Rendition, RenditionEntry, RenditionPaging, RenditionsApi } from '@alfresco/js-api';
import { RenditionService } from '@alfresco/adf-content-services';

const getRenditionEntry = (status: Rendition.StatusEnum): RenditionEntry => ({
    entry: {
        id: 'pdf',
        status,
        content: { mimeType: 'application/pdf', mimeTypeName: 'application/pdf', sizeInBytes: 10 }
    }
});

const getRenditionPaging = (status: Rendition.StatusEnum): RenditionPaging =>  ({
    list: {
        entries: [getRenditionEntry(status)]
    }
});

describe('RenditionService', () => {
    let renditionService: RenditionService;
    let renditionsApi: any;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                RenditionService,
                { provide: AlfrescoApiService, useValue: {} },
                { provide: LogService, useValue: { error: jasmine.createSpy('error') } },
                { provide: TranslationService, useValue: {} },
                { provide: ViewUtilService, useValue: {} },
                { provide: RenditionsApi, useValue: {
                        listRenditions: jasmine.createSpy('listRenditions'),
                        getRendition: jasmine.createSpy('getRendition'),
                        createRendition: jasmine.createSpy('createRendition')
                    } }
            ]
        });
        renditionService = TestBed.inject(RenditionService);
        renditionsApi = TestBed.inject(RenditionsApi);
        spyOnProperty(renditionService, 'renditionsApi').and.returnValue(renditionsApi);
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

});
