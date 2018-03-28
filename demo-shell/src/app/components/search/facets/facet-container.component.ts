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
import { FacetsModule } from './facets.module';
import { SearchQueryBuilder } from '../search-query-builder';

@Component({
    selector: 'app-facet-container',
    template: '<div #content></div>'
})
export class FacetContainerComponent implements OnInit, OnDestroy {

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

    @Input()
    context: SearchQueryBuilder;

    private module: ModuleWithComponentFactories<FacetsModule>;
    private componentRef: ComponentRef<any>;

    constructor(compiler: Compiler) {
        this.module = compiler.compileModuleAndAllComponentsSync(FacetsModule);
    }

    ngOnInit() {
        const factory = this.module.componentFactories.find(f => f.selector === this.selector);
        if (factory) {
            this.content.clear();
            this.componentRef = this.content.createComponent(factory, 0);
            this.setupFacet(this.componentRef);
        }
    }

    private setupFacet(ref: ComponentRef<any>) {
        if (ref && ref.instance) {
            ref.instance.id = this.id;
            ref.instance.settings = { ...this.settings };
            ref.instance.context = this.context;
        }
    }

    ngOnDestroy() {
        if (this.componentRef) {
            this.componentRef.destroy();
            this.componentRef = null;
        }
    }

}
