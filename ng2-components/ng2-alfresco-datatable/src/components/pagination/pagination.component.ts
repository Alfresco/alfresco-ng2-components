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

import { SimpleChanges, OnChanges, EventEmitter, Output, Component, Input, OnInit } from '@angular/core';
import { PaginationData } from '../../models/pagination.data';
import { Pagination } from 'alfresco-js-api';

@Component({
    moduleId: module.id,
    selector: 'alfresco-pagination',
    templateUrl: './pagination.component.html',
    styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit, OnChanges {

    static DEFAULT_PAGE_SIZE: number = 20;

    private summary: string = '';

    @Input()
    supportedPageSizes: number[] = [5, 10, 20, 50, 100];

    @Input()
    maxItems: number = PaginationComponent.DEFAULT_PAGE_SIZE;

    @Input()
    pagination: Pagination;

    @Output()
    changePageSize: EventEmitter<Pagination> = new EventEmitter<Pagination>();

    @Output()
    nextPage: EventEmitter<Pagination> = new EventEmitter<Pagination>();

    @Output()
    prevPage: EventEmitter<Pagination> = new EventEmitter<Pagination>();

    constructor() {
    }

    ngOnInit() {
        if (!this.pagination) {
            this.pagination = new PaginationData(0, 0, 0, this.maxItems, true);
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['pagination']) {
            if (changes['pagination'].currentValue) {
                this.pagination = changes['pagination'].currentValue;
                this.updateSummary();
            }
        }
    }

    setPageSize(value: number) {
        this.pagination.maxItems = value;
        this.updateSummary();
        this.changePageSize.emit(this.pagination);
    }

    nextPageAvail(): boolean {
        return this.pagination.hasMoreItems;
    }

    prevPageAvail(): boolean {
        return this.pagination.skipCount > 0;
    }

    showNextPage() {
        this.pagination.skipCount += this.pagination.maxItems;
        this.updateSummary();
        this.nextPage.emit(this.pagination);
    }

    showPrevPage() {
        this.pagination.skipCount -= this.pagination.maxItems;
        this.updateSummary();
        this.prevPage.emit(this.pagination);
    }

    updateSummary() {
        let from = this.pagination.skipCount;
        if (from === 0) {
            from = 1;
        }
        let to = this.pagination.skipCount + this.pagination.count;
        let of = this.pagination.totalItems;
        this.summary = `${from}-${to} of ${of}`;
    }
}
