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
import { AttachmentComponent, TaskAttachmentListComponent, TaskListService, TaskUploadService } from '@alfresco/adf-process-services';
import { UploadDragAreaComponent, UploadService } from '@alfresco/adf-content-services';
import { PreviewService } from '../../services/preview.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TaskRepresentation } from '@alfresco/js-api';
import { CommonModule } from '@angular/common';
import { EmptyListComponent } from '@alfresco/adf-core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-task-attachments',
    standalone: true,
    imports: [CommonModule, UploadDragAreaComponent, TaskAttachmentListComponent, EmptyListComponent, TranslateModule, AttachmentComponent],
    templateUrl: './task-attachments.component.html',
    styleUrls: ['./task-attachments.component.css'],
    encapsulation: ViewEncapsulation.None,
    providers: [{ provide: UploadService, useClass: TaskUploadService }]
})
export class TaskAttachmentsComponent implements OnInit, OnChanges, OnDestroy {
    @ViewChild('taskAttachList')
    taskAttachList: TaskAttachmentListComponent;

    @Input()
    taskId: string;

    taskDetails: TaskRepresentation;

    private uploadService = inject(UploadService);
    private taskListService = inject(TaskListService);
    private previewService = inject(PreviewService);

    private onDestroy$ = new Subject<boolean>();

    ngOnInit() {
        this.uploadService.fileUploadComplete.pipe(takeUntil(this.onDestroy$)).subscribe((event) => this.onFileUploadComplete(event.data));
    }

    ngOnChanges() {
        if (this.taskId) {
            this.taskListService.getTaskDetails(this.taskId).subscribe((taskDetails) => (this.taskDetails = taskDetails));
        }
    }

    ngOnDestroy() {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }

    onFileUploadComplete(content: any) {
        this.taskAttachList.add(content);
    }

    onAttachmentClick(content: any): void {
        this.previewService.showBlob(content.name, content.contentBlob);
    }

    isCompletedTask(): boolean {
        return this.taskDetails?.endDate != null;
    }
}
