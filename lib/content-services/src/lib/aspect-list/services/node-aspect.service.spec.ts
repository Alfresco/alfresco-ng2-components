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

import { MinimalNode } from '@alfresco/js-api';
import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { AlfrescoApiService, CardViewUpdateService, NodesApiService, setupTestBed } from '@alfresco/adf-core';
import { of } from 'rxjs';
import { ContentTestingModule } from '../../testing/content.testing.module';
import { NodeAspectService } from './node-aspect.service';
import { DialogAspectListService } from './dialog-aspect-list.service';

describe('NodeAspectService', () => {

    let dialogAspectListService: DialogAspectListService;
    let nodeAspectService: NodeAspectService;
    let nodeApiService: NodesApiService;
    let alfrescoApiService: AlfrescoApiService;
    let cardViewUpdateService: CardViewUpdateService;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ContentTestingModule
        ]
    });

    beforeEach(() => {
        dialogAspectListService = TestBed.inject(DialogAspectListService);
        nodeAspectService = TestBed.inject(NodeAspectService);
        nodeApiService = TestBed.inject(NodesApiService);
        alfrescoApiService = TestBed.inject(AlfrescoApiService);
        cardViewUpdateService = TestBed.inject(CardViewUpdateService);
    });

    it('should open the aspect list dialog', () => {
        spyOn(dialogAspectListService, 'openAspectListDialog').and.returnValue(of([]));
        spyOn(nodeApiService, 'updateNode').and.returnValue(of(null));
        nodeAspectService.updateNodeAspects('fake-node-id');
        expect(dialogAspectListService.openAspectListDialog).toHaveBeenCalledWith('fake-node-id');
    });

    it('should update the node when the aspect dialog apply the changes', () => {
        const expectedParameters = { aspectNames: ['a', 'b', 'c'] };
        spyOn(dialogAspectListService, 'openAspectListDialog').and.returnValue(of(['a', 'b', 'c']));
        spyOn(nodeApiService, 'updateNode').and.returnValue(of(null));
        nodeAspectService.updateNodeAspects('fake-node-id');
        expect(nodeApiService.updateNode).toHaveBeenCalledWith('fake-node-id', expectedParameters);
    });

    it('should send and update node event once the node has been updated', async () => {
        await alfrescoApiService.nodeUpdated.subscribe((nodeUpdated) => {
            expect(nodeUpdated.id).toBe('fake-node-id');
            expect(nodeUpdated.aspectNames).toEqual(['a', 'b', 'c']);
        });
        const fakeNode = new MinimalNode({ id: 'fake-node-id', aspectNames: ['a', 'b', 'c'] });
        spyOn(dialogAspectListService, 'openAspectListDialog').and.returnValue(of(['a', 'b', 'c']));
        spyOn(nodeApiService, 'updateNode').and.returnValue(of(fakeNode));
        nodeAspectService.updateNodeAspects('fake-node-id');
    });

    it('should send and update node aspect once the node has been updated', async () => {
        await cardViewUpdateService.updatedAspect$.subscribe((nodeUpdated) => {
            expect(nodeUpdated.id).toBe('fake-node-id');
            expect(nodeUpdated.aspectNames).toEqual(['a', 'b', 'c']);
        });
        const fakeNode = new MinimalNode({ id: 'fake-node-id', aspectNames: ['a', 'b', 'c'] });
        spyOn(dialogAspectListService, 'openAspectListDialog').and.returnValue(of(['a', 'b', 'c']));
        spyOn(nodeApiService, 'updateNode').and.returnValue(of(fakeNode));
        nodeAspectService.updateNodeAspects('fake-node-id');
    });

});
