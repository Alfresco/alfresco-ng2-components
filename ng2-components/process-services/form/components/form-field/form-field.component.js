"use strict";
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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var core_2 = require("@adf/core");
var FormFieldComponent = (function () {
    function FormFieldComponent(formRenderingService, componentFactoryResolver, visibilityService, compiler) {
        this.formRenderingService = formRenderingService;
        this.componentFactoryResolver = componentFactoryResolver;
        this.visibilityService = visibilityService;
        this.compiler = compiler;
        this.field = null;
        this.focus = false;
    }
    FormFieldComponent.prototype.ngOnInit = function () {
        var _this = this;
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
                            _this.visibilityService.refreshVisibility(_this.field.form);
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
        var cmpClass = componentClass || (function () {
            function RuntimeComponent() {
            }
            return RuntimeComponent;
        }());
        var decoratedCmp = core_1.Component(metadata)(cmpClass);
        var RuntimeComponentModule = (function () {
            function RuntimeComponentModule() {
            }
            RuntimeComponentModule = __decorate([
                core_1.NgModule({ imports: [core_2.ServicesModule], declarations: [decoratedCmp] })
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
        core_1.ViewChild('container', { read: core_1.ViewContainerRef })
    ], FormFieldComponent.prototype, "container", void 0);
    __decorate([
        core_1.Input()
    ], FormFieldComponent.prototype, "field", void 0);
    FormFieldComponent = __decorate([
        core_1.Component({
            selector: 'adf-form-field, form-field',
            template: "\n        <div [hidden]=\"!field?.isVisible\"\n            [class.adf-focus]=\"focus\"\n            (focusin)=\"focusToggle()\"\n            (focusout)=\"focusToggle()\">\n            <div #container></div>\n        </div>\n    ",
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], FormFieldComponent);
    return FormFieldComponent;
}());
exports.FormFieldComponent = FormFieldComponent;
