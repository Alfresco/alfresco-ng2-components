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

import { Component, Input, ViewChild, ViewContainerRef, OnInit, OnDestroy, Compiler, ModuleWithComponentFactories, ComponentRef } from '@angular/core';
import { SearchWidgetsModule } from './search-widgets.module';
import { SearchQueryBuilderService } from '../../search-query-builder.service';

@Component({
    selector: 'adf-search-widget-container',
    template: '<div #content></div>'
})
export class SearchWidgetContainerComponent implements OnInit, OnDestroy {

    @ViewChild('content', { read: ViewContainerRef })
    content: ViewContainerRef;

    @Input()
    id: string;

    @Input()
    selector: string;

    @Input()
    settings: any;

    @Input()
    config: any;

    private module: ModuleWithComponentFactories<SearchWidgetsModule>;
    private componentRef: ComponentRef<any>;

    constructor(compiler: Compiler, private queryBuilder: SearchQueryBuilderService) {
        this.module = compiler.compileModuleAndAllComponentsSync(SearchWidgetsModule);
    }

    ngOnInit() {
        const factory = this.module.componentFactories.find(f => f.selector === this.selector);
        if (factory) {
            this.content.clear();
            this.componentRef = this.content.createComponent(factory, 0);
            this.setupWidget(this.componentRef);
        }
    }

    private setupWidget(ref: ComponentRef<any>) {
        if (ref && ref.instance) {
            ref.instance.id = this.id;
            ref.instance.settings = { ...this.settings };
            ref.instance.context = this.queryBuilder;
        }
    }

    ngOnDestroy() {
        if (this.componentRef) {
            this.componentRef.destroy();
            this.componentRef = null;
        }
    }

}
