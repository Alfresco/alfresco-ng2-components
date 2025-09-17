/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { LoginDialogPanelComponent } from './components/login-dialog-panel/login-dialog-panel.component';

import { LoginComponent } from './components/login/login.component';
import { LoginFooterDirective } from './directives/login-footer.directive';
import { LoginHeaderDirective } from './directives/login-header.directive';

export const LOGIN_DIRECTIVES = [LoginComponent, LoginFooterDirective, LoginHeaderDirective, LoginDialogPanelComponent] as const;

/** @deprecated use `...LOGIN_DIRECTIVES` or import the standalone directives directly */
@NgModule({
    imports: [...LOGIN_DIRECTIVES],
    exports: [...LOGIN_DIRECTIVES]
})
export class LoginModule {}
