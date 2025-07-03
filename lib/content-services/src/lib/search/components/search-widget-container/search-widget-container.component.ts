/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Component, Input, ViewChild, ViewContainerRef, OnInit, OnDestroy, ComponentRef, SimpleChanges, OnChanges, Injector } from '@angular/core';
import { SearchFilterService } from '../../services/search-filter.service';
import { Observable } from 'rxjs';
import { SearchHeaderQueryBuilderService, SearchQueryBuilderService } from '../../services';

@Component({
    selector: 'adf-search-widget-container',
    template: '<div #content></div>'
})
export class SearchWidgetContainerComponent implements OnInit, OnDestroy, OnChanges {
    @ViewChild('content', { read: ViewContainerRef, static: true })
    content: ViewContainerRef;

    @Input()
    id: string;

    @Input()
    selector: string;

    @Input()
    settings: any;

    @Input()
    config: any;

    @Input()
    value: any;

    @Input()
    useHeaderQueryBuilder: boolean;

    componentRef: ComponentRef<any>;

    constructor(private searchFilterService: SearchFilterService, private injector: Injector) {}

    ngOnInit() {
        const componentType = this.searchFilterService.widgets[this.selector];
        if (componentType) {
            this.content.clear();
            this.componentRef = this.content.createComponent(componentType, { index: 0 });
            this.setupWidget(this.componentRef);
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['value']?.currentValue && this.componentRef?.instance) {
            this.componentRef.instance.isActive = true;
            this.componentRef.instance.setValue(changes['value'].currentValue);
        }
    }

    private setupWidget(ref: ComponentRef<any>) {
        if (ref?.instance) {
            ref.instance.id = this.id;
            ref.instance.settings = { ...this.settings };
            if (this.useHeaderQueryBuilder) {
                ref.instance.context = this.injector.get(SearchHeaderQueryBuilderService);
            } else {
                ref.instance.context = this.injector.get(SearchQueryBuilderService);
            }
            if (this.value) {
                ref.instance.isActive = true;
                ref.instance.startValue = this.value;
            }
        }
    }

    ngOnDestroy() {
        if (this.componentRef) {
            this.componentRef.destroy();
            this.componentRef = null;
        }
    }

    applyInnerWidget() {
        this.componentRef.instance.submitValues();
    }

    setValue(currentValue: string | any) {
        this.componentRef.instance.isActive = true;
        this.componentRef.instance.setValue(currentValue);
    }

    hasValueSelected() {
        return this.componentRef.instance.hasValidValue();
    }

    getCurrentValue() {
        return this.componentRef.instance.getCurrentValue();
    }

    getDisplayValue(): Observable<string> | null {
        if (!this.componentRef?.instance) {
            return null;
        }
        return this.componentRef.instance.displayValue$;
    }

    resetInnerWidget() {
        if (this.componentRef?.instance) {
            this.componentRef.instance.reset();
        }
    }
}
