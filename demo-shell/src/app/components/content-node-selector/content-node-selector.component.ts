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

import { Component, ViewEncapsulation } from '@angular/core';
import { SitePaging, SiteEntry, MinimalNodeEntryEntity } from 'alfresco-js-api';
import { ShareDataRow } from '@alfresco/adf-content-services';

@Component({
    templateUrl: './content-node-selector.component.html',
    styleUrls: [`./content-node-selector.component.scss`],
    encapsulation: ViewEncapsulation.None
})
export class ContentNodeSelectorComponent {

    dropdownHideMyFiles = false;
    showFiles = false;
    showFolders = false;

    customSideGuid = '';
    customSideTitle = '';

    defaultSites: SiteEntry[] = [
        { entry: { title: 'MINE', guid: '-my-' } },
        { entry: { title: 'ROOTY', guid: '-root-' } }];

    customSites: SitePaging = {
        list: {
            entries: [
                { entry: { title: 'MINE', guid: '-my-' } },
                { entry: { title: 'ROOTY', guid: '-root-' } }],
            pagination: {}
        }
    };

    onClickAddSite() {
        const newSiteEntry: SiteEntry = { entry: { title: this.customSideTitle, guid: this.customSideGuid } };
        this.customSites.list.entries.push(newSiteEntry);
        this.customSideGuid = '';
        this.customSideTitle = '';
    }

    onClickResetSite() {
        this.customSites.list.entries = this.defaultSites;
        this.customSideGuid = '';
        this.customSideTitle = '';
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
}
