import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskFiltersCloudComponent } from './task-filters-cloud/task-filters-cloud.component';
import { MaterialModule } from '../material.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateLoaderService, LogService, StorageService } from '@alfresco/adf-core';
import { TaskFilterCloudService } from './services/task-filter-cloud.service';
import { HttpClientModule } from '@angular/common/http';
@NgModule({
    imports: [
        HttpClientModule,
        CommonModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useClass: TranslateLoaderService
            }
        }),
        MaterialModule
    ],
    declarations: [TaskFiltersCloudComponent],

    exports: [TaskFiltersCloudComponent],
    providers: [TaskFilterCloudService, LogService, StorageService]
})
export class TaskCloudModule { }
