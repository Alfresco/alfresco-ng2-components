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

import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from 'ng2-translate/ng2-translate';

import { DataTableModule } from 'ng2-alfresco-datatable';
import { CoreModule } from 'ng2-alfresco-core';

import { WebscriptComponent } from './src/webscript.component';

/**
 * ng2-alfresco-webscript, provide components get data from webscript and visualize in a table.
 */

export * from './src/webscript.component';

export const WEBSCRIPT_DIRECTIVES: any[] = [
    WebscriptComponent
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpModule,
        TranslateModule,
        CoreModule,
        DataTableModule
    ],
    declarations: [
        ...WEBSCRIPT_DIRECTIVES
    ],
    providers: [
    ],
    exports: [
        ...WEBSCRIPT_DIRECTIVES
    ]
})
export class WebScriptModule {}
