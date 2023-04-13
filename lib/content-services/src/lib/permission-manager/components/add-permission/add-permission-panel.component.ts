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

import { SearchConfigurationService } from '../../../search/services/search-configuration.service';
import { SearchService } from '../../../search/services/search.service';
import { NodeEntry } from '@alfresco/js-api';
import { Component, EventEmitter, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { SearchPermissionConfigurationService } from './search-config-permission.service';
import { SearchComponent } from '../../../search/components/search.component';
import { MatSelectionList } from '@angular/material/list';

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

    @ViewChild('search', { static: true })
    search: SearchComponent;

    @ViewChild(MatSelectionList, { static: false })
    matSelectionList: MatSelectionList;

    /** Emitted when a permission list item is selected. */
    @Output()
    select: EventEmitter<NodeEntry[]> = new EventEmitter();

    searchInput: UntypedFormControl = new UntypedFormControl();
    searchedWord = '';
    debounceSearch: number = 200;

    selectedItems: NodeEntry[] = [];

    // eslint-disable-next-line @typescript-eslint/naming-convention
    EVERYONE: NodeEntry = new NodeEntry({ entry: { nodeType: 'cm:authorityContainer', properties: {'cm:authorityName': 'GROUP_EVERYONE'}}});

    constructor() {
        this.searchInput.valueChanges
        .pipe(
            debounceTime(this.debounceSearch)
        )
        .subscribe((searchValue) => {
            const selectionOptions = this.matSelectionList.selectedOptions.selected.map(option => option.value);
            this.selectedItems.push(...selectionOptions);
            this.matSelectionList.deselectAll();
            this.searchedWord = searchValue;
            if (!searchValue) {
                this.search.resetResults();
            }
        });
    }

    onSelectionChange() {
        const currentSelection = this.matSelectionList.selectedOptions.selected.map(option => option.value);
        const uniqueSelection = [ ...currentSelection, ...this.selectedItems ]
            .reduce((uniquesElements, currentElement) => {
            const isExist = uniquesElements.find(uniqueElement => uniqueElement.entry.id === currentElement.entry.id);
            if (!isExist) {
                uniquesElements.push(currentElement);
            }
            return uniquesElements;
            }, []);
        this.select.emit(uniqueSelection);
    }

    clearSearch() {
        this.searchedWord = '';
        this.selectedItems.splice(0, this.selectedItems.length);
        this.search.resetResults();
    }

}
