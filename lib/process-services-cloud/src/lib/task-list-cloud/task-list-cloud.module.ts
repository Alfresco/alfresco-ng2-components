import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';
import { TaskListCloudComponent } from './components/task-list-cloud.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateLoaderService, DataTableModule, TemplateModule } from '@alfresco/adf-core';
import { TaskListCloudService } from './services/task-list-cloud.service';

@NgModule({
    imports: [
        CommonModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useClass: TranslateLoaderService
            }
        }),
        MaterialModule,
        DataTableModule,
        TemplateModule
    ],
    declarations: [TaskListCloudComponent],
    exports: [TaskListCloudComponent],
    providers: [TaskListCloudService]
})
export class TaskListCloudModule { }
