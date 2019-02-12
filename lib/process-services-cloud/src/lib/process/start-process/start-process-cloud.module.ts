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
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '../../material.module';
import { StartProcessCloudComponent } from './components/start-process-cloud.component';
import { StartProcessCloudService } from './services/start-process-cloud.service';
import { CoreModule } from '@alfresco/adf-core';
@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        MaterialModule,
        FlexLayoutModule,
        ReactiveFormsModule,
        CoreModule.forChild()
    ],
    declarations: [
        StartProcessCloudComponent
    ],
    exports: [
        StartProcessCloudComponent
    ],
    providers: [
        StartProcessCloudService
    ]
})
export class StartProcessCloudModule { }
