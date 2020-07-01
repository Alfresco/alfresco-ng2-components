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

import { Component, ViewEncapsulation, EventEmitter, Output, ViewChild, Input } from '@angular/core';
import { SearchPermissionConfigurationService } from './search-config-permission.service';
import { SearchService, SearchConfigurationService } from '@alfresco/adf-core';
import { SearchComponent } from '../../../search/components/search.component';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { NodeEntry } from '@alfresco/js-api';

export interface MemberList {
    key: string;
    items: string[];
}

@Component({
    selector: 'adf-add-permission-panel',
    templateUrl: './add-permission-panel.component.html',
    styleUrls: ['./add-permission-panel.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [
        { provide: SearchConfigurationService, useClass: SearchPermissionConfigurationService },
        SearchService
    ]
})
export class AddPermissionPanelComponent {

    @ViewChild('search')
    search: SearchComponent;

    /** List of groups that will be hidden in the search result */
    @Input()
    hiddenGroups: MemberList;

    /** List of users that will be hidden in the search result */
    @Input()
    hiddenUsers: MemberList;

    /** Emitted when a permission list item is selected. */
    @Output()
    select: EventEmitter<any> = new EventEmitter();

    searchInput: FormControl = new FormControl();
    searchedWord = '';
    debounceSearch: number = 200;

    selectedItems: NodeEntry[] = [];

    EVERYONE: NodeEntry = new NodeEntry({ entry: { properties: { 'cm:authorityName': 'GROUP_EVERYONE' } } });

    constructor() {
        this.searchInput.valueChanges
            .pipe(
                debounceTime(this.debounceSearch)
            )
            .subscribe((searchValue) => {
                this.searchedWord = searchValue;
                if (!searchValue) {
                    this.search.resetResults();
                }
            });
    }

    elementClicked(item: NodeEntry) {
        if (this.isAlreadySelected(item)) {
            this.selectedItems.splice(this.selectedItems.indexOf(item), 1);
        } else {
            this.selectedItems.push(item);
        }
        this.select.emit(this.selectedItems);
    }

    private isAlreadySelected(item: NodeEntry): boolean {
        return this.selectedItems.indexOf(item) >= 0;
    }

    clearSearch() {
        this.searchedWord = '';
        this.selectedItems.splice(0, this.selectedItems.length);
        this.search.resetResults();
    }

    isElementVisible(item: NodeEntry) {
        let visible = true;
        if (item && item.entry.nodeType === 'cm:authorityContainer' && this.hiddenGroups) {
            visible = !this.hiddenGroups.items.includes(item.entry.properties[this.hiddenGroups.key]);
        } else if (item && this.hiddenUsers) {
            visible = !this.hiddenUsers.items.includes(item.entry.properties[this.hiddenUsers.key]);
        }
        return visible;
    }

}
