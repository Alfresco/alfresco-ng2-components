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

import { Injectable } from '@angular/core';
import { DialogAspectListService } from './dialog-aspect-list.service';
import { CardViewContentUpdateService } from '../../common/services/card-view-content-update.service';
import { NodesApiService } from '../../common/services/nodes-api.service';
import { TagService } from '../../tag/services/tag.service';

@Injectable({
    providedIn: 'root'
})
export class NodeAspectService {

    constructor(private nodesApiService: NodesApiService,
                private dialogAspectListService: DialogAspectListService,
                private cardViewContentUpdateService: CardViewContentUpdateService,
                private tagService: TagService) {
    }

    updateNodeAspects(nodeId: string, selectorAutoFocusedOnClose?: string) {
        this.dialogAspectListService.openAspectListDialog(nodeId, selectorAutoFocusedOnClose).subscribe((aspectList) => {
            this.nodesApiService.updateNode(nodeId, { aspectNames: [...aspectList] }).subscribe((updatedNode) => {
                this.nodesApiService.nodeUpdated.next(updatedNode);
                this.cardViewContentUpdateService.updateNodeAspect(updatedNode);
                this.tagService.refresh.emit();
            });
        });
    }
}
