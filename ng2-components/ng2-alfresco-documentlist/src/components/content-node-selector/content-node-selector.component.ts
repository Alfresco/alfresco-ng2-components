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

import { Component, EventEmitter, Inject, Input, Optional, Output, ViewEncapsulation } from '@angular/core';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';
import { MinimalNodeEntity, NodePaging } from 'alfresco-js-api';
import { SearchOptions, SearchService } from '../../services/search.service';

@Component({
    selector: 'adf-content-node-selector',
    styleUrls: ['./content-node-selector.component.scss'],
    templateUrl: './content-node-selector.component.html',
    encapsulation: ViewEncapsulation.None
})
export class ContentNodeSelectorComponent {

    chosenNode: MinimalNodeEntity | null = null;

    inDialog: boolean = false;

    nodes: NodePaging;

    @Input()
    title: string;

    @Output()
    selectionMade: EventEmitter<MinimalNodeEntity> = new EventEmitter<MinimalNodeEntity>();

    constructor(private searchService: SearchService,
                @Optional() @Inject(MD_DIALOG_DATA) public data?: any,
                @Optional() private containingDialog?: MdDialogRef<ContentNodeSelectorComponent>) {
        if (data) {
            this.title = data.title;
            this.selectionMade = data.selectionMade;
        }
        if (containingDialog) { this.inDialog = true; }
    }

    search(value) {
        this.querySearch(value);
    }

    private querySearch(searchTerm) {
        if (searchTerm) {
            searchTerm = searchTerm + '*';
            let searchOpts: SearchOptions = {
                include: ['path'],
                skipCount: 0,
                rootNodeId: '-root-',
                nodeType: 'cm:folder',
                maxItems: 20,
                orderBy: null
            };
            this.searchService
                .getNodeQueryResults(searchTerm, searchOpts)
                .subscribe(
                    results => {
                        this.nodes = results;
                    }
                );
        }
    }

    /**
     * Invoked when user selects a node
     *
     * @param event CustomEvent for node-select
     */
    onNodeSelect(event: any) {
        this.chosenNode = event.detail.node;
    }

    /**
     * * Invoked when user unselects a node
     *
     * @param param0 Custom event for node-unselect
     */
    onNodeUnselect({ node }) {
        this.chosenNode = null;
    }

    /**
     * Emit event with the chosen node
     */
    choose() {
        this.selectionMade.next(this.chosenNode);
    }

    /**
     * Close the dialog
     */
    close() {
        this.containingDialog.close();
    }
}
