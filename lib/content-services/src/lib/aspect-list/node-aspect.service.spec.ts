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
import { TranslateModule } from '@ngx-translate/core';
import { AlfrescoApiService, NodesApiService, setupTestBed } from 'core';
import { of } from 'rxjs';
import { ContentTestingModule } from '../testing/content.testing.module';
import { AspectListService } from './aspect-list.service';
import { NodeAspectService } from './node-aspect.service';

describe('NodeAspectService', () => {

    let aspectListService: AspectListService;
    let nodeAspectService: NodeAspectService;
    let nodeApiService: NodesApiService;
    let alfrescoApiService: AlfrescoApiService;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ContentTestingModule
        ]
    });

    beforeEach(() => {
        aspectListService = TestBed.inject(AspectListService);
        nodeAspectService = TestBed.inject(NodeAspectService);
        nodeApiService = TestBed.inject(NodesApiService);
        alfrescoApiService = TestBed.inject(AlfrescoApiService);
    });

    it('should open the aspect list dialog', () => {
        spyOn(aspectListService, 'openAspectListDialog').and.stub();
        nodeAspectService.updateNodeAspects('fake-node-id');
        expect(aspectListService.openAspectListDialog).toHaveBeenCalledWith('fake-node-id');
    });

    it('should update the node when the aspect dialog apply the changes', () => {
        const expectedParameters = { aspectNames: ['a', 'b', 'c'] };
        spyOn(aspectListService, 'openAspectListDialog').and.returnValue(of(['a', 'b', 'c']));
        spyOn(nodeApiService, 'updateNode').and.stub();
        nodeAspectService.updateNodeAspects('fake-node-id');
        expect(nodeApiService.updateNode).toHaveBeenCalledWith('fake-node-id', expectedParameters);
    });

    it('should send and update node event once the node has been updated', (done) => {
        alfrescoApiService.nodeUpdated.subscribe((nodeUpdated) => {
            expect(nodeUpdated.id).toBe('fake-node-id');
            expect(nodeUpdated.aspectNames).toBe(['a', 'b', 'c']);
            done();
        });
        const fakeNode = { id: 'fake-node-id', aspectNames: ['a', 'b', 'c'] };
        spyOn(aspectListService, 'openAspectListDialog').and.returnValue(of(['a', 'b', 'c']));
        spyOn(nodeApiService, 'updateNode').and.returnValue(of(fakeNode));
        nodeAspectService.updateNodeAspects('fake-node-id');
    });

});
