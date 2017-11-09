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
var ng2_alfresco_core_1 = require("ng2-alfresco-core");
var material_module_1 = require("../material.module");
var user_info_component_1 = require("./components/user-info.component");
var bpm_user_service_1 = require("./services/bpm-user.service");
var ecm_user_service_1 = require("./services/ecm-user.service");
exports.USER_INFO_DIRECTIVES = [
    user_info_component_1.UserInfoComponent
];
exports.USER_INFO_PROVIDERS = [
    ecm_user_service_1.EcmUserService,
    bpm_user_service_1.BpmUserService
];
var UserInfoModule = (function () {
    function UserInfoModule() {
    }
    UserInfoModule = __decorate([
        core_1.NgModule({
            imports: [
                ng2_alfresco_core_1.CoreModule,
                material_module_1.MaterialModule
            ],
            declarations: exports.USER_INFO_DIRECTIVES.slice(),
            providers: exports.USER_INFO_PROVIDERS.concat([
                {
                    provide: ng2_alfresco_core_1.TRANSLATION_PROVIDER,
                    multi: true,
                    useValue: {
                        name: 'ng2-alfresco-userinfo',
                        source: 'assets/ng2-alfresco-userinfo'
                    }
                }
            ]),
            exports: exports.USER_INFO_DIRECTIVES.slice()
        })
    ], UserInfoModule);
    return UserInfoModule;
}());
exports.UserInfoModule = UserInfoModule;
