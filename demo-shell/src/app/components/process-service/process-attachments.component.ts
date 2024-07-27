/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, inject, Input, OnChanges, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {
    CreateProcessAttachmentComponent,
    ProcessAttachmentListComponent,
    ProcessService,
    ProcessUploadService
} from '@alfresco/adf-process-services';
import { UploadDragAreaComponent, UploadService } from '@alfresco/adf-content-services';
import { PreviewService } from '../../services/preview.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ProcessInstanceRepresentation } from '@alfresco/js-api';
import { CommonModule } from '@angular/common';
import { EmptyListComponent } from '@alfresco/adf-core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-process-attachments',
    standalone: true,
    imports: [
        CommonModule,
        UploadDragAreaComponent,
        ProcessAttachmentListComponent,
        EmptyListComponent,
        TranslateModule,
        CreateProcessAttachmentComponent
    ],
    templateUrl: './process-attachments.component.html',
    styleUrls: ['./process-attachments.component.css'],
    providers: [{ provide: UploadService, useClass: ProcessUploadService }],
    encapsulation: ViewEncapsulation.None
})
export class ProcessAttachmentsComponent implements OnInit, OnChanges, OnDestroy {
    @ViewChild('processAttachList')
    processAttachList: ProcessAttachmentListComponent;

    @Input()
    processInstanceId: string;

    processInstance: ProcessInstanceRepresentation;

    private uploadService = inject(UploadService);
    private processService = inject(ProcessService);
    private preview = inject(PreviewService);

    private onDestroy$ = new Subject<boolean>();

    ngOnInit() {
        this.uploadService.fileUploadComplete.pipe(takeUntil(this.onDestroy$)).subscribe((value) => this.onFileUploadComplete(value.data));
    }

    ngOnChanges() {
        if (this.processInstanceId) {
            this.processService.getProcess(this.processInstanceId).subscribe((processInstance) => {
                this.processInstance = processInstance;
            });
        }
    }

    ngOnDestroy() {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }

    onFileUploadComplete(content: any) {
        this.processAttachList.add(content);
    }

    onAttachmentClick(content: any): void {
        this.preview.showBlob(content.name, content.contentBlob);
    }

    isCompletedProcess(): boolean {
        return this.processInstance?.ended != null;
    }
}
