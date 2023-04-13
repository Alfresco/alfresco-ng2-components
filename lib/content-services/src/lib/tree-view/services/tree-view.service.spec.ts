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

import { setupTestBed } from '@alfresco/adf-core';
import { NodesApiService } from '../../common/services/nodes-api.service';
import { TreeViewService } from './tree-view.service';
import { TestBed } from '@angular/core/testing';
import { ContentTestingModule } from '../../testing/content.testing.module';
import { of } from 'rxjs';
import { TreeBaseNode } from '../models/tree-view.model';
import { TranslateModule } from '@ngx-translate/core';
import { NodePaging } from '@alfresco/js-api';

describe('TreeViewService', () => {

    let service: TreeViewService;
    let nodeService: NodesApiService;

    const fakeNodeList = new NodePaging({ list: { entries: [
            { entry: { id: 'fake-node-id', name: 'fake-node-name', isFolder: true } }
        ] } });

    const fakeMixedNodeList = new NodePaging({ list: { entries: [
        { entry: { id: 'fake-node-id', name: 'fake-node-name', isFolder: true } },
        { entry: { id: 'fake-file-id', name: 'fake-file-name', isFolder: false } }
    ] } });

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ContentTestingModule
        ]
    });

    beforeEach(() => {
        service = TestBed.inject(TreeViewService);
        nodeService = TestBed.inject(NodesApiService);
    });

    it('should returns TreeBaseNode elements', (done) => {
        spyOn(nodeService, 'getNodeChildren').and.returnValue(of(fakeNodeList));
        service.getTreeNodes('fake-node-id').subscribe((nodes: TreeBaseNode[]) => {
            expect(nodes.length).toBe(1);
            expect(nodes[0].nodeId).toBe('fake-node-id');
            expect(nodes[0].name).toBe('fake-node-name');
            done();
        });
    });

    it('should returns only folders elements', (done) => {
        spyOn(nodeService, 'getNodeChildren').and.returnValue(of(fakeMixedNodeList));
        service.getTreeNodes('fake-node-id').subscribe((nodes: TreeBaseNode[]) => {
            expect(nodes.length).toBe(1);
            expect(nodes[0].nodeId).toBe('fake-node-id');
            expect(nodes[0].name).toBe('fake-node-name');
            done();
        });
    });
});
