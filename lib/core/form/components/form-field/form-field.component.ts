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
    ComponentRef,
    Input,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewContainerRef,
    ViewEncapsulation
} from '@angular/core';

import { FormRenderingService } from './../../services/form-rendering.service';
import { WidgetVisibilityService } from './../../services/widget-visibility.service';
import { FormFieldModel } from './../widgets/core/form-field.model';
import { WidgetComponent } from './../widgets/widget.component';

@Component({
    selector: 'adf-form-field, form-field',
    template: `
        <div [hidden]="!field?.isVisible"
            [class.adf-focus]="focus"
            (focusin)="focusToggle()"
            (focusout)="focusToggle()">
            <div #container></div>
        </div>
    `,
    encapsulation: ViewEncapsulation.None
})
export class FormFieldComponent implements OnInit, OnDestroy {

    @ViewChild('container', { read: ViewContainerRef })
    container: ViewContainerRef;

    @Input()
    field: FormFieldModel = null;

    componentRef: ComponentRef<{}>;

    focus: boolean = false;

    constructor(private formRenderingService: FormRenderingService,
                private componentFactoryResolver: ComponentFactoryResolver,
                private visibilityService: WidgetVisibilityService) {
    }

    ngOnInit() {
        const originalField = this.getField();
        if (originalField) {
            const componentType = this.formRenderingService.resolveComponentType(originalField);
            if (componentType) {
                const factory = this.componentFactoryResolver.resolveComponentFactory(componentType);
                this.componentRef = this.container.createComponent(factory);

                const instance = <WidgetComponent> this.componentRef.instance;
                instance.field = this.field;
                instance.fieldChanged.subscribe(field => {
                    if (field && this.field.form) {
                        this.visibilityService.refreshVisibility(this.field.form);
                    }
                });
            }
        }
    }

    ngOnDestroy() {
        if (this.componentRef) {
            this.componentRef.destroy();
            this.componentRef = null;
        }
    }

    private getField(): FormFieldModel {
        if (this.field && this.field.params) {
            const wrappedField = this.field.params.field;
            if (wrappedField && wrappedField.type) {
                return wrappedField;
            }
        }
        return this.field;
    }

    focusToggle() {
        this.focus = !this.focus;
    }
}
