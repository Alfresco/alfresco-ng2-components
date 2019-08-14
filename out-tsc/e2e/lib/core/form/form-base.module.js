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
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("@angular/common");
var forms_1 = require("@angular/forms");
var core_1 = require("@angular/core");
var core_2 = require("@ngx-translate/core");
var datatable_module_1 = require("../datatable/datatable.module");
var data_column_module_1 = require("../data-column/data-column.module");
var pipe_module_1 = require("../pipes/pipe.module");
var http_1 = require("@angular/common/http");
var material_module_1 = require("../material.module");
var index_1 = require("./components/widgets/index");
var form_custom_button_directive_1 = require("./components/form-custom-button.directive");
var form_field_component_1 = require("./components/form-field/form-field.component");
var form_list_component_1 = require("./components/form-list.component");
var content_widget_1 = require("./components/widgets/content/content.widget");
var widget_component_1 = require("./components/widgets/widget.component");
var core_3 = require("@mat-datetimepicker/core");
var form_renderer_component_1 = require("./components/form-renderer.component");
var FormBaseModule = /** @class */ (function () {
    function FormBaseModule() {
    }
    FormBaseModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule,
                datatable_module_1.DataTableModule,
                http_1.HttpClientModule,
                material_module_1.MaterialModule,
                core_2.TranslateModule.forChild(),
                forms_1.FormsModule,
                forms_1.ReactiveFormsModule,
                data_column_module_1.DataColumnModule,
                pipe_module_1.PipeModule,
                core_3.MatDatetimepickerModule,
                core_3.MatNativeDatetimeModule
            ],
            declarations: [
                content_widget_1.ContentWidgetComponent,
                form_field_component_1.FormFieldComponent,
                form_list_component_1.FormListComponent,
                form_renderer_component_1.FormRendererComponent,
                form_custom_button_directive_1.StartFormCustomButtonDirective
            ].concat(index_1.WIDGET_DIRECTIVES, index_1.MASK_DIRECTIVE, [
                widget_component_1.WidgetComponent
            ]),
            entryComponents: index_1.WIDGET_DIRECTIVES.slice(),
            exports: [
                content_widget_1.ContentWidgetComponent,
                form_field_component_1.FormFieldComponent,
                form_list_component_1.FormListComponent,
                form_renderer_component_1.FormRendererComponent,
                form_custom_button_directive_1.StartFormCustomButtonDirective
            ].concat(index_1.WIDGET_DIRECTIVES)
        })
    ], FormBaseModule);
    return FormBaseModule;
}());
exports.FormBaseModule = FormBaseModule;
//# sourceMappingURL=form-base.module.js.map