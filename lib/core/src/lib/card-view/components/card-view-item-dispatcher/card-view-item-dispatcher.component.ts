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
    OnChanges,
    SimpleChange,
    SimpleChanges,
    ViewChild
} from '@angular/core';
import { CardViewItem } from '../../interfaces/card-view-item.interface';
import { CardItemTypeService } from '../../services/card-item-types.service';
import { CardViewContentProxyDirective } from '../../directives/card-view-content-proxy.directive';
import { DEFAULT_SEPARATOR } from '../card-view-textitem/card-view-textitem.component';

@Component({
    selector: 'adf-card-view-item-dispatcher',
    template: '<ng-template adf-card-view-content-proxy></ng-template>'
})
export class CardViewItemDispatcherComponent implements OnChanges {
    @Input()
    property: CardViewItem;

    @Input()
    editable: boolean;

    @Input()
    displayEmpty: boolean = true;

    @Input()
    displayNoneOption: boolean = true;

    @Input()
    displayClearAction: boolean = true;

    @Input()
    copyToClipboardAction: boolean = true;

    @Input()
    useChipsForMultiValueProperty: boolean = true;

    @Input()
    multiValueSeparator: string = DEFAULT_SEPARATOR;

    @ViewChild(CardViewContentProxyDirective, { static: true })
    private content: CardViewContentProxyDirective;

    private loaded: boolean = false;
    private componentReference: any = null;

    public ngOnInit;
    public ngDoCheck;

    constructor(private cardItemTypeService: CardItemTypeService) {
        const dynamicLifeCycleMethods = [
            'ngOnInit',
            'ngDoCheck',
            'ngAfterContentInit',
            'ngAfterContentChecked',
            'ngAfterViewInit',
            'ngAfterViewChecked',
            'ngOnDestroy'
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

        Object.keys(changes)
            .map((changeName) => [changeName, changes[changeName]])
            .forEach(([inputParamName, simpleChange]: [string, SimpleChange]) => {
                this.componentReference.instance[inputParamName] = simpleChange.currentValue;
            });

        this.proxy('ngOnChanges', changes);
    }

    private loadComponent() {
        const factoryClass = this.cardItemTypeService.resolveComponentType(this.property);

        this.componentReference = this.content.viewContainerRef.createComponent(factoryClass);

        this.componentReference.instance.editable = this.editable;
        this.componentReference.instance.property = this.property;
        this.componentReference.instance.displayEmpty = this.displayEmpty;
        this.componentReference.instance.displayNoneOption = this.displayNoneOption;
        this.componentReference.instance.displayClearAction = this.displayClearAction;
        this.componentReference.instance.copyToClipboardAction = this.copyToClipboardAction;
        this.componentReference.instance.useChipsForMultiValueProperty = this.useChipsForMultiValueProperty;
        this.componentReference.instance.multiValueSeparator = this.multiValueSeparator;
    }

    private proxy(methodName, ...args) {
        if (this.componentReference.instance[methodName]) {
            this.componentReference.instance[methodName].apply(this.componentReference.instance, args);
        }
    }
}
