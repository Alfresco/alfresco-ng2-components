/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { CoreModule, FormRenderingService, provideTranslations } from '@alfresco/adf-core';
import { APP_LIST_CLOUD_DIRECTIVES } from './app/app-list-cloud.module';
import { TaskCloudModule } from './task/task-cloud.module';
import { ProcessCloudModule } from './process/process-cloud.module';
import { GroupCloudModule } from './group/group-cloud.module';
import { FormCloudModule } from './form/form-cloud.module';
import { TaskFormModule } from './task/task-form/task-form.module';
import {
    LocalPreferenceCloudService,
    PreferenceCloudServiceInterface,
    PROCESS_FILTERS_SERVICE_TOKEN,
    TASK_FILTERS_SERVICE_TOKEN,
    PROCESS_LISTS_PREFERENCES_SERVICE_TOKEN,
    TASK_LIST_PREFERENCES_SERVICE_TOKEN
} from './services/public-api';
import { CloudFormRenderingService } from './form/components/cloud-form-rendering.service';
import { ApolloModule } from 'apollo-angular';
import { RichTextEditorModule } from './rich-text-editor/rich-text-editor.module';
import { ProcessNameCloudPipe } from './pipes/process-name-cloud.pipe';
import { PeopleCloudComponent } from './people/components/people-cloud.component';

@NgModule({
    imports: [
        CoreModule,
        ...APP_LIST_CLOUD_DIRECTIVES,
        ProcessCloudModule,
        TaskCloudModule,
        GroupCloudModule,
        PeopleCloudComponent,
        FormCloudModule,
        TaskFormModule,
        ProcessNameCloudPipe,
        ApolloModule,
        RichTextEditorModule
    ],
    providers: [provideTranslations('adf-process-services-cloud', 'assets/adf-process-services-cloud')],
    exports: [
        ...APP_LIST_CLOUD_DIRECTIVES,
        ProcessCloudModule,
        TaskCloudModule,
        GroupCloudModule,
        FormCloudModule,
        TaskFormModule,
        PeopleCloudComponent,
        ProcessNameCloudPipe,
        RichTextEditorModule
    ]
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
