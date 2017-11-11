/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MaterialModule } from './material.module';

import { AnalyticsModule } from './analytics';
import { DiagramsModule } from './diagram';
import { ProcessListModule } from './process-list';
import { TaskListModule } from './task-list';
import { FormModule } from './form';
import { AppsListModule } from './app-list';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MaterialModule,
        AnalyticsModule,
        DiagramsModule,
        ProcessListModule,
        TaskListModule,
        FormModule,
        AppsListModule
    ],
    declarations: [],
    providers: [],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MaterialModule,
        AnalyticsModule,
        DiagramsModule,
        ProcessListModule,
        TaskListModule,
        FormModule,
        AppsListModule
    ]
})
export class ProcessModule {
}
