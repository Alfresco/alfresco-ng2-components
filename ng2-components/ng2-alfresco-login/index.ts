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

import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CoreModule, TRANSLATION_PROVIDER } from 'ng2-alfresco-core';

import { LoginComponent } from './src/components/login.component';
import { LoginFooterDirective } from './src/directives/login-footer.directive';
import { LoginHeaderDirective } from './src/directives/login-header.directive';
import { MaterialModule } from './src/material.module';

export { LoginHeaderDirective } from './src/directives/login-header.directive';
export { LoginFooterDirective } from './src/directives/login-footer.directive';
export { LoginComponent } from './src/components/login.component';

export { LoginErrorEvent } from './src/models/login-error.event';
export { LoginSubmitEvent } from './src/models/login-submit.event';
export { LoginSuccessEvent } from './src/models/login-success.event';

export function declarations() {
    return [
        LoginComponent,
        LoginFooterDirective,
        LoginHeaderDirective
    ];
}

@NgModule({
    imports: [
        RouterModule,
        CoreModule,
        MaterialModule
    ],
    declarations: declarations(),
    providers: [
        {
            provide: TRANSLATION_PROVIDER,
            multi: true,
            useValue: {
                name: 'ng2-alfresco-login',
                source: 'assets/ng2-alfresco-login'
            }
        }
    ],
    exports: [
        ...declarations(),
        MaterialModule
    ]
})
export class LoginModule {}
