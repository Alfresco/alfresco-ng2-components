import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from '../material.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateLoaderService, LogService, StorageService } from '@alfresco/adf-core';
import { HttpClientModule } from '@angular/common/http';
import { StartProcessCloudComponent } from './start-process-cloud/start-process-cloud.component';
import { ProcessCloudService } from './services/process-cloud.service';
import { ReactiveFormsModule } from '@angular/forms';
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
        MaterialModule,
        ReactiveFormsModule
    ],
    declarations: [StartProcessCloudComponent],

    exports: [StartProcessCloudComponent],
    providers: [ProcessCloudService, LogService, StorageService]
})
export class ProcessCloudModule { }
