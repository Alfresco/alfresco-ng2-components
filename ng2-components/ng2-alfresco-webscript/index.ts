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

import { NgModule, ModuleWithProviders } from '@angular/core';
import { CoreModule } from 'ng2-alfresco-core';
import { DataTableModule } from 'ng2-alfresco-datatable';

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
        CoreModule,
        DataTableModule
    ],
    declarations: [
        ...WEBSCRIPT_DIRECTIVES
    ],
    exports: [
        ...WEBSCRIPT_DIRECTIVES
    ]
})
export class WebScriptModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: WebScriptModule
        };
    }
}
