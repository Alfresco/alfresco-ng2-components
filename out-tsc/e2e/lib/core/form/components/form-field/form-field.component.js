"use strict";
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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var form_rendering_service_1 = require("./../../services/form-rendering.service");
var widget_visibility_service_1 = require("./../../services/widget-visibility.service");
var form_field_model_1 = require("./../widgets/core/form-field.model");
var FormFieldComponent = /** @class */ (function () {
    function FormFieldComponent(formRenderingService, componentFactoryResolver, visibilityService, compiler) {
        this.formRenderingService = formRenderingService;
        this.componentFactoryResolver = componentFactoryResolver;
        this.visibilityService = visibilityService;
        this.compiler = compiler;
        /** Contains all the necessary data needed to determine what UI Widget
         * to use when rendering the field in the form. You would typically not
         * create this data manually but instead create the form in APS and export
         * it to get to all the `FormFieldModel` definitions.
         */
        this.field = null;
        this.focus = false;
    }
    FormFieldComponent.prototype.ngOnInit = function () {
        var _this = this;
        var w = window;
        if (w.adf === undefined) {
            w.adf = {};
        }
        var originalField = this.getField();
        if (originalField) {
            var customTemplate = this.field.form.customFieldTemplates[originalField.type];
            if (customTemplate && this.hasController(originalField.type)) {
                var factory = this.getComponentFactorySync(originalField.type, customTemplate);
                this.componentRef = this.container.createComponent(factory);
                var instance = this.componentRef.instance;
                if (instance) {
                    instance.field = originalField;
                }
            }
            else {
                var componentType = this.formRenderingService.resolveComponentType(originalField);
                if (componentType) {
                    var factory = this.componentFactoryResolver.resolveComponentFactory(componentType);
                    this.componentRef = this.container.createComponent(factory);
                    var instance = this.componentRef.instance;
                    instance.field = this.field;
                    instance.fieldChanged.subscribe(function (field) {
                        if (field && _this.field.form) {
                            _this.visibilityService.refreshVisibility(field.form);
                            field.form.onFormFieldChanged(field);
                        }
                    });
                }
            }
        }
    };
    FormFieldComponent.prototype.ngOnDestroy = function () {
        if (this.componentRef) {
            this.componentRef.destroy();
            this.componentRef = null;
        }
    };
    FormFieldComponent.prototype.getField = function () {
        if (this.field && this.field.params) {
            var wrappedField = this.field.params.field;
            if (wrappedField && wrappedField.type) {
                return wrappedField;
            }
        }
        return this.field;
    };
    FormFieldComponent.prototype.hasController = function (type) {
        return (adf && adf.components && adf.components[type]);
    };
    FormFieldComponent.prototype.getComponentFactorySync = function (type, template) {
        var componentInfo = adf.components[type];
        if (componentInfo.factory) {
            return componentInfo.factory;
        }
        var metadata = {
            selector: "runtime-component-" + type,
            template: template
        };
        var factory = this.createComponentFactorySync(this.compiler, metadata, componentInfo.class);
        componentInfo.factory = factory;
        return factory;
    };
    FormFieldComponent.prototype.createComponentFactorySync = function (compiler, metadata, componentClass) {
        var cmpClass = componentClass || /** @class */ (function () {
            function RuntimeComponent() {
            }
            return RuntimeComponent;
        }());
        var decoratedCmp = core_1.Component(metadata)(cmpClass);
        var RuntimeComponentModule = /** @class */ (function () {
            function RuntimeComponentModule() {
            }
            RuntimeComponentModule = __decorate([
                core_1.NgModule({ imports: [], declarations: [decoratedCmp] })
            ], RuntimeComponentModule);
            return RuntimeComponentModule;
        }());
        var module = compiler.compileModuleAndAllComponentsSync(RuntimeComponentModule);
        return module.componentFactories.find(function (x) { return x.componentType === decoratedCmp; });
    };
    FormFieldComponent.prototype.focusToggle = function () {
        this.focus = !this.focus;
    };
    __decorate([
        core_1.ViewChild('container', { read: core_1.ViewContainerRef }),
        __metadata("design:type", core_1.ViewContainerRef)
    ], FormFieldComponent.prototype, "container", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", form_field_model_1.FormFieldModel)
    ], FormFieldComponent.prototype, "field", void 0);
    FormFieldComponent = __decorate([
        core_1.Component({
            selector: 'adf-form-field',
            template: "\n        <div [id]=\"'field-'+field?.id+'-container'\"\n            [hidden]=\"!field?.isVisible\"\n            [class.adf-focus]=\"focus\"\n            (focusin)=\"focusToggle()\"\n            (focusout)=\"focusToggle()\">\n            <div #container></div>\n        </div>\n    ",
            encapsulation: core_1.ViewEncapsulation.None
        }),
        __metadata("design:paramtypes", [form_rendering_service_1.FormRenderingService,
            core_1.ComponentFactoryResolver,
            widget_visibility_service_1.WidgetVisibilityService,
            core_1.Compiler])
    ], FormFieldComponent);
    return FormFieldComponent;
}());
exports.FormFieldComponent = FormFieldComponent;
//# sourceMappingURL=form-field.component.js.map