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
var common_1 = require("@angular/common");
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var core_2 = require("@ngx-translate/core");
var material_module_1 = require("./material.module");
var about_module_1 = require("./about/about.module");
var app_config_module_1 = require("./app-config/app-config.module");
var card_view_module_1 = require("./card-view/card-view.module");
var context_menu_module_1 = require("./context-menu/context-menu.module");
var data_column_module_1 = require("./data-column/data-column.module");
var datatable_module_1 = require("./datatable/datatable.module");
var info_drawer_module_1 = require("./info-drawer/info-drawer.module");
var language_menu_module_1 = require("./language-menu/language-menu.module");
var login_module_1 = require("./login/login.module");
var pagination_module_1 = require("./pagination/pagination.module");
var host_settings_module_1 = require("./settings/host-settings.module");
var toolbar_module_1 = require("./toolbar/toolbar.module");
var userinfo_module_1 = require("./userinfo/userinfo.module");
var viewer_module_1 = require("./viewer/viewer.module");
var form_base_module_1 = require("./form/form-base.module");
var layout_module_1 = require("./layout/layout.module");
var comments_module_1 = require("./comments/comments.module");
var buttons_menu_module_1 = require("./buttons-menu/buttons-menu.module");
var template_module_1 = require("./templates/template.module");
var clipboard_module_1 = require("./clipboard/clipboard.module");
var notification_history_module_1 = require("./notification-history/notification-history.module");
var directive_module_1 = require("./directives/directive.module");
var dialog_module_1 = require("./dialogs/dialog.module");
var pipe_module_1 = require("./pipes/pipe.module");
var alfresco_api_service_1 = require("./services/alfresco-api.service");
var translation_service_1 = require("./services/translation.service");
var startup_service_factory_1 = require("./services/startup-service-factory");
var sorting_picker_module_1 = require("./sorting-picker/sorting-picker.module");
var icon_module_1 = require("./icon/icon.module");
var translate_loader_service_1 = require("./services/translate-loader.service");
var adf_extensions_1 = require("@alfresco/adf-extensions");
var directionality_config_factory_1 = require("./services/directionality-config-factory");
var directionality_config_service_1 = require("./services/directionality-config.service");
var CoreModule = /** @class */ (function () {
    function CoreModule(translation) {
        translation.addTranslationFolder('adf-core', 'assets/adf-core');
    }
    CoreModule_1 = CoreModule;
    CoreModule.forRoot = function () {
        return {
            ngModule: CoreModule_1,
            providers: [
                core_2.TranslateStore,
                core_2.TranslateService,
                { provide: core_2.TranslateLoader, useClass: translate_loader_service_1.TranslateLoaderService },
                {
                    provide: core_1.APP_INITIALIZER,
                    useFactory: startup_service_factory_1.startupServiceFactory,
                    deps: [
                        alfresco_api_service_1.AlfrescoApiService
                    ],
                    multi: true
                },
                {
                    provide: core_1.APP_INITIALIZER,
                    useFactory: directionality_config_factory_1.directionalityConfigFactory,
                    deps: [directionality_config_service_1.DirectionalityConfigService],
                    multi: true
                }
            ]
        };
    };
    CoreModule.forChild = function () {
        return {
            ngModule: CoreModule_1
        };
    };
    var CoreModule_1;
    CoreModule = CoreModule_1 = __decorate([
        core_1.NgModule({
            imports: [
                core_2.TranslateModule,
                adf_extensions_1.ExtensionsModule.forChild(),
                about_module_1.AboutModule,
                viewer_module_1.ViewerModule,
                layout_module_1.SidenavLayoutModule,
                pipe_module_1.PipeModule,
                common_1.CommonModule,
                directive_module_1.DirectiveModule,
                dialog_module_1.DialogModule,
                forms_1.FormsModule,
                forms_1.ReactiveFormsModule,
                host_settings_module_1.HostSettingsModule,
                userinfo_module_1.UserInfoModule,
                material_module_1.MaterialModule,
                app_config_module_1.AppConfigModule,
                pagination_module_1.PaginationModule,
                toolbar_module_1.ToolbarModule,
                context_menu_module_1.ContextMenuModule,
                card_view_module_1.CardViewModule,
                form_base_module_1.FormBaseModule,
                comments_module_1.CommentsModule,
                login_module_1.LoginModule,
                language_menu_module_1.LanguageMenuModule,
                info_drawer_module_1.InfoDrawerModule,
                data_column_module_1.DataColumnModule,
                datatable_module_1.DataTableModule,
                buttons_menu_module_1.ButtonsMenuModule,
                template_module_1.TemplateModule,
                icon_module_1.IconModule,
                sorting_picker_module_1.SortingPickerModule,
                notification_history_module_1.NotificationHistoryModule
            ],
            exports: [
                about_module_1.AboutModule,
                viewer_module_1.ViewerModule,
                layout_module_1.SidenavLayoutModule,
                pipe_module_1.PipeModule,
                common_1.CommonModule,
                directive_module_1.DirectiveModule,
                dialog_module_1.DialogModule,
                clipboard_module_1.ClipboardModule,
                forms_1.FormsModule,
                forms_1.ReactiveFormsModule,
                host_settings_module_1.HostSettingsModule,
                userinfo_module_1.UserInfoModule,
                material_module_1.MaterialModule,
                app_config_module_1.AppConfigModule,
                pagination_module_1.PaginationModule,
                toolbar_module_1.ToolbarModule,
                context_menu_module_1.ContextMenuModule,
                card_view_module_1.CardViewModule,
                form_base_module_1.FormBaseModule,
                comments_module_1.CommentsModule,
                login_module_1.LoginModule,
                language_menu_module_1.LanguageMenuModule,
                info_drawer_module_1.InfoDrawerModule,
                data_column_module_1.DataColumnModule,
                datatable_module_1.DataTableModule,
                core_2.TranslateModule,
                buttons_menu_module_1.ButtonsMenuModule,
                template_module_1.TemplateModule,
                sorting_picker_module_1.SortingPickerModule,
                icon_module_1.IconModule,
                notification_history_module_1.NotificationHistoryModule
            ]
        }),
        __metadata("design:paramtypes", [translation_service_1.TranslationService])
    ], CoreModule);
    return CoreModule;
}());
exports.CoreModule = CoreModule;
//# sourceMappingURL=core.module.js.map