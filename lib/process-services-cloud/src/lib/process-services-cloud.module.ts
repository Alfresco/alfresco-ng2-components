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
import { APP_LIST_CLOUD_DIRECTIVES } from './app/app-list-cloud.module';
import { TaskCloudModule } from './task/task-cloud.module';
import { ProcessCloudModule } from './process/process-cloud.module';
import { FORM_CLOUD_DIRECTIVES } from './form/form-cloud.module';
import { TASK_FORM_CLOUD_DIRECTIVES } from './task/task-form/task-form.module';
import {
    LocalPreferenceCloudService,
    PreferenceCloudServiceInterface,
    PROCESS_FILTERS_SERVICE_TOKEN,
    TASK_FILTERS_SERVICE_TOKEN,
    PROCESS_LISTS_PREFERENCES_SERVICE_TOKEN,
    TASK_LIST_PREFERENCES_SERVICE_TOKEN
} from './services/public-api';
import { CloudFormRenderingService } from './form/components/cloud-form-rendering.service';
import { RichTextEditorComponent } from './rich-text-editor';
import { GroupCloudComponent } from './group/components/group-cloud.component';
import { PeopleCloudComponent } from './people/components/people-cloud.component';

export const PROCESS_SERVICES_CLOUD_DIRECTIVES = [
    ...APP_LIST_CLOUD_DIRECTIVES,
    ...FORM_CLOUD_DIRECTIVES,
    ...TASK_FORM_CLOUD_DIRECTIVES,
    PeopleCloudComponent,
    RichTextEditorComponent
] as const;

@NgModule({
    imports: [ProcessCloudModule, TaskCloudModule, GroupCloudComponent, ...PROCESS_SERVICES_CLOUD_DIRECTIVES],
    providers: [provideTranslations('adf-process-services-cloud', 'assets/adf-process-services-cloud')],
    exports: [ProcessCloudModule, TaskCloudModule, GroupCloudComponent, ...PROCESS_SERVICES_CLOUD_DIRECTIVES]
})
export class ProcessServicesCloudModule {
    static forRoot(
        filterPreferenceServiceInstance?: PreferenceCloudServiceInterface,
        listPreferenceServiceInstance?: PreferenceCloudServiceInterface
    ): ModuleWithProviders<ProcessServicesCloudModule> {
        return {
            ngModule: ProcessServicesCloudModule,
            providers: [
                provideTranslations('adf-process-services-cloud', 'assets/adf-process-services-cloud'),
                { provide: PROCESS_FILTERS_SERVICE_TOKEN, useExisting: filterPreferenceServiceInstance ?? LocalPreferenceCloudService },
                { provide: TASK_FILTERS_SERVICE_TOKEN, useExisting: filterPreferenceServiceInstance ?? LocalPreferenceCloudService },
                { provide: PROCESS_LISTS_PREFERENCES_SERVICE_TOKEN, useExisting: listPreferenceServiceInstance ?? LocalPreferenceCloudService },
                { provide: TASK_LIST_PREFERENCES_SERVICE_TOKEN, useExisting: listPreferenceServiceInstance ?? LocalPreferenceCloudService },
                FormRenderingService,
                { provide: FormRenderingService, useClass: CloudFormRenderingService }
            ]
        };
    }

    static forChild(): ModuleWithProviders<ProcessServicesCloudModule> {
        return {
            ngModule: ProcessServicesCloudModule
        };
    }
}
