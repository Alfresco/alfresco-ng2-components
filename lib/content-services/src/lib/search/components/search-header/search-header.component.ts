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

import {
    Component,
    Input,
    Output,
    OnInit,
    OnChanges,
    EventEmitter,
    SimpleChanges,
    ViewEncapsulation,
    ViewChild,
    Inject,
    OnDestroy,
    ElementRef
} from '@angular/core';
import { ConfigurableFocusTrapFactory, ConfigurableFocusTrap } from '@angular/cdk/a11y';
import { DataColumn, TranslationService } from '@alfresco/adf-core';
import { SearchWidgetContainerComponent } from '../search-widget-container/search-widget-container.component';
import { SearchHeaderQueryBuilderService } from '../../search-header-query-builder.service';
import { NodePaging, MinimalNode } from '@alfresco/js-api';
import { SearchCategory } from '../../search-category.interface';
import { SEARCH_QUERY_SERVICE_TOKEN } from '../../search-query-service.token';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatMenuTrigger } from '@angular/material/menu';

@Component({
    selector: 'adf-search-header',
    templateUrl: './search-header.component.html',
    styleUrls: ['./search-header.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class SearchHeaderComponent implements OnInit, OnChanges, OnDestroy {

    /** The column the filter will be applied on. */
    @Input()
    col: DataColumn;

    /** (optional) Initial filter value to sort . */
     @Input()
    value: any;

    /** The id of the current folder of the document list. */
    @Input()
    currentFolderNodeId: string;

    /** Maximum number of search results to show in a page. */
    @Input()
    maxItems: number;

    /** The offset of the start of the page within the results list. */
    @Input()
    skipCount: number;

    /** The sorting to apply to the the filter. */
    @Input()
    sorting: string = null;

    /** Emitted when the result of the filter is received from the API. */
    @Output()
    update: EventEmitter<NodePaging> = new EventEmitter();

    /** Emitted when the last of all the filters is cleared. */
    @Output()
    clear: EventEmitter<any> = new EventEmitter();

    /** Emitted when a filter value is selected */
    @Output()
    selection: EventEmitter<Map<string, string>> = new EventEmitter();

    @ViewChild(SearchWidgetContainerComponent)
    widgetContainer: SearchWidgetContainerComponent;

    @ViewChild('filterContainer')
    filterContainer: ElementRef;

    category: SearchCategory;
    isFilterServiceActive: boolean;
    initialValue: any;
    focusTrap: ConfigurableFocusTrap;

    private onDestroy$ = new Subject<boolean>();

    constructor(@Inject(SEARCH_QUERY_SERVICE_TOKEN) private searchHeaderQueryBuilder: SearchHeaderQueryBuilderService,
                private translationService: TranslationService,
                private focusTrapFactory: ConfigurableFocusTrapFactory) {
        this.isFilterServiceActive = this.searchHeaderQueryBuilder.isFilterServiceActive();
    }

    ngOnInit() {
        this.category = this.searchHeaderQueryBuilder.getCategoryForColumn(
            this.col.key
        );

        this.searchHeaderQueryBuilder.executed
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((newNodePaging: NodePaging) => {
                this.update.emit(newNodePaging);
            });
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['currentFolderNodeId'] && changes['currentFolderNodeId'].currentValue) {
            this.clearHeader();
            this.configureSearchParent(changes['currentFolderNodeId'].currentValue);
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

            this.searchHeaderQueryBuilder.setupCurrentPagination(actualMaxItems, actualSkipCount);
        }

        if (changes['sorting'] && changes['sorting'].currentValue) {
            const [key, value] = changes['sorting'].currentValue.split('-');
            if (key === this.col.key) {
                this.searchHeaderQueryBuilder.setSorting(key, value);
            }
        }

    }

    ngOnDestroy() {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }

    onKeyPressed(event: KeyboardEvent, menuTrigger: MatMenuTrigger) {
        if (event.key === 'Enter' && this.widgetContainer.selector !== 'check-list') {
            this.onApply();
            menuTrigger.closeMenu();
        }
    }

    onApply() {
        if (this.widgetContainer.hasValueSelected()) {
            this.widgetContainer.applyInnerWidget();
            this.searchHeaderQueryBuilder.setActiveFilter(this.category.columnKey, this.widgetContainer.getCurrentValue());
            this.selection.emit(this.searchHeaderQueryBuilder.getActiveFilters());
        } else {
            this.clearHeader();
        }
    }

    onClearButtonClick(event: Event) {
        event.stopPropagation();
        this.clearHeader();
    }

    clearHeader() {
        if (this.widgetContainer && this.isActive()) {
            this.widgetContainer.resetInnerWidget();
            this.searchHeaderQueryBuilder.removeActiveFilter(this.category.columnKey);
            this.selection.emit(this.searchHeaderQueryBuilder.getActiveFilters());
            if (this.searchHeaderQueryBuilder.isNoFilterActive()) {
                this.clear.emit();
            }
        }
    }

    getTooltipTranslation(columnTitle: string): string {
        if (!columnTitle) {
            columnTitle = 'SEARCH.SEARCH_HEADER.TYPE';
        }
        return this.translationService.instant('SEARCH.SEARCH_HEADER.FILTER_BY', { category: this.translationService.instant(columnTitle) });
    }

    isActive(): boolean {
        return this.widgetContainer && this.widgetContainer.componentRef && this.widgetContainer.componentRef.instance.isActive;
    }

    private configureSearchParent(currentFolderNodeId: string) {
        if (this.searchHeaderQueryBuilder.isCustomSourceNode(currentFolderNodeId)) {
            this.searchHeaderQueryBuilder.getNodeIdForCustomSource(currentFolderNodeId).subscribe((node: MinimalNode) => {
                this.initSearchHeader(node.id);
            });
        } else {
            this.initSearchHeader(currentFolderNodeId);
        }
    }

    private initSearchHeader(currentFolderId: string) {
        this.searchHeaderQueryBuilder.setCurrentRootFolderId(currentFolderId);
        if (this.value) {
            this.searchHeaderQueryBuilder.setActiveFilter(this.category.columnKey, this.initialValue);
            this.initialValue = this.value;
        }
    }

    onMenuOpen() {
        if (this.filterContainer && !this.focusTrap) {
            this.focusTrap = this.focusTrapFactory.create(this.filterContainer.nativeElement);
            this.focusTrap.focusInitialElement();
        }
    }

    onClosed() {
        this.focusTrap.destroy();
        this.focusTrap = null;
    }
}
