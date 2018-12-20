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
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '../material.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TemplateModule, TranslateLoaderService, FormModule, PipeModule } from '@alfresco/adf-core';
import { GroupCloudComponent } from './components/group-cloud.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    PipeModule,
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
    declarations: [GroupCloudComponent],
    exports: [GroupCloudComponent]
})
export class GroupCloudModule { }
