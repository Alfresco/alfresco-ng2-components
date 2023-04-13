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

import { UploadModule } from '../upload/upload.module';
import { CoreModule } from '@alfresco/adf-core';
import { VersionManagerModule } from '../version-manager';
import { NewVersionUploaderDialogComponent } from './new-version-uploader.dialog';


@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        CoreModule,
        UploadModule,
        FormsModule,
        VersionManagerModule
    ],
    declarations: [
        NewVersionUploaderDialogComponent
    ],
    exports: [
        NewVersionUploaderDialogComponent,
        FormsModule
    ]
})
export class NewVersionUploaderModule { }
