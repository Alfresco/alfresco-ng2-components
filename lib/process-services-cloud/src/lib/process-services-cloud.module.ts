import { NgModule } from '@angular/core';
import { TRANSLATION_PROVIDER } from '@alfresco/adf-core';
import { AppListCloudModule } from './app-list-cloud/app-list-cloud.module';
import { TaskListCloudModule } from './task-list-cloud/task-list-cloud.module';
import { TaskCloudModule } from './task-cloud/task-cloud.module';
import { ProcessListCloudModule } from './process-list-cloud/process-list-cloud.module';

@NgModule({
    imports: [
        AppListCloudModule,
        TaskListCloudModule,
        TaskCloudModule,
        ProcessListCloudModule
    ],
    providers: [
        {
            provide: TRANSLATION_PROVIDER,
            multi: true,
            useValue: {
                name: 'adf-process-services-cloud',
                source: 'assets/adf-process-services-cloud'
            }
        }
    ],
    declarations: [],
    exports: [AppListCloudModule, TaskListCloudModule, TaskCloudModule, ProcessListCloudModule]
})
export class ProcessServicesCloudModule { }
