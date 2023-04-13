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
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatOptionModule, MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatTreeModule } from '@angular/material/tree';
import { MatBadgeModule } from '@angular/material/badge';

@NgModule({
    imports: [
        MatButtonModule,
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
