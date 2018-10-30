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
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '../../material.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TemplateModule, TranslateLoaderService, FormModule } from '@alfresco/adf-core';
import { StartTaskCloudComponent } from '../components/start-task-cloud.component';
import { StartTaskCloudService } from '../services/start-task-cloud.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PeopleCloudComponent } from '../components/people-cloud/people-cloud.component';
import { InitialUserNamePipe } from '../components/pipes/initial-user-name.pipe';

@NgModule({
    imports: [
        CommonModule,
        NoopAnimationsModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useClass: TranslateLoaderService
            }
        }),
        TemplateModule,
        FlexLayoutModule,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        FormModule
    ],
    declarations: [StartTaskCloudComponent, PeopleCloudComponent, InitialUserNamePipe],
    providers: [
        StartTaskCloudService
     ],
    exports: [
        StartTaskCloudComponent,
        PeopleCloudComponent,
        InitialUserNamePipe
    ]
})
export class StartTaskCloudTestingModule { }
