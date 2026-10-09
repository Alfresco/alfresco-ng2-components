/*!
 * @license
 * Copyright © 2005-2026 Hyland Software, Inc. and its affiliates. All rights reserved.
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
    ComponentRef,
    ViewChild,
    ViewContainerRef,
    OnDestroy,
    OnChanges,
    SimpleChanges,
    AfterViewInit,
    inject
} from '@angular/core';
import { ExtensionService } from '../../services/extension.service';
import { ExtensionComponent } from '../../services/component-register.service';
import { MatMenuItem } from '@angular/material/menu';

@Component({
    selector: 'adf-dynamic-component',
    template: `<div #content></div>`
})
export class DynamicExtensionComponent implements OnChanges, OnDestroy, AfterViewInit {
    private readonly extensions = inject(ExtensionService);

    @ViewChild('content', { read: ViewContainerRef, static: true })
    content: ViewContainerRef;

    /** Unique ID string for the component to show. */
    @Input() id: string;

    /** Data for the dynamically-loaded component instance. */
    @Input() data: any;

    /** Provides the menu item of dynamically-loaded component instance. */
    menuItem: MatMenuItem;

    private componentRef: ComponentRef<ExtensionComponent>;

    ngOnChanges(changes: SimpleChanges) {
        if (changes.id) {
            this.destroyComponent();
            this.loadComponent();
        }

        if (changes.data) {
            this.data = changes.data.currentValue;
        }

        this.updateInstance();
    }

    ngOnDestroy() {
        this.destroyComponent();
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
            this.componentRef.setInput('data', this.data);
        }
    }

    private destroyComponent() {
        if (this.componentCreated()) {
            this.componentRef.destroy();
            this.componentRef = null;
        }
    }

    private componentCreated(): boolean {
        return !!this.componentRef && !!this.componentRef.instance;
    }
}
