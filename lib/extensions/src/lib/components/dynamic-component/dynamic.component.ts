/*!
 * @license
 * Copyright 2016 - 2018 Alfresco Software, Ltd.
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
    OnInit,
    ComponentFactoryResolver,
    ViewChild,
    ViewContainerRef,
    OnDestroy
} from '@angular/core';
import { ExtensionService } from '../../services/extension.service';

@Component({
    selector: 'adf-dynamic-component',
    template: `<div #content></div>`
})
export class DynamicExtensionComponent implements OnInit, OnDestroy {
    @ViewChild('content', { read: ViewContainerRef })
    content: ViewContainerRef;

    @Input() id: string;

    private componentRef: ComponentRef<any>;

    constructor(
        private extensions: ExtensionService,
        private componentFactoryResolver: ComponentFactoryResolver
    ) {}

    ngOnInit() {
        const componentType = this.extensions.getComponentById(this.id);
        if (componentType) {
            const factory = this.componentFactoryResolver.resolveComponentFactory(
                componentType
            );
            if (factory) {
                this.content.clear();
                this.componentRef = this.content.createComponent(factory, 0);
                // this.setupWidget(this.componentRef);
            }
        }
    }

    ngOnDestroy() {
        if (this.componentRef) {
            this.componentRef.destroy();
            this.componentRef = null;
        }
    }
}
