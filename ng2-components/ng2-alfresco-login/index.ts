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

import { NgModule, ModuleWithProviders } from '@angular/core';
import { CoreModule } from 'ng2-alfresco-core';
import { MdInputModule, MdIconModule, MdCheckboxModule, MdProgressSpinnerModule } from '@angular/material';

import { LoginHeaderDirective } from './src/directives/login-header.directive';
import { LoginFooterDirective } from './src/directives/login-footer.directive';

import { AlfrescoLoginComponent } from './src/components/alfresco-login.component';

export * from './src/directives/login-header.directive';
export * from './src/directives/login-footer.directive';
export * from './src/components/alfresco-login.component';

export const ALFRESCO_LOGIN_DIRECTIVES: any[] = [
    AlfrescoLoginComponent,
    LoginFooterDirective,
    LoginHeaderDirective
];

@NgModule({
    imports: [
        CoreModule,
        MdInputModule,
        MdIconModule,
        MdCheckboxModule,
        MdProgressSpinnerModule
    ],
    declarations: [
        ...ALFRESCO_LOGIN_DIRECTIVES
    ],
    providers: [],
    exports: [
        ...ALFRESCO_LOGIN_DIRECTIVES,
        MdInputModule,
        MdIconModule,
        MdCheckboxModule
    ]
})
export class LoginModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: LoginModule
        };
    }
}
