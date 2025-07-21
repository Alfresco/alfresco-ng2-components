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
import { RedirectAuthService } from '@alfresco/adf-core';
import { EMPTY, firstValueFrom, of } from 'rxjs';
import { JobIdBodyEntry, SizeDetails, SizeDetailsEntry } from '@alfresco/js-api';
import { NodesApiService } from './nodes-api.service';
import { AlfrescoApiService } from '../../services/alfresco-api.service';
import { AlfrescoApiServiceMock } from '../../mock/alfresco-api.service.mock';

const fakeInitiateFolderSizeResponse: JobIdBodyEntry = {
    entry: {
        jobId: 'fake-job-id'
    }
};

const fakeFolderSizeResponse: SizeDetailsEntry = {
    entry: {
        jobId: 'fake-job-id',
        calculatedAt: new Date().toString(),
        sizeInBytes: '1234',
        numberOfFiles: 1,
        status: SizeDetails.StatusEnum.COMPLETE,
        id: 'fake-id'
    }
};

describe('NodesApiService', () => {
    let nodesApiService: NodesApiService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                NodesApiService,
                { provide: AlfrescoApiService, useClass: AlfrescoApiServiceMock },
                { provide: RedirectAuthService, useValue: { onLogin: EMPTY, onTokenReceived: of(), init: () => {} } }
            ]
        });

        nodesApiService = TestBed.inject(NodesApiService);
    });

    it('should call initiateFolderSizeCalculation api with nodeId parameter', async () => {
        spyOn(nodesApiService.nodesApi, 'initiateFolderSizeCalculation').and.returnValue(Promise.resolve(fakeInitiateFolderSizeResponse));
        await firstValueFrom(nodesApiService.initiateFolderSizeCalculation('fake-node-id'));

        expect(nodesApiService.nodesApi.initiateFolderSizeCalculation).toHaveBeenCalledWith('fake-node-id');
    });

    it('should call getFolderSizeInfo api with nodeId and jobId parameter', async () => {
        spyOn(nodesApiService.nodesApi, 'getFolderSizeInfo').and.returnValue(Promise.resolve(fakeFolderSizeResponse));
        await firstValueFrom(nodesApiService.getFolderSizeInfo('fake-node-id', 'fake-job-id'));

        expect(nodesApiService.nodesApi.getFolderSizeInfo).toHaveBeenCalledWith('fake-node-id', 'fake-job-id');
    });
});
