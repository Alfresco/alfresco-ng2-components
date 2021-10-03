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
import { ExtensionsModule, ExtensionService } from '@alfresco/adf-extensions';
import { ProcessServicesCloudModule } from '@alfresco/adf-process-services-cloud';
import { ProcessListExtensionPresetsComponent } from './process-list-extension-presets.component';
import { ProcessStatusComponent } from './custom-process-columns/process-status.component';
import { ProcessNameComponent } from './custom-process-columns/process-name.component';
import { MatChipsModule } from '@angular/material/chips';

const routes: Routes = [
    {
        path: '',
        component: ProcessListExtensionPresetsComponent
    }
];

@NgModule({
    imports: [
        CommonModule,
        CoreModule,
        RouterModule.forChild(routes),
        ContentModule.forChild(),
        ProcessServicesCloudModule.forChild(),
        ExtensionsModule,
        MatChipsModule
    ],
    declarations: [
        ProcessListExtensionPresetsComponent,
        ProcessNameComponent,
        ProcessStatusComponent
    ]
})
export class ProcessExtensionPresetsModule {
    constructor(extensionService: ExtensionService) {
        extensionService.setComponents({
            'app.processList.columns.name': ProcessNameComponent,
            'app.processList.columns.status': ProcessStatusComponent
        });
    }
}
