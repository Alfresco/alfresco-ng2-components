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

import { ViewEncapsulation, Component, ViewChild, ElementRef, Renderer2, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { SearchCloudService } from '../../../services/search-cloud.service';
import { SearchCloudProperties, SearchCloudWidget } from '../../../models/search-cloud.model';

@Component({
    selector: 'adf-search-text-cloud',
    templateUrl: './search-text-cloud.component.html',
    encapsulation: ViewEncapsulation.None
})
export class SearchTextCloudComponent implements OnInit, SearchCloudWidget {

    @ViewChild('searchContainer')
    searchInput: ElementRef;

    properties: SearchCloudProperties = {};
    onDestroy$: Subject<void> = new Subject<void>();

    expandedClass = 'app-field-expanded';

    constructor(
        private searchCloudService: SearchCloudService,
        private renderer: Renderer2) {}

    ngOnInit() {
        if (!this.isExpandable()) {
            this.renderer.addClass(this.searchInput.nativeElement, this.expandedClass);
        }
    }

    onChangedHandler(event) {
        this.searchCloudService.value.next(event.target.value);
    }

    toggle() {
        if (!this.isExpandable()) { return; }

        if (this.searchInput.nativeElement && this.searchInput.nativeElement.classList.contains(this.expandedClass)) {
            this.renderer.removeClass(this.searchInput.nativeElement, this.expandedClass);
        } else {
            this.renderer.addClass(this.searchInput.nativeElement, this.expandedClass);
        }
    }

    private isExpandable() {
        return this.properties && this.properties.expandable;
    }

    clear() {
        this.properties.value = '';
    }
}
