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
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { MaterialModule } from '../material.module';

import { VersionUploadComponent } from './version-upload.component';
import { VersionManagerComponent } from './version-manager.component';
import { VersionListComponent } from './version-list.component';
import { UploadModule } from '../upload/upload.module';
import { VersionCompatibilityModule } from '../version-compatibility/version-compatibility.module';
import { CoreModule } from '@alfresco/adf-core';
import { VersionComparisonComponent } from './version-comparison.component';

@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        CoreModule,
        UploadModule,
        VersionCompatibilityModule,
        FormsModule
    ],
    exports: [
        VersionUploadComponent,
        VersionManagerComponent,
        VersionListComponent,
        FormsModule,
        VersionComparisonComponent
    ],
    declarations: [
        VersionUploadComponent,
        VersionManagerComponent,
        VersionListComponent,
        VersionComparisonComponent
    ]
})
export class VersionManagerModule {}
