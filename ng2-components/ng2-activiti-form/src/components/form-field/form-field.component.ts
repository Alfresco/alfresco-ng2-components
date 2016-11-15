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

import { Component, OnInit, ViewChild, ViewContainerRef, Input, ComponentRef, ComponentFactoryResolver/*,Output, EventEmitter, Injector*/ } from '@angular/core';
import { WidgetVisibilityService } from './../../services/widget-visibility.service';
import { FormRenderingService } from './../../services/form-rendering.service';
import { WidgetComponent } from './../widgets/widget.component';
import { FormFieldModel/*, FormWidgetModel*/ } from './../widgets/core/index';

@Component({
    selector: 'form-field',
    template: `
        <div [hidden]="!field.isVisible">
            <div #container></div>
        </div>
    `
})
export class FormFieldComponent implements OnInit {

    @ViewChild('container', { read: ViewContainerRef })
    container: ViewContainerRef;

    @Input()
    field: FormFieldModel = null;

    private componentRef: ComponentRef<{}>;

    constructor(
        private formRenderingService: FormRenderingService,
        private componentFactoryResolver: ComponentFactoryResolver,
        private visibilityService: WidgetVisibilityService
        /*,private injector: Injector*/) {
    }

    ngOnInit() {
        if (this.field) {
            let componentType = this.formRenderingService.resolveComponentType(this.field);
            if (componentType) {
                let factory = this.componentFactoryResolver.resolveComponentFactory(componentType);
                this.componentRef = this.container.createComponent(factory/*, 0, this.injector*/);
                let instance = <WidgetComponent>this.componentRef.instance;
                instance.field = this.field;
                instance.fieldChanged.subscribe(field => {
                    if (field && field.form) {
                        this.visibilityService.refreshVisibility(field.form);
                    }
                });
            }
        }
    }

}
