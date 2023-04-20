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

import {
    Component,
    Input,
    OnInit,
    OnDestroy,
    ViewChild,
    ViewContainerRef,
    ComponentRef,
    ComponentFactoryResolver,
    OnChanges,
    SimpleChanges
} from '@angular/core';
import { Node } from '@alfresco/js-api';
import { ExtensionService } from '../../services/extension.service';

@Component({
    selector: 'adf-dynamic-tab',
    template: `<div #content></div>`
})
export class DynamicTabComponent implements OnInit, OnChanges, OnDestroy {
    @ViewChild('content', { read: ViewContainerRef, static: true })
    content: ViewContainerRef;

    /** Unique ID string for the component to show. */
    @Input()
    id: string;

    @Input()
    node: Node;

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
                this.updateInstance();
            }
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.node) {
            this.updateInstance();
        }
    }

    ngOnDestroy() {
        if (this.componentRef) {
            this.componentRef.destroy();
            this.componentRef = null;
        }
    }

    private updateInstance() {
        if (this.componentRef && this.componentRef.instance) {
            this.componentRef.instance.node = this.node;
        }
    }
}
