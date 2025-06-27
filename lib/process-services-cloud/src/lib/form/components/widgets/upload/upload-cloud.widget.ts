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

/* eslint-disable @angular-eslint/component-selector */

import { Component, ElementRef, EventEmitter, inject, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { Node } from '@alfresco/js-api';
import { Observable, from } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { WidgetComponent, FormService, ThumbnailService, NotificationService, ErrorWidgetComponent } from '@alfresco/adf-core';
import { ProcessCloudContentService } from '../../../services/process-cloud-content.service';
import { FileSourceTypes, DestinationFolderPathType } from '../../../models/form-cloud-representation.model';
import { VersionManagerUploadData } from '@alfresco/adf-content-services';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatLineModule } from '@angular/material/core';

@Component({
    selector: 'upload-cloud-widget',
    standalone: true,
    imports: [CommonModule, TranslatePipe, ErrorWidgetComponent, MatIconModule, MatButtonModule, MatListModule, MatLineModule],
    templateUrl: './upload-cloud.widget.html',
    styleUrls: ['./upload-cloud.widget.scss'],
    host: {
        '(click)': 'event($event)',
        '(blur)': 'event($event)',
        '(change)': 'event($event)',
        '(focus)': 'event($event)',
        '(focusin)': 'event($event)',
        '(focusout)': 'event($event)',
        '(input)': 'event($event)',
        '(invalid)': 'event($event)',
        '(select)': 'event($event)'
    },
    encapsulation: ViewEncapsulation.None
})
export class UploadCloudWidgetComponent extends WidgetComponent implements OnInit {
    protected thumbnailService = inject(ThumbnailService);
    protected processCloudContentService = inject(ProcessCloudContentService);
    protected notificationService = inject(NotificationService);

    hasFile: boolean;
    displayText: string;
    multipleOption: string = '';
    mimeTypeIcon: string;

    @Output()
    error = new EventEmitter<any>();

    @ViewChild('uploadFiles')
    fileInput: ElementRef;

    constructor(formService: FormService) {
        super(formService);
    }

    ngOnInit() {
        if (this.field?.value?.length > 0) {
            this.hasFile = true;
            this.fixIncompatibilityFromPreviousAndNewForm([]);
        }
        this.getMultipleFileParam();
        this.setDestinationFolderPathFromMappedVariable();
    }

    removeFile(file: any) {
        if (this.field) {
            this.removeElementFromList(file);
        }
    }

    replaceOldFileVersionWithNew(versionManagerData: VersionManagerUploadData) {
        const currentUploadedFileIndex = this.uploadedFiles.findIndex((file) => file.name === versionManagerData.currentVersion.name);
        this.uploadedFiles[currentUploadedFileIndex] = { ...versionManagerData.newVersion.value.entry };
        this.field.value = [...this.uploadedFiles];
        this.field.form.values[this.field.id] = [...this.uploadedFiles];
    }

    onFileChanged(event: any) {
        const files: File[] = [];
        const filesSaved: Node[] = [];

        for (const file of Array.from<File>(event.target.files)) {
            if (!this.isUploaded(file)) {
                files.push(file);
            } else {
                this.notificationService.showWarning('FORM.FIELD.FILE_ALREADY_UPLOADED');
            }
        }

        if (files && files.length > 0) {
            from(files)
                .pipe(mergeMap((file) => this.uploadRawContent(file)))
                .subscribe({
                    next: (res) => {
                        filesSaved.push(res);
                    },
                    error: (error) => this.widgetError.emit(`Error uploading file. See console output for more details. ${error}`),
                    complete: () => {
                        this.fixIncompatibilityFromPreviousAndNewForm(filesSaved);
                        this.hasFile = true;
                    }
                });
        }
    }

    private isUploaded(file: File): boolean {
        const current: Node[] = this.field.value || [];
        return current.some((entry) => entry.name === file.name);
    }

    protected fixIncompatibilityFromPreviousAndNewForm(filesSaved: Node[]) {
        const value: Node[] = [...(this.field.value || [])];
        value.push(...(filesSaved || []));

        this.field.value = value;
        this.field.form.values[this.field.id] = value;

        this.hasFile = value.length > 0;
    }

    getIcon(mimeType: string): string {
        return this.thumbnailService.getMimeTypeIcon(mimeType);
    }

    private uploadRawContent(file: File): Observable<Node> {
        return this.processCloudContentService.createTemporaryRawRelatedContent(file, this.field.form.nodeId);
    }

    getMultipleFileParam() {
        if (this.field?.params?.multiple) {
            this.multipleOption = this.field.params.multiple ? 'multiple' : '';
        }
    }

    get uploadedFiles(): any[] {
        const result = this.field.value || this.field.form.values[this.field.id];
        return result || [];
    }

    private removeElementFromList(file: any) {
        const filteredValues = this.uploadedFiles.filter((value) => value.id !== file.id);
        this.resetFormValues(filteredValues);
    }

    private resetFormValues(values: any[]) {
        if (values && values.length > 0) {
            this.field.value = values;
            this.field.form.values[this.field.id] = values;
            this.hasFile = true;
        } else {
            this.field.value = [];
            this.field.form.values[this.field.id] = [];
            this.hasFile = false;
        }
    }

    fileClicked(file: any): void {
        this.formService.formContentClicked.next(file);
    }

    isAlfrescoAndLocal(): boolean {
        return this.field?.params?.fileSource?.serviceId === FileSourceTypes.ALL_FILE_SOURCES_SERVICE_ID;
    }

    isPathVariableType(type: string): boolean {
        return this.field?.params?.fileSource?.destinationFolderPath?.type === type;
    }

    setDestinationFolderPathFromMappedVariable() {
        if (this.isAlfrescoAndLocal()) {
            this.prepareUploadWidgetDestinationFolderPathFromStringVariable();
            this.prepareUploadWidgetDestinationFolderPathFromFolderVariable();
        }
    }

    private prepareUploadWidgetDestinationFolderPathFromStringVariable() {
        if (this.isPathVariableType(DestinationFolderPathType.STRING_TYPE)) {
            this.setUploadWidgetDestinationFolderPath(this.getDestinationFolderPathValue());
        }
    }

    private prepareUploadWidgetDestinationFolderPathFromFolderVariable() {
        if (this.isPathVariableType(DestinationFolderPathType.FOLDER_TYPE)) {
            const folder = this.getDestinationFolderPathValue();
            this.setUploadWidgetDestinationFolderPath(folder?.length ? folder[0].id : undefined);
        }
    }

    private setUploadWidgetDestinationFolderPath(path: string) {
        this.field.params.fileSource.destinationFolderPath['value'] = path ? path : undefined;
    }

    private getDestinationFolderPathValue(): any {
        return this.field.form.getProcessVariableValue(this.field.params.fileSource?.destinationFolderPath?.name);
    }
}
