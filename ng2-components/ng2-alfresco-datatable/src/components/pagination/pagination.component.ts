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

import { Component, Input, OnInit } from '@angular/core';
import { PaginationProvider } from './paginationProvider.interface';

@Component({
    moduleId: module.id,
    selector: 'alfresco-pagination',
    templateUrl: './pagination.component.html',
    styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit {

    DEFAULT_PAGE_SIZE: number = 20;

    private _summary: string = '';

    @Input()
    supportedPageSizes: number[] = [5, 10, 20, 50, 100];

    @Input()
    provider: PaginationProvider;

    get pageSize(): number {
        if (this.provider) {
            return this.provider.maxItems;
        }
        return this.DEFAULT_PAGE_SIZE;
    }

    set pageSize(value: number) {
        if (this.provider) {
            this.provider.maxItems = value;
        }
    }

    setPageSize(value: number) {
        this.pageSize = value;
    }

    get summary(): string {
        return this._summary;
    }

    get nextPageAvail(): boolean {
        return this.provider.hasMoreItems;
    }

    get prevPageAvail(): boolean {
        return this.provider.skipCount > 0;
    }

    showNextPage() {
        this.provider.skipCount += this.provider.maxItems;
    }

    showPrevPage() {
        this.provider.skipCount -= this.provider.maxItems;
    }

    ngOnInit() {
        this.provider.dataLoaded.subscribe(() => {
            this.updateSummary();
        });
    }

    private updateSummary() {
        let from = this.provider.skipCount;
        if (from === 0) {
            from = 1;
        }
        let to = this.provider.skipCount + this.provider.count;
        let of = this.provider.totalItems;
        this._summary = `${from}-${to} of ${of}`;
    }
}
