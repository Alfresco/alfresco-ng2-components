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
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '../material.module';
import { DataTableModule } from '../datatable/datatable.module';
import { DataColumnModule } from '../data-column/data-column.module';
import { AboutApplicationModulesComponent } from './about-application-modules/about-application-modules.component';
import { AboutProductVersionComponent } from './about-product-version/about-product-version.component';
import { AboutGithubLinkComponent } from './about-github-link/about-github-link.component';

@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        TranslateModule,
        DataTableModule,
        DataColumnModule
    ],
    declarations: [
        AboutApplicationModulesComponent,
        AboutProductVersionComponent,
        AboutGithubLinkComponent
    ],
    exports: [
        AboutApplicationModulesComponent,
        AboutProductVersionComponent,
        AboutGithubLinkComponent
    ]
})
export class AboutModule {}
