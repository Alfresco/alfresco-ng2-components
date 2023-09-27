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
import { RenditionEntry, RenditionPaging, RenditionsApi } from '@alfresco/js-api';
import { RenditionService } from '@alfresco/adf-content-services';

const getRenditionEntry = (status: 'NOT_CREATED' | 'CREATED'): RenditionEntry => {
    return {
        entry: {
            id: 'pdf',
            status: status,
            content: { mimeType: 'application/pdf', mimeTypeName: 'application/pdf', sizeInBytes: 10 }
        }
    };
};
const getRenditionPaging = (status: 'NOT_CREATED' | 'CREATED'): RenditionPaging =>  {
    return {
        list: {
            entries: [getRenditionEntry(status)]
        }
    };
};
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
        // eslint-disable-next-line no-underscore-dangle
        renditionService._renditionsApi = renditionsApi;
    });

    describe('getRendition', () => {
        it('should retry getting the rendition until maxRetries if status is NOT_CREATED', async () => {
            const mockRenditionPaging: RenditionPaging = getRenditionPaging('NOT_CREATED');
            const mockRenditionEntry: RenditionEntry = getRenditionEntry('NOT_CREATED');

            renditionsApi.listRenditions.and.returnValue(Promise.resolve(mockRenditionPaging));
            renditionsApi.getRendition.and.returnValue(Promise.resolve(mockRenditionEntry));

            await renditionService.getRendition('nodeId', 'pdf');
            expect(renditionsApi.getRendition).toHaveBeenCalledTimes(renditionService.maxRetries);
        }, 10000);
    });

    it('should return the rendition when status transitions from PENDING to CREATED', async () => {
        const mockRenditionPaging: RenditionPaging = getRenditionPaging('NOT_CREATED');
        const mockRenditionEntry: RenditionEntry = getRenditionEntry('CREATED');

        renditionsApi.listRenditions.and.returnValue(Promise.resolve(mockRenditionPaging));
        renditionsApi.getRendition.and.returnValues(
          Promise.resolve(getRenditionEntry('NOT_CREATED')),
          Promise.resolve(getRenditionEntry('NOT_CREATED')),
          Promise.resolve(mockRenditionEntry)
        );

        const result = await renditionService.getRendition('nodeId', 'pdf');

        expect(result).toEqual(mockRenditionEntry);
        expect(renditionsApi.getRendition).toHaveBeenCalledTimes(3);
    });

    it('should return the rendition when status is CREATED on the first run', async () => {
        const mockRenditionPaging: RenditionPaging = getRenditionPaging('CREATED');

        renditionsApi.listRenditions.and.returnValue(Promise.resolve(mockRenditionPaging));

        const result = await renditionService.getRendition('nodeId', 'pdf');

        expect(result).toEqual(mockRenditionPaging.list.entries[0]);
        expect(renditionsApi.getRendition).not.toHaveBeenCalled();
    });

});
