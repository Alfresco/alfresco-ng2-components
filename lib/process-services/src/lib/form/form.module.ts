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
import { MaterialModule } from '../material.module';
import { CoreModule, FormRenderingService } from '@alfresco/adf-core';
import { FormComponent } from './form.component';
import { StartFormComponent } from './start-form.component';
import { AttachFileWidgetComponent } from '../content-widget/attach-file-widget.component';
import { AttachFolderWidgetComponent } from '../content-widget/attach-folder-widget.component';

@NgModule({
    imports: [
        CoreModule,
        MaterialModule
    ],
    declarations: [
        FormComponent,
        StartFormComponent
    ],
    exports: [
        FormComponent,
        StartFormComponent
    ]
})
export class FormModule {
    constructor(formRenderingService: FormRenderingService) {
        formRenderingService.setComponentTypeResolver('upload', () => AttachFileWidgetComponent, true);
        formRenderingService.setComponentTypeResolver('select-folder', () => AttachFolderWidgetComponent, true);
    }
}
