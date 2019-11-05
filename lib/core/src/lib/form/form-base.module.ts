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

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { DataTableModule } from '../datatable/datatable.module';
import { DataColumnModule } from '../data-column/data-column.module';
import { PipeModule } from '../pipes/pipe.module';
import { HttpClientModule } from '@angular/common/http';

import { MaterialModule } from '../material.module';

import { MASK_DIRECTIVE, WIDGET_DIRECTIVES } from './components/widgets/index';

import { StartFormCustomButtonDirective } from './components/form-custom-button.directive';

import { FormFieldComponent } from './components/form-field/form-field.component';
import { FormListComponent } from './components/form-list.component';
import { ContentWidgetComponent } from './components/widgets/content/content.widget';
import { WidgetComponent } from './components/widgets/widget.component';
import { MatDatetimepickerModule, MatNativeDatetimeModule } from '@mat-datetimepicker/core';
import { FormRendererComponent } from './components/form-renderer.component';
import { EditJsonDialogModule } from '../dialogs/edit-json/edit-json.dialog.module';

@NgModule({
    imports: [
        CommonModule,
        DataTableModule,
        HttpClientModule,
        MaterialModule,
        TranslateModule,
        FormsModule,
        ReactiveFormsModule,
        DataColumnModule,
        PipeModule,
        MatDatetimepickerModule,
        MatNativeDatetimeModule,
        EditJsonDialogModule
    ],
    declarations: [
        ContentWidgetComponent,
        FormFieldComponent,
        FormListComponent,
        FormRendererComponent,
        StartFormCustomButtonDirective,
        ...WIDGET_DIRECTIVES,
        ...MASK_DIRECTIVE,
        WidgetComponent
    ],
    entryComponents: [
        ...WIDGET_DIRECTIVES
    ],
    exports: [
        ContentWidgetComponent,
        FormFieldComponent,
        FormListComponent,
        FormRendererComponent,
        StartFormCustomButtonDirective,
        ...WIDGET_DIRECTIVES
    ]
})
export class FormBaseModule {
}
