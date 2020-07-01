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

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CoreModule } from '@alfresco/adf-core';
import { ContentModule } from '@alfresco/adf-content-services';
import { ExtensionPresetsComponent } from './extension-presets.component';
import { ExtensionsModule, ExtensionService } from '@alfresco/adf-extensions';
import { NameColumnComponent } from './name-column/name-column.component';

const routes: Routes = [
    {
      path: '',
      component: ExtensionPresetsComponent
    }
];

@NgModule({
    imports: [
        CommonModule,
        CoreModule,
        RouterModule.forChild(routes),
        ContentModule.forChild(),
        ExtensionsModule
    ],
    declarations: [
        ExtensionPresetsComponent,
        NameColumnComponent
    ]
})
export class ExtensionPresetsModule {
    constructor(extensionService: ExtensionService) {
        extensionService.setComponents({
            'app.columns.name': NameColumnComponent
        });
    }
}
