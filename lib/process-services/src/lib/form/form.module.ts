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
import { MaterialModule } from '../material.module';
import { CoreModule } from '@alfresco/adf-core';
import { FormComponent } from './form.component';
import { StartFormComponent } from './start-form.component';
import { FormCustomOutcomesComponent } from './form-custom-outcomes.component';
import { DocumentWidgetComponent } from './widgets/document/document.widget';
import { ContentWidgetComponent } from './widgets/document/content.widget';
import { UploadWidgetComponent } from './widgets/upload/upload.widget';
import { FormListComponent } from './form-list/form-list.component';
import { FunctionalGroupWidgetComponent } from './widgets/functional-group/functional-group.widget';
import { PeopleWidgetComponent } from './widgets/people/people.widget';
import { RadioButtonsWidgetComponent } from './widgets/radio-buttons/radio-buttons.widget';
import { TypeaheadWidgetComponent } from './widgets/typeahead/typeahead.widget';
import { DropdownWidgetComponent } from './widgets/dropdown/dropdown.widget';
import { DynamicTableModule } from './widgets/dynamic-table/dynamic-table.module';
import { FileViewerWidgetComponent } from './widgets/file-viewer/file-viewer.widget';
import { AlfrescoViewerModule } from '@alfresco/adf-content-services';

@NgModule({
    imports: [
        DynamicTableModule,
        CoreModule,
        AlfrescoViewerModule,
        MaterialModule
    ],
    declarations: [
        UploadWidgetComponent,
        FormComponent,
        StartFormComponent,
        FormCustomOutcomesComponent,
        DocumentWidgetComponent,
        ContentWidgetComponent,
        PeopleWidgetComponent,
        FunctionalGroupWidgetComponent,
        FormListComponent,
        RadioButtonsWidgetComponent,
        DropdownWidgetComponent,
        TypeaheadWidgetComponent,
        FileViewerWidgetComponent
    ],
    exports: [
        FormComponent,
        StartFormComponent,
        FormCustomOutcomesComponent,
        PeopleWidgetComponent,
        FunctionalGroupWidgetComponent,
        RadioButtonsWidgetComponent,
        TypeaheadWidgetComponent,
        DropdownWidgetComponent,
        FormListComponent,
        FileViewerWidgetComponent
    ]
})
export class FormModule {
}
