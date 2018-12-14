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

import {
    Component,
    Input,
    ComponentRef,
    ComponentFactoryResolver,
    ViewChild,
    ViewContainerRef,
    OnDestroy,
    OnChanges,
    SimpleChanges
} from '@angular/core';
import { ExtensionService } from '../../services/extension.service';
import { ExtensionComponent } from '../../services/component-register.service';

@Component({
    selector: 'adf-dynamic-component',
    template: `<div #content></div>`
})
export class DynamicExtensionComponent implements OnChanges, OnDestroy {
    @ViewChild('content', { read: ViewContainerRef })
    content: ViewContainerRef;

    @Input() id: string;
    @Input() data: any;

    private componentRef: ComponentRef<ExtensionComponent>;
    private loaded: boolean = false;

    constructor(private extensions: ExtensionService, private componentFactoryResolver: ComponentFactoryResolver) {
        const dynamicLifeCycleMethods = [
            'ngOnInit',
            'ngDoCheck',
            'ngAfterContentInit',
            'ngAfterContentChecked',
            'ngAfterViewInit',
            'ngAfterViewChecked'
        ];

        dynamicLifeCycleMethods.forEach((method) => {
            this[method] = this.proxy.bind(this, method);
        });
    }

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

    private loadComponent() {
        const componentType = this.extensions.getComponentById<ExtensionComponent>(this.id);
        if (componentType) {
            const factory = this.componentFactoryResolver.resolveComponentFactory(
                componentType
            );
            if (factory) {
                this.content.clear();
                this.componentRef = this.content.createComponent(factory, 0);
            }
        }
    }

    ngOnDestroy() {
        if (this.componentRef) {
            this.proxy('ngOnDestroy');
            this.componentRef.destroy();
            this.componentRef = null;
        }
    }

    private updateInstance() {
        if (this.componentRef && this.componentRef.instance) {
            this.componentRef.instance.data = this.data;
        }
    }

    private proxy(methodName, ...args) {
        if (this.componentRef.instance[methodName]) {
            this.componentRef.instance[methodName].apply(this.componentRef.instance, args);
        }
    }
}
