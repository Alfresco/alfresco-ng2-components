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
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';

@NgModule({
    imports: [
        MatSlideToggleModule,
        MatInputModule,
        MatSelectModule,
        MatDialogModule,
        MatSidenavModule,
        MatProgressBarModule,
        MatCardModule,
        MatListModule,
        MatMenuModule,
        MatToolbarModule,
        MatSnackBarModule,
        MatExpansionModule
    ],
    exports: [
        MatSlideToggleModule,
        MatInputModule,
        MatSelectModule,
        MatDialogModule,
        MatSidenavModule,
        MatProgressBarModule,
        MatCardModule,
        MatListModule,
        MatMenuModule,
        MatToolbarModule,
        MatSnackBarModule,
        MatExpansionModule
    ]
})
export class MaterialModule {
}
