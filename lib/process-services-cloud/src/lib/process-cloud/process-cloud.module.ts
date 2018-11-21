import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProcessFiltersCloudComponent } from './process-filters-cloud/process-filters-cloud.component';
import { MaterialModule } from '../material.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateLoaderService, LogService, StorageService } from '@alfresco/adf-core';
import { ProcessFilterCloudService } from './services/process-filter-cloud.service';
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
    declarations: [ProcessFiltersCloudComponent],

    exports: [ProcessFiltersCloudComponent],
    providers: [ProcessFilterCloudService, LogService, StorageService]
})
export class ProcessCloudModule { }
