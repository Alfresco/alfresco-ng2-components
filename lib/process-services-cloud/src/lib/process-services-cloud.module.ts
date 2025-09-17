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
import { provideTranslations } from '@alfresco/adf-core';
import { TaskCloudModule } from './task/task-cloud.module';
import { ProcessCloudModule } from './process/process-cloud.module';
import { FORM_CLOUD_DIRECTIVES } from './form/form-cloud.module';
import { TASK_FORM_CLOUD_DIRECTIVES } from './task/task-form/task-form.module';
import { PreferenceCloudServiceInterface, TASK_LIST_CLOUD_TOKEN } from './services/public-api';
import { GroupCloudComponent } from './group/components/group-cloud.component';
import { PeopleCloudComponent } from './people/components/people-cloud.component';
import { provideCloudFormRenderer, provideCloudPreferences } from './providers';
import { TaskListCloudService } from './task/task-list/services/task-list-cloud.service';

export const PROCESS_SERVICES_CLOUD_DIRECTIVES = [...FORM_CLOUD_DIRECTIVES, ...TASK_FORM_CLOUD_DIRECTIVES, PeopleCloudComponent] as const;

/**
 * @deprecated this module is deprecated and will be removed in the future versions
 *
 * Instead, import the standalone components directly, or use the following provider API to replicate the behaviour:
 * ```
 * providers: [
 *      provideTranslations('adf-process-services-cloud', 'assets/adf-process-services-cloud')
 *      provideCloudPreferences()
 *      provideCloudFormRenderer(),
 *      { provide: TASK_LIST_CLOUD_TOKEN, useClass: TaskListCloudService }
 * ]
 * ```
 */
@NgModule({
    imports: [ProcessCloudModule, TaskCloudModule, GroupCloudComponent, ...PROCESS_SERVICES_CLOUD_DIRECTIVES],
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
                provideCloudPreferences({
                    filterPreferenceServiceInstance,
                    listPreferenceServiceInstance
                }),
                provideCloudFormRenderer(),
                { provide: TASK_LIST_CLOUD_TOKEN, useClass: TaskListCloudService }
            ]
        };
    }

    static forChild(): ModuleWithProviders<ProcessServicesCloudModule> {
        return {
            ngModule: ProcessServicesCloudModule
        };
    }
}
