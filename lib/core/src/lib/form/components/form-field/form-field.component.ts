/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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
    Compiler,
    Component, ComponentFactory,
    ComponentFactoryResolver,
    ComponentRef,
    Input,
    ModuleWithComponentFactories,
    NgModule,
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

declare var adf: any;

@Component({
    selector: 'adf-form-field',
    template: `
        <div [id]="'field-'+field?.id+'-container'"
            [hidden]="!field?.isVisible"
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

    /** Contains all the necessary data needed to determine what UI Widget
     * to use when rendering the field in the form. You would typically not
     * create this data manually but instead create the form in APS and export
     * it to get to all the `FormFieldModel` definitions.
     */
    @Input()
    field: FormFieldModel = null;

    componentRef: ComponentRef<{}>;

    focus: boolean = false;

    constructor(private formRenderingService: FormRenderingService,
                private componentFactoryResolver: ComponentFactoryResolver,
                private visibilityService: WidgetVisibilityService,
                private compiler: Compiler) {
    }

    ngOnInit() {
        const w: any = window;
        if (w.adf === undefined) {
            w.adf = {};
        }
        const originalField = this.getField();
        if (originalField) {
            const customTemplate = this.field.form.customFieldTemplates[originalField.type];
            if (customTemplate && this.hasController(originalField.type)) {
                const factory = this.getComponentFactorySync(originalField.type, customTemplate);
                this.componentRef = this.container.createComponent(factory);
                const instance: any = this.componentRef.instance;
                if (instance) {
                    instance.field = originalField;
                }
            } else {
                const componentType = this.formRenderingService.resolveComponentType(originalField);
                if (componentType) {
                    const factory = this.componentFactoryResolver.resolveComponentFactory(componentType);
                    this.componentRef = this.container.createComponent(factory);
                    const instance = <WidgetComponent> this.componentRef.instance;
                    instance.field = this.field;
                    instance.fieldChanged.subscribe((field) => {
                        if (field && this.field.form) {
                            this.visibilityService.refreshVisibility(field.form);
                            field.form.onFormFieldChanged(field);
                        }
                    });
                }
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
                return wrappedField as FormFieldModel;
            }
        }
        return this.field;
    }

    private hasController(type: string): boolean {
        return (adf && adf.components && adf.components[type]);
    }

    private getComponentFactorySync(type: string, template: string): ComponentFactory<any> {
        const componentInfo = adf.components[type];

        if (componentInfo.factory) {
            return componentInfo.factory;
        }

        const metadata = {
            selector: `runtime-component-${type}`,
            template: template
        };

        const factory = this.createComponentFactorySync(this.compiler, metadata, componentInfo.class);
        componentInfo.factory = factory;
        return factory;
    }

    private createComponentFactorySync(compiler: Compiler, metadata: Component, componentClass: any): ComponentFactory<any> {
        const cmpClass = componentClass || class RuntimeComponent {
        };
        const decoratedCmp = Component(metadata)(cmpClass);

        @NgModule({ imports: [], declarations: [decoratedCmp] })
        class RuntimeComponentModule {
        }

        const module: ModuleWithComponentFactories<any> = compiler.compileModuleAndAllComponentsSync(RuntimeComponentModule);
        return module.componentFactories.find((x) => x.componentType === decoratedCmp);
    }

    focusToggle() {
        this.focus = !this.focus;
    }
}
