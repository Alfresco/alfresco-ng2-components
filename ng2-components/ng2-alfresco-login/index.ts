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

import { AlfrescoLoginComponent } from './src/components/alfresco-login.component';

export * from './src/components/alfresco-login.component';

export const ALFRESCO_LOGIN_DIRECTIVES: any[] = [
    AlfrescoLoginComponent
];

@NgModule({
    imports: [
        CoreModule
    ],
    declarations: [
        ...ALFRESCO_LOGIN_DIRECTIVES
    ],
    providers: [],
    exports: [
        ...ALFRESCO_LOGIN_DIRECTIVES
    ]
})
export class LoginModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: LoginModule
        };
    }
}
