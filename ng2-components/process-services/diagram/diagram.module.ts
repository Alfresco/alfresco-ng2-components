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

import { TRANSLATION_PROVIDER } from '@adf/core';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { DIAGRAM_DIRECTIVES, DIAGRAM_PROVIDERS } from './components/index';

import { RAPHAEL_DIRECTIVES } from './components/raphael/index';
import { RAPHAEL_PROVIDERS } from './components/raphael/index';


@NgModule({
    imports: [
        CommonModule,
        TranslateModule
    ],
    declarations: [
        ...DIAGRAM_DIRECTIVES,
        ...RAPHAEL_DIRECTIVES
    ],
    providers: [
        ...DIAGRAM_PROVIDERS,
        ...RAPHAEL_PROVIDERS,
        {
            provide: TRANSLATION_PROVIDER,
            multi: true,
            useValue: {
                name: '@adf/process-services',
                source: 'assets/ng2-activiti-diagrams'
            }
        }
    ],
    exports: [
        ...DIAGRAM_DIRECTIVES
    ]
})
export class DiagramsModule {}
