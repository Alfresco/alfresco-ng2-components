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
import { FlexLayoutModule } from '@angular/flex-layout';
import { TemplateModule, FormBaseModule, PipeModule, CoreModule, FormRenderingService } from '@alfresco/adf-core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { FormCloudComponent } from './components/form-cloud.component';
import { FormDefinitionSelectorCloudComponent } from './components/form-definition-selector-cloud.component';
import { FormCustomOutcomesComponent } from './components/form-cloud-custom-outcomes.component';
import { ContentNodeSelectorModule } from '@alfresco/adf-content-services';

import { DateCloudWidgetComponent } from './components/widgets/date/date-cloud.widget';
import { DropdownCloudWidgetComponent } from './components/widgets/dropdown/dropdown-cloud.widget';
import { GroupCloudWidgetComponent } from './components/widgets/group/group-cloud.widget';
import { PeopleCloudWidgetComponent } from './components/widgets/people/people-cloud.widget';
import { AttachFileCloudWidgetComponent } from './components/widgets/attach-file/attach-file-cloud-widget.component';

import { UploadCloudWidgetComponent } from './components/widgets/attach-file/upload-cloud.widget';
import { PeopleCloudModule } from '../people/people-cloud.module';
import { GroupCloudModule } from '../group/group-cloud.module';

@NgModule({
    imports: [
        CommonModule,
        PipeModule,
        TemplateModule,
        FlexLayoutModule,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        FormBaseModule,
        CoreModule,
        ContentNodeSelectorModule,
        PeopleCloudModule,
        GroupCloudModule
    ],
    declarations: [
        FormCloudComponent,
        UploadCloudWidgetComponent,
        FormDefinitionSelectorCloudComponent,
        FormCustomOutcomesComponent,
        DropdownCloudWidgetComponent,
        AttachFileCloudWidgetComponent,
        DateCloudWidgetComponent,
        PeopleCloudWidgetComponent,
        GroupCloudWidgetComponent
    ],
    entryComponents: [
        UploadCloudWidgetComponent,
        DropdownCloudWidgetComponent,
        AttachFileCloudWidgetComponent,
        DateCloudWidgetComponent,
        PeopleCloudWidgetComponent,
        GroupCloudWidgetComponent
    ],
    exports: [
        FormCloudComponent,
        UploadCloudWidgetComponent,
        FormDefinitionSelectorCloudComponent,
        FormCustomOutcomesComponent,
        AttachFileCloudWidgetComponent
    ]
})
export class FormCloudModule {
    constructor(formRenderingService: FormRenderingService) {
        formRenderingService.setComponentTypeResolver('upload', () => AttachFileCloudWidgetComponent, true);
        formRenderingService.setComponentTypeResolver('dropdown', () => DropdownCloudWidgetComponent, true);
        formRenderingService.setComponentTypeResolver('date', () => DateCloudWidgetComponent, true);
        formRenderingService.setComponentTypeResolver('people', () => PeopleCloudWidgetComponent, true);
        formRenderingService.setComponentTypeResolver('functional-group', () => GroupCloudWidgetComponent, true);
    }
}
