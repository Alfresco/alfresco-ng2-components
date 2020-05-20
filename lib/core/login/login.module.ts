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

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '../material.module';

import { LoginComponent } from './components/login.component';
import { LoginFooterDirective } from './directives/login-footer.directive';
import { LoginHeaderDirective } from './directives/login-header.directive';
import { LoginDialogComponent } from './components/login-dialog.component';
import { LoginDialogPanelComponent } from './components/login-dialog-panel.component';

@NgModule({
    imports: [
        RouterModule,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        TranslateModule
    ],
    declarations: [
        LoginComponent,
        LoginFooterDirective,
        LoginHeaderDirective,
        LoginDialogComponent,
        LoginDialogPanelComponent
    ],
    entryComponents: [LoginDialogComponent, LoginDialogPanelComponent],
    exports: [
        LoginComponent,
        LoginFooterDirective,
        LoginHeaderDirective,
        LoginDialogComponent,
        LoginDialogPanelComponent
    ]
})
export class LoginModule {
}
