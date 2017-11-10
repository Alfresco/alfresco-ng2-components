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
import { TRANSLATION_PROVIDER } from '../services';
import { MaterialModule } from '../material.module';

import { LoginComponent } from './components/login.component';
import { LoginFooterDirective } from './directives/login-footer.directive';
import { LoginHeaderDirective } from './directives/login-header.directive';

@NgModule({
    imports: [
        RouterModule,
        MaterialModule
    ],
    declarations: [
        LoginComponent,
        LoginFooterDirective,
        LoginHeaderDirective
    ],
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
        [
            LoginComponent,
            LoginFooterDirective,
            LoginHeaderDirective
        ]
    ]
})
export class LoginModule {
}
