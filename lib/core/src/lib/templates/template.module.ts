/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { TranslateModule } from '@ngx-translate/core';
import { ErrorContentComponent } from './error-content/error-content.component';
import { EmptyContentComponent } from './empty-content/empty-content.component';
import { IconModule } from '../icon/icon.module';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
    imports: [CommonModule, TranslateModule, IconModule],
    declarations: [ErrorContentComponent, EmptyContentComponent],
    exports: [ErrorContentComponent, EmptyContentComponent, MatButtonModule]
})
export class TemplateModule {}
