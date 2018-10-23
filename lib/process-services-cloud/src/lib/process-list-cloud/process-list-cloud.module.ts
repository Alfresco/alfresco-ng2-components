import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProcessListCloudComponent } from './components/process-list-cloud.component';
import { MaterialModule } from '../material.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateLoaderService, DataTableModule, TemplateModule } from '@alfresco/adf-core';
import { ProcessListCloudService } from './services/process-list-cloud.service';

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
    declarations: [ProcessListCloudComponent],
    exports: [ProcessListCloudComponent],
    providers: [ProcessListCloudService]
})
export class ProcessListCloudModule { }
