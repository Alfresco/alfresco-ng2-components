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

import { Component, ViewEncapsulation } from '@angular/core';
import { SitePaging, SiteEntry, MinimalNodeEntryEntity, Node } from '@alfresco/js-api';
import { ContentNodeDialogService, ShareDataRow, RowFilter } from '@alfresco/adf-content-services';
import { ThumbnailService } from '@alfresco/adf-core';

@Component({
    templateUrl: './content-node-selector.component.html',
    styleUrls: [`./content-node-selector.component.scss`],
    encapsulation: ViewEncapsulation.None
})
export class ContentNodeSelectorComponent {

    constructor(private thumbnailService: ThumbnailService) {
    }

    dropdownHideMyFiles = false;
    showFiles = false;
    showFolders = false;
    enableImageResolver = false;
    validSelection = false;

    customSideGuid = '';
    customSideTitle = '';
    actualPageSize = 2;

    rowFilterFunction: RowFilter = null;
    excludeSiteContentList: string[] = ContentNodeDialogService.nonDocumentSiteContent;
    customImageResolver: any = null;

    defaultSites: SiteEntry[] = [
        new SiteEntry({ entry: { title: 'MINE', guid: '-my-' } }),
        new SiteEntry({ entry: { title: 'ROOTY', guid: '-root-' } })];

    customSites: SitePaging = new SitePaging({
        list: {
            entries: [
                { entry: { title: 'MINE', guid: '-my-' } },
                { entry: { title: 'ROOTY', guid: '-root-' } }],
            pagination: {}
        }
    });

    onClickAddSite() {
        const newSiteEntry: SiteEntry = new SiteEntry({ entry: { title: this.customSideTitle, guid: this.customSideGuid } });
        this.customSites.list.entries.push(newSiteEntry);
        this.customSideGuid = '';
        this.customSideTitle = '';
    }

    onClickResetSite() {
        this.customSites.list.entries = this.defaultSites;
        this.customSideGuid = '';
        this.customSideTitle = '';
    }

    recreateRowFilterFunction() {
        this.rowFilterFunction = this.rowFilteringExample.bind(this);
    }

    recreateImageResolverFunction() {
        this.enableImageResolver = !this.enableImageResolver;
        if (this.enableImageResolver) {
            this.customImageResolver = this.customImageResolverExample.bind(this);
        } else {
            this.customImageResolver = null;
        }
    }

    rowFilteringExample(row: ShareDataRow) {
        let showNode = true;
        const node: MinimalNodeEntryEntity = row.node.entry;
        if (this.showFiles) {
            showNode = node.isFile;
        }
        if (this.showFolders) {
            showNode = node.isFolder;
        }
        return showNode;
    }

    customImageResolverExample() {
        return this.thumbnailService.getMimeTypeIcon('video/quicktime');
    }

    onNodeSelect(selection: Node[]) {
        this.validSelection = !!selection;
    }

    customIsValidFunction(entry: MinimalNodeEntryEntity): boolean {
        return entry.name.startsWith('a') || entry.name.startsWith('A');
    }

    customBreadcrumbFunction(node: MinimalNodeEntryEntity) {
        if (node && node.path && node.path.elements) {
            node.path.elements = node.path.elements.filter((element) => !element.name.toLocaleLowerCase().startsWith('d') ? element : null );
        }
        return node;
    }
}
