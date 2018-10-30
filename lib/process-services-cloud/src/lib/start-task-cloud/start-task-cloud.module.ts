import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '../material.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TemplateModule, TranslateLoaderService, FormModule } from '@alfresco/adf-core';
import { StartTaskCloudComponent } from './components/start-task-cloud.component';
import { StartTaskCloudService } from './services/start-task-cloud.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PeopleCloudComponent } from './components/people-cloud/people-cloud.component';
import { InitialUserNamePipe } from './components/pipes/initial-user-name.pipe';

@NgModule({
    imports: [
      CommonModule,
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
    declarations: [StartTaskCloudComponent, PeopleCloudComponent, InitialUserNamePipe],
    providers: [
        StartTaskCloudService
     ],
    exports: [
        StartTaskCloudComponent,
        PeopleCloudComponent,
        InitialUserNamePipe
    ]
})
export class StartTaskCloudModule { }
