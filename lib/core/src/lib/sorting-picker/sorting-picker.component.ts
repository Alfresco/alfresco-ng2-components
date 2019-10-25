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

import { Component, ViewEncapsulation, Input, EventEmitter, Output } from '@angular/core';
import { MatSelectChange } from '@angular/material';

@Component({
    selector: 'adf-sorting-picker',
    templateUrl: './sorting-picker.component.html',
    encapsulation: ViewEncapsulation.None,
    host: { class: 'adf-sorting-picker' }
})
export class SortingPickerComponent {

    /** Available sorting options */
    @Input()
    options: Array<{key: string, label: string}> = [];

    /** Currently selected option key */
    @Input()
    selected: string;

    /** Current sorting direction */
    @Input()
    ascending = true;

    /** Raised each time sorting key gets changed. */
    @Output()
    valueChange = new EventEmitter<string>();

    /** Raised each time direction gets changed. */
    @Output()
    sortingChange = new EventEmitter<boolean>();

    onOptionChanged(event: MatSelectChange) {
        this.selected = event.value;
        this.valueChange.emit(this.selected);
    }

    toggleSortDirection() {
        this.ascending = !this.ascending;
        this.sortingChange.emit(this.ascending);
    }
}
