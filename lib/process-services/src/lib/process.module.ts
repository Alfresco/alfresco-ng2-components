/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { FormRenderingService, provideTranslations } from '@alfresco/adf-core';
import { ProcessFormRenderingService } from './form/process-form-rendering.service';
import { ATTACHMENT_DIRECTIVES } from './attachment';
import { APPS_LIST_DIRECTIVES } from './app-list';
import { PEOPLE_DIRECTIVES } from './people';
import { PROCESS_COMMENTS_DIRECTIVES } from './process-comments';
import { PROCESS_LIST_DIRECTIVES } from './process-list';
import { TASK_LIST_DIRECTIVES } from './task-list';
import { FORM_DIRECTIVES } from './form';
import { TASK_COMMENTS_DIRECTIVES } from './task-comments';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';

/**
 * @deprecated use provider api instead, for example:
 * ```
 * providers: [
 *     provideTranslations('adf-process-services', 'assets/adf-process-services'),
 *     { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { floatLabel: 'never' } }
 *     FormRenderingService,
 *     { provide: FormRenderingService, useClass: ProcessFormRenderingService }
 * ]
 * ```
 */
@NgModule({
    imports: [
        ...PROCESS_COMMENTS_DIRECTIVES,
        ...PROCESS_LIST_DIRECTIVES,
        ...TASK_LIST_DIRECTIVES,
        ...TASK_COMMENTS_DIRECTIVES,
        ...APPS_LIST_DIRECTIVES,
        ...ATTACHMENT_DIRECTIVES,
        ...PEOPLE_DIRECTIVES,
        ...FORM_DIRECTIVES
    ],
    providers: [
        provideTranslations('adf-process-services', 'assets/adf-process-services'),
        { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { floatLabel: 'never' } }
    ],
    exports: [
        ...PROCESS_COMMENTS_DIRECTIVES,
        ...PROCESS_LIST_DIRECTIVES,
        ...TASK_LIST_DIRECTIVES,
        ...TASK_COMMENTS_DIRECTIVES,
        ...APPS_LIST_DIRECTIVES,
        ...ATTACHMENT_DIRECTIVES,
        ...PEOPLE_DIRECTIVES,
        ...FORM_DIRECTIVES
    ]
})
export class ProcessModule {
    static forRoot(): ModuleWithProviders<ProcessModule> {
        return {
            ngModule: ProcessModule,
            providers: [
                provideTranslations('adf-process-services', 'assets/adf-process-services'),
                FormRenderingService,
                { provide: FormRenderingService, useClass: ProcessFormRenderingService }
            ]
        };
    }
}
