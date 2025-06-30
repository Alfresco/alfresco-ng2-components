/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { FileModel, FileUploadStatus } from '../../common/models/file.model';
import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { FileSizePipe, IconComponent } from '@alfresco/adf-core';
import { MatChipsModule } from '@angular/material/chips';
import { TranslatePipe } from '@ngx-translate/core';
import { ToggleIconDirective } from '../directives/toggle-icon.directive';
import { MatButtonModule } from '@angular/material/button';
import { FileUploadErrorPipe } from '../pipes/file-upload-error.pipe';

@Component({
    selector: 'adf-file-uploading-list-row',
    standalone: true,
    imports: [
        CommonModule,
        MatIconModule,
        MatListModule,
        IconComponent,
        MatChipsModule,
        TranslatePipe,
        ToggleIconDirective,
        FileSizePipe,
        MatButtonModule,
        FileUploadErrorPipe
    ],
    templateUrl: './file-uploading-list-row.component.html',
    styleUrls: ['./file-uploading-list-row.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class FileUploadingListRowComponent {
    @Input()
    file: FileModel;

    @Output()
    cancel = new EventEmitter<FileModel>();

    onCancel(file: FileModel): void {
        this.cancel.emit(file);
    }

    showCancelledStatus(): boolean {
        return (
            this.file.status === FileUploadStatus.Cancelled ||
            this.file.status === FileUploadStatus.Aborted ||
            this.file.status === FileUploadStatus.Deleted
        );
    }

    get versionNumber(): string {
        return this.file.data.entry.properties['cm:versionLabel'];
    }

    get mimeType(): string {
        return this.file?.file?.type || 'default';
    }

    isUploadVersion(): boolean {
        return !!this.file.data && this.file.options?.newVersion && this.file.data.entry.properties?.['cm:versionLabel'];
    }

    canCancelUpload(): boolean {
        return this.file?.status === FileUploadStatus.Pending;
    }

    isUploadError(): boolean {
        return this.file?.status === FileUploadStatus.Error;
    }

    isUploading(): boolean {
        return this.file && (this.file.status === FileUploadStatus.Progress || this.file.status === FileUploadStatus.Starting);
    }

    isUploadComplete(): boolean {
        return this.file?.status === FileUploadStatus.Complete && !this.isUploadVersion();
    }

    isUploadVersionComplete(): boolean {
        return this.file?.status === FileUploadStatus.Complete && this.isUploadVersion();
    }
}
