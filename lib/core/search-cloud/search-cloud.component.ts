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

import { ViewEncapsulation, Component, OnInit, ComponentRef, ViewChild, ViewContainerRef, Input, ComponentFactoryResolver, OnDestroy, EventEmitter, Output } from '@angular/core';
import { SearchCloudService } from '../services/search-cloud.service';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';
import { SearchCloudTypesEnum, SEARCH_CLOUD_TYPES, SearchCloudProperties } from '../models/search-cloud.model';

@Component({
    selector: 'adf-search-cloud',
    template: '<div #container></div>',
    styleUrls: ['./search-cloud.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: {
        'class': 'adf-search-cloud'
    }
})
export class SearchCloudComponent implements OnInit, OnDestroy {

    @Input() value: string = '';

    @Input() debounceTime: number = 500;

    @Input() placeholder: string;

    @Input() expandable: boolean = false;

    @Input() type: SearchCloudTypesEnum;

    @ViewChild('container', { read: ViewContainerRef })
    container: ViewContainerRef;

    @Output() change: EventEmitter<String> = new EventEmitter<String>();

    private componentRef: ComponentRef<any>;
    onDestroy$: Subject<void> = new Subject<void>();

    constructor (
        private searchCloudService: SearchCloudService,
        private componentFactoryResolver: ComponentFactoryResolver) {}

    ngOnInit() {
        const componentType = SEARCH_CLOUD_TYPES[this.type];
        if (componentType) {
            const factory = this.componentFactoryResolver.resolveComponentFactory(componentType);
            if (factory) {
                this.componentRef = this.container.createComponent(factory, 0);
                this.setupWidget();
            }
        }

        this.searchCloudService.value
            .pipe(
                debounceTime(this.debounceTime),
                takeUntil(this.onDestroy$)
            )
            .subscribe( (value: string) => {
                this.change.emit(value);
            });
    }

    setupWidget() {
        if (this.componentRef && this.componentRef.instance) {
            const properties: SearchCloudProperties = {
                placeholder: this.placeholder,
                debounceTime: this.debounceTime,
                expandable: this.expandable,
                value: this.value
            };
            this.componentRef.instance.properties = properties;
        }
    }

    ngOnDestroy() {
        if (this.componentRef) {
            this.componentRef.destroy();
            this.componentRef = null;
        }
    }
}
