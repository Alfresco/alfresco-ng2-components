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

import { CoreModule } from 'ng2-alfresco-core';

import { FormRenderingService } from './../../services/form-rendering.service';
import { WidgetVisibilityService } from './../../services/widget-visibility.service';
import { FormFieldModel } from './../widgets/core/index';
import { WidgetComponent } from './../widgets/widget.component';

declare var adf: any;

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
                private visibilityService: WidgetVisibilityService,
                private compiler: Compiler) {
    }

    ngOnInit() {
        let originalField = this.getField();
        if (originalField) {
            let customTemplate = this.field.form.customFieldTemplates[originalField.type];
            if (customTemplate && this.hasController(originalField.type)) {
                let factory = this.getComponentFactorySync(originalField.type, customTemplate);
                this.componentRef = this.container.createComponent(factory);
                let instance: any = this.componentRef.instance;
                if (instance) {
                    instance.field = originalField;
                }
            } else {
                let componentType = this.formRenderingService.resolveComponentType(originalField);
                if (componentType) {
                    let factory = this.componentFactoryResolver.resolveComponentFactory(componentType);
                    this.componentRef = this.container.createComponent(factory);
                    let instance = <WidgetComponent> this.componentRef.instance;
                    instance.field = this.field;
                    instance.fieldChanged.subscribe(field => {
                        if (field && this.field.form) {
                            this.visibilityService.refreshVisibility(this.field.form);
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

    private getField() {
        return (this.field.params && this.field.params.field) ? this.field.params.field : this.field;
    }

    private hasController(type: string): boolean {
        return (adf && adf.components && adf.components[type]);
    }

    private getComponentFactorySync(type: string, template: string): ComponentFactory<any> {
        let componentInfo = adf.components[type];

        if (componentInfo.factory) {
            return componentInfo.factory;
        }

        let metadata = {
            selector: `runtime-component-${type}`,
            template: template
        };

        let factory = this.createComponentFactorySync(this.compiler, metadata, componentInfo.class);
        componentInfo.factory = factory;
        return factory;
    }

    private createComponentFactorySync(compiler: Compiler, metadata: Component, componentClass: any): ComponentFactory<any> {
        const cmpClass = componentClass || class RuntimeComponent {
        };
        const decoratedCmp = Component(metadata)(cmpClass);

        @NgModule({ imports: [CoreModule], declarations: [decoratedCmp] })
        class RuntimeComponentModule {
        }

        let module: ModuleWithComponentFactories<any> = compiler.compileModuleAndAllComponentsSync(RuntimeComponentModule);
        return module.componentFactories.find(x => x.componentType === decoratedCmp);
    }

    focusToggle() {
        this.focus = !this.focus;
    }
}
