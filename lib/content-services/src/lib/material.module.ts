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
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';
import { MatRippleModule } from '@angular/material/core';
import { MatLegacyOptionModule as MatOptionModule } from '@angular/material/legacy-core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { MatLegacyProgressBarModule as MatProgressBarModule } from '@angular/material/legacy-progress-bar';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacySlideToggleModule as MatSlideToggleModule } from '@angular/material/legacy-slide-toggle';
import { MatLegacySliderModule as MatSliderModule } from '@angular/material/legacy-slider';
import { MatTreeModule } from '@angular/material/tree';
import { MatBadgeModule } from '@angular/material/badge';

@NgModule({
    imports: [
        MatButtonModule,
        MatAutocompleteModule,
        MatChipsModule,
        MatDialogModule,
        MatIconModule,
        MatCardModule,
        MatInputModule,
        MatListModule,
        MatProgressSpinnerModule,
        MatProgressBarModule,
        MatRippleModule,
        MatMenuModule,
        MatOptionModule,
        MatExpansionModule,
        MatSelectModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatSlideToggleModule,
        MatRadioModule,
        MatSliderModule,
        MatTreeModule,
        MatBadgeModule
    ],
    exports: [
        MatButtonModule,
        MatAutocompleteModule,
        MatChipsModule,
        MatDialogModule,
        MatIconModule,
        MatCardModule,
        MatInputModule,
        MatListModule,
        MatProgressSpinnerModule,
        MatProgressBarModule,
        MatRippleModule,
        MatMenuModule,
        MatOptionModule,
        MatExpansionModule,
        MatSelectModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatSlideToggleModule,
        MatRadioModule,
        MatSliderModule,
        MatTreeModule,
        MatBadgeModule
    ]
})
export class MaterialModule {
}
