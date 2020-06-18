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

import { Component, Input, Output, OnInit, OnChanges, EventEmitter, Inject, SimpleChanges, ViewEncapsulation, ViewChild } from '@angular/core';
import { DataColumn } from '@alfresco/adf-core';
import { SearchWidgetContainerComponent } from '../search-widget-container/search-widget-container.component';
import { SearchHeaderQueryBuilderService } from '../../search-header-query-builder.service';
import { SearchQueryBuilderService } from '../../search-query-builder.service';
import { NodePaging } from '@alfresco/js-api';

@Component({
    selector: 'adf-search-header',
    templateUrl: './search-header.component.html',
    styleUrls: ['./search-header.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [
        {
            provide: SearchQueryBuilderService,
            useClass: SearchHeaderQueryBuilderService
        }
    ]
})
export class SearchHeaderComponent implements OnInit, OnChanges {
    @Input()
    col: DataColumn;

    @Input()
    currentFolderNodeId: string;

    @Input()
    maxItems: number;

    @Input()
    skipCount: number;

    @Output()
    update: EventEmitter<NodePaging> = new EventEmitter();

    @Output()
    state: EventEmitter<any> = new EventEmitter();

    @ViewChild(SearchWidgetContainerComponent)
    widgetContainer: SearchWidgetContainerComponent;

    category: any = {};
    _isActive: boolean = false;

    set isActive(filterState: boolean) {
        this._isActive = filterState;
        this.state.emit({
            id: this.category.id,
            state: this._isActive
        });
    }

    get isActive() {
        return this._isActive;
    }

    constructor(
        @Inject(SearchQueryBuilderService)
        private searchHeaderQueryBuilder: SearchHeaderQueryBuilderService
    ) {}

    ngOnInit() {
        this.category = this.searchHeaderQueryBuilder.getCategoryForColumn(
            this.col.key
        );

        this.searchHeaderQueryBuilder.executed.subscribe(
            (newNodePaging: NodePaging) => {
                this.update.emit(newNodePaging);
            }
        );
    }

    ngOnChanges(changes: SimpleChanges) {
        if (
            changes['currentFolderNodeId'] &&
            changes['currentFolderNodeId'].currentValue
        ) {
            const currentIdValue = changes['currentFolderNodeId'].currentValue;
            const previousIdValue =
                changes['currentFolderNodeId'].previousValue;
            this.searchHeaderQueryBuilder.setCurrentRootFolderId(
                currentIdValue,
                previousIdValue
            );

            this.isActive = false;
        }

        if (changes['maxItems'] || changes['skipCount']) {
            let actualMaxItems = this.maxItems;
            let actualSkipCount = this.skipCount;
            if (changes['maxItems'] && changes['maxItems'].currentValue) {
                actualMaxItems = changes['maxItems'].currentValue;
            }
            if (changes['skipCount'] && changes['skipCount'].currentValue) {
                actualSkipCount = changes['skipCount'].currentValue;
            }
            this.searchHeaderQueryBuilder.setupCurrentPagination(
                actualMaxItems,
                actualSkipCount
            );
        }
    }

    onMenuButtonClick(event: Event) {
        event.stopPropagation();
    }

    onMenuClick(event: Event) {
        event.stopPropagation();
    }

    onApplyButtonClick() {
        this.searchHeaderQueryBuilder.execute();
        this.isActive = true;
    }

    onClearButtonClick(event: Event) {
        event.stopPropagation();
        this.widgetContainer.resetInnerWidget();
        this.searchHeaderQueryBuilder.execute();
        this.isActive = false;
    }
}
