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
import { FlexLayoutModule } from '@angular/flex-layout';
import { CoreModule } from '@alfresco/adf-core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { FormCloudComponent } from './components/form-cloud.component';
import { FormDefinitionSelectorCloudComponent } from './components/form-definition-selector-cloud.component';
import { FormCustomOutcomesComponent } from './components/form-cloud-custom-outcomes.component';
import { AlfrescoViewerModule, ContentMetadataModule, ContentNodeSelectorModule, UploadModule } from '@alfresco/adf-content-services';

import { DateCloudWidgetComponent } from './components/widgets/date/date-cloud.widget';
import { DropdownCloudWidgetComponent } from './components/widgets/dropdown/dropdown-cloud.widget';
import { GroupCloudWidgetComponent } from './components/widgets/group/group-cloud.widget';
import { PeopleCloudWidgetComponent } from './components/widgets/people/people-cloud.widget';
import { AttachFileCloudWidgetComponent } from './components/widgets/attach-file/attach-file-cloud-widget.component';

import { UploadCloudWidgetComponent } from './components/widgets/attach-file/upload-cloud.widget';
import { PeopleCloudModule } from '../people/people-cloud.module';
import { GroupCloudModule } from '../group/group-cloud.module';
import { PropertiesViewerWidgetComponent } from './components/widgets/properties-viewer/properties-viewer.widget';
import { PropertiesViewerWrapperComponent } from './components/widgets/properties-viewer/properties-viewer-wrapper/properties-viewer-wrapper.component';
import { RadioButtonsCloudWidgetComponent } from './components/widgets/radio-buttons/radio-buttons-cloud.widget';
import { FilePropertiesTableCloudComponent } from './components/widgets/attach-file/file-properties-table-cloud.component';
import { FileViewerWidgetComponent } from './components/widgets/file-viewer/file-viewer.widget';
import { RichTextEditorModule } from '../rich-text-editor';

@NgModule({
    imports: [
        CommonModule,
        FlexLayoutModule,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        CoreModule,
        ContentNodeSelectorModule,
        PeopleCloudModule,
        GroupCloudModule,
        ContentMetadataModule,
        UploadModule,
        AlfrescoViewerModule,
        RichTextEditorModule
    ],
    declarations: [
        FormCloudComponent,
        UploadCloudWidgetComponent,
        FormDefinitionSelectorCloudComponent,
        FormCustomOutcomesComponent,
        DropdownCloudWidgetComponent,
        RadioButtonsCloudWidgetComponent,
        AttachFileCloudWidgetComponent,
        DateCloudWidgetComponent,
        PeopleCloudWidgetComponent,
        GroupCloudWidgetComponent,
        PropertiesViewerWrapperComponent,
        PropertiesViewerWidgetComponent,
        FilePropertiesTableCloudComponent,
        FileViewerWidgetComponent
    ],
    exports: [
        FormCloudComponent,
        UploadCloudWidgetComponent,
        FormDefinitionSelectorCloudComponent,
        FormCustomOutcomesComponent,
        DropdownCloudWidgetComponent,
        RadioButtonsCloudWidgetComponent,
        AttachFileCloudWidgetComponent,
        DateCloudWidgetComponent,
        PeopleCloudWidgetComponent,
        GroupCloudWidgetComponent,
        PropertiesViewerWidgetComponent,
        FileViewerWidgetComponent
    ]
})
export class FormCloudModule {
}
