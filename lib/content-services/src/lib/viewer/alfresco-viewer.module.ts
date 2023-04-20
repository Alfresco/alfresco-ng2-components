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
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ExtensionsModule } from '@alfresco/adf-extensions';

import { MaterialModule } from '../material.module';
import { A11yModule } from '@angular/cdk/a11y';
import { AlfrescoViewerComponent } from './components/alfresco-viewer.component';
import { CoreModule } from '@alfresco/adf-core';
import { ContentDirectiveModule } from '../directives';

@NgModule({
    imports: [
        CoreModule,
        CommonModule,
        MaterialModule,
        TranslateModule,
        FormsModule,
        ReactiveFormsModule,
        FlexLayoutModule,
        A11yModule,
        ExtensionsModule,
        ContentDirectiveModule
    ],
    declarations: [
        AlfrescoViewerComponent
    ],
    exports: [
        AlfrescoViewerComponent
    ]
})
export class AlfrescoViewerModule {
}
