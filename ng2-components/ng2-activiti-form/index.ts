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

import { ActivitiForm } from './src/components/activiti-form.component';
import { ActivitiContent } from './src/components/activiti-content.component';
import { FormFieldComponent } from './src/components/form-field/form-field.component';
import { ActivitiStartForm } from './src/components/activiti-start-form.component';
import { FormService } from './src/services/form.service';
import { EcmModelService } from './src/services/ecm-model.service';
import { NodeService } from './src/services/node.service';
import { WidgetVisibilityService } from './src/services/widget-visibility.service';
import { ActivitiAlfrescoContentService } from './src/services/activiti-alfresco.service';
import { FormRenderingService } from './src/services/form-rendering.service';
import { HttpModule } from '@angular/http';
import { WIDGET_DIRECTIVES } from './src/components/widgets/index';

export * from './src/components/activiti-form.component';
export * from './src/components/activiti-content.component';
export * from './src/components/activiti-start-form.component';
export * from './src/services/form.service';
export * from './src/components/widgets/index';
export * from './src/services/ecm-model.service';
export * from './src/services/node.service';
export * from './src/services/form-rendering.service';
export * from './src/events/index';

export const ACTIVITI_FORM_DIRECTIVES: any[] = [
    ActivitiForm,
    ActivitiContent,
    ActivitiStartForm,
    FormFieldComponent,
    ...WIDGET_DIRECTIVES
];

export const ACTIVITI_FORM_PROVIDERS: any[] = [
    FormService,
    EcmModelService,
    NodeService,
    WidgetVisibilityService,
    ActivitiAlfrescoContentService,
    FormRenderingService
];

@NgModule({
    imports: [
        CoreModule,
        HttpModule
    ],
    declarations: [
        ...ACTIVITI_FORM_DIRECTIVES
    ],
    entryComponents: [
        ...WIDGET_DIRECTIVES
    ],
    providers: [
        ...ACTIVITI_FORM_PROVIDERS
    ],
    exports: [
        ...ACTIVITI_FORM_DIRECTIVES
    ]
})
export class ActivitiFormModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: ActivitiFormModule,
            providers: [
                ...ACTIVITI_FORM_PROVIDERS
            ]
        };
    }
}
