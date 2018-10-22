import { NgModule } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '../../material.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TemplateModule, TranslateLoaderService, FormModule } from '@alfresco/adf-core';
// import { CoreModule } from '@alfresco/adf-core';
import { StartTaskCloudComponent } from '../components/start-task-cloud.component';
import { StartTaskCloudService } from '../services/start-task-cloud.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        NoopAnimationsModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useClass: TranslateLoaderService
            }
        }),
        TemplateModule,
        FlexLayoutModule,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        FormModule
    ],
    declarations: [StartTaskCloudComponent],
    providers: [
        StartTaskCloudService
     ],
    exports: [
        StartTaskCloudComponent
    ]
})
export class StartTaskCloudTestingModule { }
