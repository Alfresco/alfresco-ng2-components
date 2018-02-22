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

import { Component, Inject, ViewEncapsulation, Input } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { MinimalNodeEntryEntity, SitePaging } from 'alfresco-js-api';
import { ContentNodeSelectorComponentData } from './content-node-selector.component-data.interface';
import { RowFilter } from '../document-list/data/row-filter.model';
import { ImageResolver } from '../document-list/data/image-resolver.model';

@Component({
    selector: 'adf-content-node-selector',
    templateUrl: './content-node-selector.component.html',
    styleUrls: ['./content-node-selector.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ContentNodeSelectorComponent {

    /**
     * @deprecated in 2.1.0
     */
    @Input()
    title: string = null;

    /**
     * @deprecated in 2.1.0
     */
    @Input()
    currentFolderId: string = null;

    /**
     * @deprecated in 2.1.0
     */
    @Input()
    dropdownHideMyFiles: boolean = false;

    /**
     * @deprecated in 2.1.0
     */
    @Input()
    dropdownSiteList: SitePaging = null;

    /**
     * @deprecated in 2.1.0
     */
    @Input()
    rowFilter: RowFilter = null;

    /**
     * @deprecated in 2.1.0
     */
    @Input()
    imageResolver: ImageResolver = null;

    /**
     * @deprecated in 2.1.0
     */
    @Input()
    pageSize: number;

    buttonActionName: string;
    chosenNode: MinimalNodeEntryEntity[];

    constructor(@Inject(MAT_DIALOG_DATA) public data: ContentNodeSelectorComponentData) {
        this.buttonActionName = data.actionName ? `NODE_SELECTOR.${data.actionName.toUpperCase()}` : 'NODE_SELECTOR.CHOOSE';
    }

    close() {
        this.data.select.complete();
    }

    onSelect(nodeList: MinimalNodeEntryEntity[]) {
        this.chosenNode = nodeList;
    }

    onClick(): void {
        this.data.select.next(this.chosenNode);
        this.data.select.complete();
    }
}
