import { NgModule } from '@angular/core';
import { TRANSLATION_PROVIDER, CoreModule, LogService, StorageService } from '@alfresco/adf-core';
import { AppListCloudModule } from './app-list-cloud/app-list-cloud.module';
import { TaskCloudModule } from './task-cloud/public_api';
import { TaskFilterCloudService } from './task-cloud/services/task-filter-cloud.service';
import { MaterialModule } from './material.module';

export function providers() {
    return [
        TaskFilterCloudService,
        LogService,
        StorageService
    ];
}
@NgModule({
    imports: [
        CoreModule.forChild(),
        AppListCloudModule,
        TaskCloudModule,
        MaterialModule
    ],
    providers: [
        ...providers(),
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
    exports: [
        AppListCloudModule,
        TaskCloudModule
    ]
})

export class ProcessServicesCloudModule { }
