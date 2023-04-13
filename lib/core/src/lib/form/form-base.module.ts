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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { DataTableModule } from '../datatable/datatable.module';
import { PipeModule } from '../pipes/pipe.module';
import { HttpClientModule } from '@angular/common/http';

import { MaterialModule } from '../material.module';

import { MASK_DIRECTIVE, WIDGET_DIRECTIVES } from './components/widgets';

import { StartFormCustomButtonDirective } from './components/form-custom-button.directive';

import { FormFieldComponent } from './components/form-field/form-field.component';
import { WidgetComponent } from './components/widgets/widget.component';
import { MatDatetimepickerModule, MatNativeDatetimeModule } from '@mat-datetimepicker/core';
import { FormRendererComponent } from './components/form-renderer.component';
import { EditJsonDialogModule } from '../dialogs/edit-json/edit-json.dialog.module';
import { A11yModule } from '@angular/cdk/a11y';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ViewerModule } from '../viewer/viewer.module';
import { InplaceFormInputComponent } from './components/inplace-form-input/inplace-form-input.component';

@NgModule({
    imports: [
        CommonModule,
        A11yModule,
        FlexLayoutModule,
        DataTableModule,
        HttpClientModule,
        MaterialModule,
        TranslateModule,
        FormsModule,
        ReactiveFormsModule,
        PipeModule,
        MatDatetimepickerModule,
        MatNativeDatetimeModule,
        EditJsonDialogModule,
        ViewerModule
    ],
    declarations: [
        FormFieldComponent,
        FormRendererComponent,
        StartFormCustomButtonDirective,
        ...WIDGET_DIRECTIVES,
        ...MASK_DIRECTIVE,
        WidgetComponent,
        InplaceFormInputComponent
    ],
    exports: [
        FormFieldComponent,
        FormRendererComponent,
        StartFormCustomButtonDirective,
        ...WIDGET_DIRECTIVES,
        InplaceFormInputComponent,
        WidgetComponent
    ]
})
export class FormBaseModule {
}
