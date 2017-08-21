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

import { ModuleWithProviders, NgModule } from '@angular/core';
import { CoreModule, TRANSLATION_PROVIDER } from 'ng2-alfresco-core';

import { DIAGRAM_DIRECTIVES, DIAGRAM_PROVIDERS } from './src/components/index';

import { RAPHAEL_DIRECTIVES } from './src/components/raphael/index';
import { RAPHAEL_PROVIDERS } from './src/components/raphael/index';

// primitives
export * from './src/components/index';
export * from './src/components/raphael/index';
export * from './src/models/index';

@NgModule({
    imports: [
        CoreModule
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
                name: 'ng2-activiti-diagrams',
                source: 'assets/ng2-activiti-diagrams'
            }
        }
    ],
    exports: [
        ...DIAGRAM_DIRECTIVES
    ]
})
export class DiagramsModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: DiagramsModule,
            providers: [
                ...DIAGRAM_PROVIDERS,
                ...RAPHAEL_PROVIDERS
            ]
        };
    }
}
