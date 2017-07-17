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
    ComponentFactoryResolver,
    Input,
    OnChanges,
    Type,
    ViewChild
} from '@angular/core';
import { CardViewItem } from '../../interface/card-view-item.interface';
import { CardViewContentProxyDirective } from './card-view-content-proxy.directive';

@Component({
    selector: 'adf-card-view-item-dispatcher',
    template: '<ng-template adf-card-view-content-proxy></ng-template>'
})
export class CardViewItemDispatcherComponent implements OnChanges {
    @Input()
    property: CardViewItem;

    @Input()
    editable: boolean;

    @ViewChild(CardViewContentProxyDirective)
    private content: CardViewContentProxyDirective;

    private loaded: boolean = false;
    private componentReference: any = null;

    public ngOnInit;
    public ngDoCheck;

    constructor(private resolver: ComponentFactoryResolver) {
        const dynamicLifecycleMethods = [
            'ngOnInit',
            'ngDoCheck',
            'ngAfterContentInit',
            'ngAfterContentChecked',
            'ngAfterViewInit',
            'ngAfterViewChecked',
            'ngOnDestroy'
        ];

        dynamicLifecycleMethods.forEach((dynamicLifecycleMethod) => {
            this[dynamicLifecycleMethod] = this.proxy.bind(this, dynamicLifecycleMethod);
        });
    }

    ngOnChanges(...args) {
        if (!this.loaded) {
            this.loadComponent();
            this.loaded = true;
        }

        this.proxy('ngOnChanges', ...args);
    }

    private loadComponent() {
        const upperCamelCasedType = this.getUpperCamelCase(this.property.type),
            className = `CardView${upperCamelCasedType}ItemComponent`;

        const factories = Array.from(this.resolver['_factories'].keys());
        const factoryClass = <Type<any>> factories.find((x: any) => x.name === className);
        const factory = this.resolver.resolveComponentFactory(factoryClass);
        this.componentReference = this.content.viewContainerRef.createComponent(factory);

        this.componentReference.instance.editable = this.editable;
        this.componentReference.instance.property = this.property;
    }

    private getUpperCamelCase(type: string): string {
        const camelCasedType = type.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });
        return camelCasedType[0].toUpperCase() + camelCasedType.substr(1);
    }

    private proxy(methodName, ...args) {
        if (this.componentReference.instance[methodName]) {
            this.componentReference.instance[methodName].apply(this.componentReference.instance, args);
        }
    }
}
