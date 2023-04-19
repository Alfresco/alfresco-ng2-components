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

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RichTextEditorComponent } from './rich-text-editor.component';
import { ContentModule } from '@alfresco/adf-content-services';
import { RichTextEditorModule } from '@alfresco/adf-process-services-cloud';
import { CoreModule } from '@alfresco/adf-core';
import { RouterModule, Routes } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';

const routes: Routes = [
    {
        path: '',
        component: RichTextEditorComponent
    }
];

@NgModule({
    declarations: [RichTextEditorComponent],
    imports: [
        CommonModule,
        CoreModule,
        RouterModule.forChild(routes),
        ContentModule.forChild(),
        FlexLayoutModule,
        RichTextEditorModule
    ]
})
export class AppRichTextEditorModule { }
