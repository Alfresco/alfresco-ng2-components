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

import { Component, Input, ViewChild, ViewContainerRef, OnInit, OnDestroy, ComponentRef, ComponentFactoryResolver, Inject } from '@angular/core';
import { SearchFilterService } from '../search-filter/search-filter.service';
import { BaseQueryBuilderService } from '../../base-query-builder.service';
import { SEARCH_QUERY_SERVICE_TOKEN } from '../../search-query-service.token';

@Component({
    selector: 'adf-search-widget-container',
    template: '<div #content></div>'
})
export class SearchWidgetContainerComponent implements OnInit, OnDestroy {

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

    componentRef: ComponentRef<any>;

    constructor(
        private searchFilterService: SearchFilterService,
        @Inject(SEARCH_QUERY_SERVICE_TOKEN) private queryBuilder: BaseQueryBuilderService,
        private componentFactoryResolver: ComponentFactoryResolver) {
    }

    ngOnInit() {
        const componentType = this.searchFilterService.widgets[this.selector];
        if (componentType) {
            const factory = this.componentFactoryResolver.resolveComponentFactory(componentType);
            if (factory) {
                this.content.clear();
                this.componentRef = this.content.createComponent(factory, 0);
                this.setupWidget(this.componentRef);
            }
        }
    }

    private setupWidget(ref: ComponentRef<any>) {
        if (ref && ref.instance) {
            ref.instance.id = this.id;
            ref.instance.settings = { ...this.settings };
            ref.instance.context = this.queryBuilder;
            if (this.value) {
                this.setValue(this.value);
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

    setValue(currentValue: string | Object) {
        this.componentRef.instance.setValue(currentValue);
        this.componentRef.instance.isActive = true;
    }

    hasValueSelected() {
        return this.componentRef.instance.hasValidValue();
    }

    getCurrentValue() {
        return this.componentRef.instance.getCurrentValue();
    }

    resetInnerWidget() {
        if (this.componentRef && this.componentRef.instance) {
            this.componentRef.instance.reset();
        }
    }
}
