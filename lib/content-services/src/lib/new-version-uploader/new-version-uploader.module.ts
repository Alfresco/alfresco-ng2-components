import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { MaterialModule } from '../material.module';

import { UploadModule } from '../upload/upload.module';
import { CoreModule } from '@alfresco/adf-core';
import { VersionManagerModule } from '../version-manager';
import { NewVersionUploaderDialogComponent } from './new-version-uploader.dialog';


@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        CoreModule,
        UploadModule,
        FormsModule,
        VersionManagerModule
    ],
    declarations: [
        NewVersionUploaderDialogComponent
    ],
    exports: [
        NewVersionUploaderDialogComponent,
        FormsModule
    ]
})
export class NewVersionUploaderModule { }
