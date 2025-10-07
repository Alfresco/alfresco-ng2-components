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

import { Component, Input, ComponentRef, ViewChild, ViewContainerRef, OnDestroy, OnChanges, SimpleChanges, AfterViewInit } from '@angular/core';
import { ExtensionService } from '../../services/extension.service';
import { ExtensionComponent } from '../../services/component-register.service';
import { MatMenuItem } from '@angular/material/menu';

// cSpell:words lifecycle
@Component({
    selector: 'adf-dynamic-component',
    template: `<div #content></div>`
})
export class DynamicExtensionComponent implements OnChanges, OnDestroy, AfterViewInit {
    @ViewChild('content', { read: ViewContainerRef, static: true })
    content: ViewContainerRef;

    /** Unique ID string for the component to show. */
    @Input() id: string;

    /** Data for the dynamically-loaded component instance. */
    @Input() data: any;

    /** Provides the menu item of dynamically-loaded component instance. */
    menuItem: MatMenuItem;

    private componentRef: ComponentRef<ExtensionComponent>;
    private loaded: boolean = false;

    constructor(private extensions: ExtensionService) {}

    ngOnChanges(changes: SimpleChanges) {
        if (!this.loaded) {
            this.loadComponent();
            this.loaded = true;
        }

        if (changes.data) {
            this.data = changes.data.currentValue;
        }

        this.updateInstance();
        this.proxy('ngOnChanges', changes);
    }

    ngOnDestroy() {
        if (this.componentCreated()) {
            this.componentRef.destroy();
            this.componentRef = null;
        }
    }

    ngAfterViewInit() {
        this.menuItem = this.componentRef?.instance?.menuItem;
    }

    private loadComponent() {
        const componentType = this.extensions.getComponentById<ExtensionComponent>(this.id);
        if (componentType) {
            this.content.clear();
            this.componentRef = this.content.createComponent(componentType, { index: 0 });
        }
    }

    private updateInstance() {
        if (this.componentCreated()) {
            this.componentRef.instance.data = this.data;
        }
    }

    private proxy(lifecycleMethod: string, ...args: any[]) {
        if (this.componentCreated() && this.lifecycleHookIsImplemented(lifecycleMethod)) {
            // eslint-disable-next-line prefer-spread
            this.componentRef.instance[lifecycleMethod].apply(this.componentRef.instance, args);
        }
    }

    private componentCreated(): boolean {
        return !!this.componentRef && !!this.componentRef.instance;
    }

    private lifecycleHookIsImplemented(lifecycleMethod: string): boolean {
        return !!this.componentRef.instance[lifecycleMethod];
    }
}
