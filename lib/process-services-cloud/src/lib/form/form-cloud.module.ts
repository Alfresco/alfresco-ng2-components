/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { FormCloudComponent } from './components/form-cloud.component';
import { FormCustomOutcomesComponent } from './components/form-cloud-custom-outcomes.component';
import { GroupCloudWidgetComponent } from './components/widgets/group/group-cloud.widget';
import { PeopleCloudWidgetComponent } from './components/widgets/people/people-cloud.widget';
import { AttachFileCloudWidgetComponent } from './components/widgets/attach-file/attach-file-cloud-widget.component';
import { UploadCloudWidgetComponent } from './components/widgets/upload/upload-cloud.widget';
import { PropertiesViewerWidgetComponent } from './components/widgets/properties-viewer/properties-viewer.widget';
import { PropertiesViewerWrapperComponent } from './components/widgets/properties-viewer/properties-viewer-wrapper/properties-viewer-wrapper.component';
import { RadioButtonsCloudWidgetComponent } from './components/widgets/radio-buttons/radio-buttons-cloud.widget';
import { FilePropertiesTableCloudComponent } from './components/widgets/attach-file/file-properties-table/file-properties-table-cloud.component';
import { FileViewerWidgetComponent } from './components/widgets/file-viewer/file-viewer.widget';
import { DisplayRichTextWidgetComponent } from './components/widgets/display-rich-text/display-rich-text.widget';
import { FormSpinnerComponent } from './components/spinner/form-spinner.component';

export const FORM_CLOUD_DIRECTIVES = [
    FormSpinnerComponent,
    PropertiesViewerWrapperComponent,
    PropertiesViewerWidgetComponent,
    DisplayRichTextWidgetComponent,
    FileViewerWidgetComponent,
    FilePropertiesTableCloudComponent,
    FormCustomOutcomesComponent,
    RadioButtonsCloudWidgetComponent,
    AttachFileCloudWidgetComponent,
    UploadCloudWidgetComponent,
    PeopleCloudWidgetComponent,
    GroupCloudWidgetComponent,
    FormCloudComponent
] as const;

/** @deprecated use ...FORM_CLOUD_DIRECTIVES instead */
@NgModule({
    imports: [...FORM_CLOUD_DIRECTIVES],
    exports: [...FORM_CLOUD_DIRECTIVES]
})
export class FormCloudModule {}
