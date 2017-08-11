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
import { HttpModule } from '@angular/http';
import { MdAutocompleteModule, MdButtonModule, MdCardModule, MdCheckboxModule,
    MdDatepickerModule, MdGridListModule, MdIconModule, MdInputModule, MdListModule,
    MdOptionModule, MdRadioModule, MdSelectModule, MdSlideToggleModule, MdTableModule, MdTabsModule } from '@angular/material';
import { CoreModule, TRANSLATION_PROVIDER } from 'ng2-alfresco-core';
import { DataTableModule } from 'ng2-alfresco-datatable';
import { FormFieldComponent } from './src/components/form-field/form-field.component';
import { FormListComponent } from './src/components/form-list.component';
import { FormComponent } from './src/components/form.component';
import { StartFormComponent } from './src/components/start-form.component';
import { ContentWidgetComponent } from './src/components/widgets/content/content.widget';
import { MASK_DIRECTIVE, WIDGET_DIRECTIVES } from './src/components/widgets/index';
import { ActivitiAlfrescoContentService } from './src/services/activiti-alfresco.service';
import { ActivitiContentService } from './src/services/activiti-content-service';
import { EcmModelService } from './src/services/ecm-model.service';
import { FormRenderingService } from './src/services/form-rendering.service';
import { FormService } from './src/services/form.service';
import { NodeService } from './src/services/node.service';
import { WidgetVisibilityService } from './src/services/widget-visibility.service';

export * from './src/components/form.component';
export * from './src/components/form-list.component';
export * from './src/components/widgets/content/content.widget';
export * from './src/components/start-form.component';
export * from './src/services/form.service';
export * from './src/services/activiti-content-service';
export * from './src/components/widgets/index';
export * from './src/services/ecm-model.service';
export * from './src/services/node.service';
export * from './src/services/form-rendering.service';
export * from './src/events/index';
export { FORM_FIELD_VALIDATORS } from './src/components/widgets/core/form-field-validator';

// Old deprecated import
import {FormComponent as ActivitiForm } from './src/components/form.component';
import {StartFormComponent as ActivitiStartForm } from './src/components/start-form.component';
import {ContentWidgetComponent as ActivitiContent } from './src/components/widgets/content/content.widget';
export {FormComponent as ActivitiForm} from './src/components/form.component';
export {ContentWidgetComponent as ActivitiContent} from './src/components/widgets/content/content.widget';
export {StartFormComponent as ActivitiStartForm} from './src/components/start-form.component';

export const ACTIVITI_FORM_DIRECTIVES: any[] = [
    FormComponent,
    FormListComponent,
    ContentWidgetComponent,
    StartFormComponent,
    FormFieldComponent,
    ...WIDGET_DIRECTIVES
];

export const DEPRECATED_FORM_DIRECTIVES: any[] = [
    ActivitiForm,
    ActivitiContent,
    ActivitiStartForm
];

export const ACTIVITI_FORM_PROVIDERS: any[] = [
    FormService,
    ActivitiContentService,
    EcmModelService,
    NodeService,
    WidgetVisibilityService,
    ActivitiAlfrescoContentService,
    FormRenderingService
];

export const MATERIAL_MODULE: any[] = [
    MdAutocompleteModule, MdButtonModule, MdCardModule, MdCheckboxModule,
    MdDatepickerModule, MdGridListModule, MdIconModule, MdInputModule, MdRadioModule,
    MdSelectModule, MdSlideToggleModule, MdTableModule, MdTabsModule, MdOptionModule, MdListModule
];

@NgModule({
    imports: [
        CoreModule,
        DataTableModule,
        HttpModule,
        ...MATERIAL_MODULE
    ],
    declarations: [
        ...ACTIVITI_FORM_DIRECTIVES,
        ...DEPRECATED_FORM_DIRECTIVES,
        ...MASK_DIRECTIVE
    ],
    entryComponents: [
        ...WIDGET_DIRECTIVES
    ],
    providers: [
        ...ACTIVITI_FORM_PROVIDERS,
        {
            provide: TRANSLATION_PROVIDER,
            multi: true,
            useValue: {
                name: 'ng2-activiti-form',
                source: 'assets/ng2-activiti-form'
            }
        }
    ],
    exports: [
        ...ACTIVITI_FORM_DIRECTIVES,
        ...DEPRECATED_FORM_DIRECTIVES,
        ...MATERIAL_MODULE
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
