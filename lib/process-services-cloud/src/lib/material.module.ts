/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatLegacyOptionModule as MatOptionModule } from '@angular/material/legacy-core';
import { MAT_LEGACY_FORM_FIELD_DEFAULT_OPTIONS as MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/legacy-form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacySlideToggleModule as MatSlideToggleModule } from '@angular/material/legacy-slide-toggle';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';

@NgModule({
    providers: [
        { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { floatLabel: 'never' } }
    ],
    imports: [
        MatAutocompleteModule, MatButtonModule, MatCardModule, MatDialogModule,
        MatCheckboxModule, MatDatepickerModule, MatGridListModule, MatIconModule, MatInputModule,
        MatListModule, MatOptionModule, MatRadioModule, MatSelectModule, MatSlideToggleModule, MatTableModule,
        MatTabsModule, MatProgressSpinnerModule, MatNativeDateModule, MatRippleModule, MatTooltipModule,
        MatChipsModule, MatMenuModule, MatExpansionModule
    ],
    exports: [
        MatAutocompleteModule, MatButtonModule, MatCardModule, MatDialogModule,
        MatCheckboxModule, MatDatepickerModule, MatGridListModule, MatIconModule, MatInputModule,
        MatListModule, MatOptionModule, MatRadioModule, MatSelectModule, MatSlideToggleModule, MatTableModule,
        MatTabsModule, MatProgressSpinnerModule, MatNativeDateModule, MatRippleModule, MatTooltipModule,
        MatChipsModule, MatMenuModule, MatExpansionModule
    ]
})
export class MaterialModule {}
