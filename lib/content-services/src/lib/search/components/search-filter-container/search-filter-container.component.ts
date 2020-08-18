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
    EventEmitter,
    ViewEncapsulation,
    ViewChild,
    Inject,
    OnDestroy,
    ElementRef
} from '@angular/core';
import { ConfigurableFocusTrapFactory, ConfigurableFocusTrap } from '@angular/cdk/a11y';
import { DataColumn, TranslationService } from '@alfresco/adf-core';
import { SearchWidgetContainerComponent } from '../search-widget-container/search-widget-container.component';
import { SearchFilterQueryBuilderService } from '../../search-filter-query-builder.service';
import { NodePaging } from '@alfresco/js-api';
import { SearchCategory } from '../../search-category.interface';
import { SEARCH_QUERY_SERVICE_TOKEN } from '../../search-query-service.token';
import { Subject } from 'rxjs';
import { MatMenuTrigger } from '@angular/material/menu';
import { FilterSearch } from '../../filter-search.interface';

@Component({
    selector: 'adf-search-filter-container',
    templateUrl: './search-filter-container.component.html',
    styleUrls: ['./search-filter-container.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class SearchFilterContainerComponent implements OnInit, OnDestroy {

    /** The column the filter will be applied on. */
    @Input()
    col: DataColumn;

    /** The column the filter will be applied on. */
    @Input()
    value: any;

    /** Emitted when the result of the filter is received from the API. */
    @Output()
    update: EventEmitter<NodePaging> = new EventEmitter();

    /** Emitted when the last of all the filters is cleared. */
    @Output()
    resetFilter: EventEmitter<any> = new EventEmitter();

    /** Emitted when a filter value is selected */
    @Output()
    selection: EventEmitter<FilterSearch> = new EventEmitter();

    @ViewChild(SearchWidgetContainerComponent)
    widgetContainer: SearchWidgetContainerComponent;

    @ViewChild('filterContainer')
    filterContainer: ElementRef;

    category: SearchCategory;
    isFilterServiceActive: boolean;
    focusTrap: ConfigurableFocusTrap;

    private onDestroy$ = new Subject<boolean>();

    constructor(@Inject(SEARCH_QUERY_SERVICE_TOKEN) private searchHeaderQueryBuilder: SearchFilterQueryBuilderService,
                private translationService: TranslationService,
                private focusTrapFactory: ConfigurableFocusTrapFactory) {
    }

    ngOnInit() {
        this.category = this.searchHeaderQueryBuilder.getCategoryForColumn(
            this.col.key
        );
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
            this.selection.emit( <FilterSearch> {
                key: this.category.columnKey,
                value: this.widgetContainer.getCurrentValue()
            });
        } else {
            this.resetSearchFilter();
        }
    }

    onClearButtonClick(event: Event) {
        event.stopPropagation();
        this.resetSearchFilter();
    }

    resetSearchFilter() {
        if (this.widgetContainer && this.isActive()) {
            this.widgetContainer.resetInnerWidget();
            this.searchHeaderQueryBuilder.removeActiveFilter(this.category.columnKey);
            // this.selection.emit(this.searchHeaderQueryBuilder.getActiveFilters());
            if (this.searchHeaderQueryBuilder.isNoFilterActive()) {
                this.resetFilter.emit();
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
