/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Directive, Input, Component, OnInit, OnChanges, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[adf-node-counter]'
})
export class NodeCounterDirective implements OnInit, OnChanges {

    /** Number to display in the counter badge */
    @Input('adf-node-counter')
    counter: number;

    componentRef: NodeCounterComponent;

    constructor(
        private resolver: ComponentFactoryResolver,
        public viewContainerRef: ViewContainerRef
    ) {}

    ngOnInit() {
        const componentFactory = this.resolver.resolveComponentFactory(NodeCounterComponent);
        this.componentRef = this.viewContainerRef.createComponent(componentFactory).instance;
        this.componentRef.counter = this.counter;
    }

    ngOnChanges() {
        if (this.componentRef) {
            this.componentRef.counter = this.counter;
        }
    }
}

@Component({
    selector: 'adf-node-counter',
    template: `
        <div>{{ 'NODE_COUNTER.SELECTED_COUNT' | translate: { count: counter } }}</div>
    `
})
export class NodeCounterComponent {
    counter: number;
}
