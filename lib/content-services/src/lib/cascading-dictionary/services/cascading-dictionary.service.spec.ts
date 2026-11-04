/*!
 * @license
 * Copyright © 2005-2026 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import {
    CascadingDictionaryBodyCreate,
    CascadingDictionaryContentBody,
    CascadingDictionaryCreateEntry,
    CascadingDictionaryEntry,
    CascadingDictionaryList,
    CascadingDictionaryUpdateEntry
} from '@alfresco/js-api';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { CascadingDictionaryService } from './cascading-dictionary.service';

describe('CascadingDictionaryService', () => {
    let cascadingDictionaryService: CascadingDictionaryService;

    const fakeAspectId = 'cdict:account';
    const fakeVersionId = '1.0';

    const fakeListResponse: CascadingDictionaryList = { list: { pagination: {}, entries: [] } };
    const fakeDictionaryEntry: CascadingDictionaryEntry = {
        entry: {
            name: 'Accounts',
            aspect: fakeAspectId,
            keyProperty: 'cdict:accountNumber',
            versionProperty: 'cdict:accountDictVersion',
            version: '1.0',
            levels: [],
            createdAt: new Date(),
            modifiedAt: new Date()
        }
    };
    const fakeCreateEntry: CascadingDictionaryCreateEntry = { entry: { createdAt: new Date() } };
    const fakeUpdateEntry: CascadingDictionaryUpdateEntry = { entry: { modifiedAt: new Date() } };

    const fakeBodyCreate: CascadingDictionaryBodyCreate = {
        name: 'Accounts',
        aspect: fakeAspectId,
        keyProperty: 'cdict:accountNumber',
        versionProperty: 'cdict:accountDictVersion'
    };
    const fakeContentBody: CascadingDictionaryContentBody = {
        definition: { levels: [{ level: 0, properties: ['cdict:accountNumber'] }] },
        data: [{ properties: { 'cdict:accountNumber': 1000 } }]
    };

    beforeEach(() => {
        cascadingDictionaryService = TestBed.inject(CascadingDictionaryService);
    });

    it('should list cascading dictionaries with the provided paging', async () => {
        const listSpy = spyOn(cascadingDictionaryService.cascadingDictionariesApi, 'listCascadingDictionaries').and.returnValue(
            Promise.resolve(fakeListResponse)
        );

        await firstValueFrom(cascadingDictionaryService.listCascadingDictionaries(0, 100));

        expect(listSpy).toHaveBeenCalledOnceWith({ skipCount: 0, maxItems: 100 });
    });

    it('should fetch the cascading dictionary without data by default', async () => {
        const getSpy = spyOn(cascadingDictionaryService.cascadingDictionariesApi, 'getCascadingDictionary').and.returnValue(
            Promise.resolve(fakeDictionaryEntry)
        );

        await firstValueFrom(cascadingDictionaryService.getCascadingDictionary(fakeAspectId));

        expect(getSpy).toHaveBeenCalledOnceWith(fakeAspectId, undefined);
    });

    it('should request the data when includeData is set', async () => {
        const getSpy = spyOn(cascadingDictionaryService.cascadingDictionariesApi, 'getCascadingDictionary').and.returnValue(
            Promise.resolve(fakeDictionaryEntry)
        );

        await firstValueFrom(cascadingDictionaryService.getCascadingDictionary(fakeAspectId, true));

        expect(getSpy).toHaveBeenCalledOnceWith(fakeAspectId, { include: ['data'] });
    });

    it('should fetch a specific version of the cascading dictionary', async () => {
        const getSpy = spyOn(cascadingDictionaryService.cascadingDictionariesApi, 'getCascadingDictionaryVersion').and.returnValue(
            Promise.resolve(fakeDictionaryEntry)
        );

        await firstValueFrom(cascadingDictionaryService.getCascadingDictionaryVersion(fakeAspectId, fakeVersionId, true));

        expect(getSpy).toHaveBeenCalledOnceWith(fakeAspectId, fakeVersionId, { include: ['data'] });
    });

    it('should create the cascading dictionary with the provided payload', async () => {
        const createSpy = spyOn(cascadingDictionaryService.cascadingDictionariesApi, 'createCascadingDictionary').and.returnValue(
            Promise.resolve(fakeCreateEntry)
        );

        await firstValueFrom(cascadingDictionaryService.createCascadingDictionary(fakeBodyCreate));

        expect(createSpy).toHaveBeenCalledOnceWith(fakeBodyCreate);
    });

    it('should update the cascading dictionary name', async () => {
        const updateSpy = spyOn(cascadingDictionaryService.cascadingDictionariesApi, 'updateCascadingDictionary').and.returnValue(
            Promise.resolve(fakeUpdateEntry)
        );

        await firstValueFrom(cascadingDictionaryService.updateCascadingDictionary(fakeAspectId, { name: 'Chart of Accounts' }));

        expect(updateSpy).toHaveBeenCalledOnceWith(fakeAspectId, { name: 'Chart of Accounts' });
    });

    it('should upload content as a minor version by default', async () => {
        const contentSpy = spyOn(cascadingDictionaryService.cascadingDictionariesApi, 'createCascadingDictionaryContent').and.returnValue(
            Promise.resolve(fakeDictionaryEntry)
        );

        await firstValueFrom(cascadingDictionaryService.createCascadingDictionaryContent(fakeAspectId, fakeContentBody));

        expect(contentSpy).toHaveBeenCalledOnceWith(fakeAspectId, fakeContentBody, { majorVersion: false });
    });

    it('should upload content as a major version when requested', async () => {
        const contentSpy = spyOn(cascadingDictionaryService.cascadingDictionariesApi, 'createCascadingDictionaryContent').and.returnValue(
            Promise.resolve(fakeDictionaryEntry)
        );

        await firstValueFrom(cascadingDictionaryService.createCascadingDictionaryContent(fakeAspectId, fakeContentBody, true));

        expect(contentSpy).toHaveBeenCalledOnceWith(fakeAspectId, fakeContentBody, { majorVersion: true });
    });

    it('should delete the cascading dictionary', async () => {
        const deleteSpy = spyOn(cascadingDictionaryService.cascadingDictionariesApi, 'deleteCascadingDictionary').and.returnValue(Promise.resolve());

        await firstValueFrom(cascadingDictionaryService.deleteCascadingDictionary(fakeAspectId));

        expect(deleteSpy).toHaveBeenCalledOnceWith(fakeAspectId);
    });
});
