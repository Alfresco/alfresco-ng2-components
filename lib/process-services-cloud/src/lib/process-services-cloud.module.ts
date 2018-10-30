import { NgModule } from '@angular/core';
import { TRANSLATION_PROVIDER } from '@alfresco/adf-core';
import { AppListCloudModule } from './app-list-cloud/app-list-cloud.module';
import { TaskListCloudModule } from './task-list-cloud/task-list-cloud.module';
import { TaskCloudModule } from './task-cloud/task-cloud.module';
import { StartTaskCloudModule } from './start-task-cloud/start-task-cloud.module';

@NgModule({
    imports: [
        AppListCloudModule,
        TaskListCloudModule,
        TaskCloudModule
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
    exports: [AppListCloudModule, TaskListCloudModule, TaskCloudModule, StartTaskCloudModule]
})
export class ProcessServicesCloudModule { }
