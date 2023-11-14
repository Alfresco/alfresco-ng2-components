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
import { NgModule } from '@angular/core';
import { InfoDrawerLayoutComponent, InfoDrawerTitleDirective, InfoDrawerButtonsDirective, InfoDrawerContentDirective } from './info-drawer-layout.component';
import { InfoDrawerComponent, InfoDrawerTabComponent } from './info-drawer.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';

@NgModule({
    imports: [
        CommonModule,
        MatTabsModule,
        MatIconModule,
        MatCardModule,
        TranslateModule
    ],
    declarations: [
        InfoDrawerLayoutComponent,
        InfoDrawerTabComponent,
        InfoDrawerComponent,
        InfoDrawerTitleDirective,
        InfoDrawerButtonsDirective,
        InfoDrawerContentDirective
    ],
    exports: [
        InfoDrawerLayoutComponent,
        InfoDrawerTabComponent,
        InfoDrawerComponent,
        InfoDrawerTitleDirective,
        InfoDrawerButtonsDirective,
        InfoDrawerContentDirective,
        MatTabsModule,
        MatCardModule,
        MatIconModule
    ]
})
export class InfoDrawerModule {}
