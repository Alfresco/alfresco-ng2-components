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

import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { LocalizedDatePipe, ThumbnailService, UploadDirective, DisplayableCMProperties } from '@alfresco/adf-core';
import { Node } from '@alfresco/js-api';
import { NewVersionUploaderDialogData } from '@alfresco/adf-content-services';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatLineModule } from '@angular/material/core';
import { MatListModule } from '@angular/material/list';

const RETRIEVE_METADATA_OPTION = 'retrieveMetadata';

@Component({
    selector: 'adf-cloud-file-properties-table',
    standalone: true,
    imports: [
        CommonModule,
        MatIconModule,
        TranslatePipe,
        MatMenuModule,
        UploadDirective,
        MatButtonModule,
        MatTableModule,
        MatLineModule,
        MatListModule
    ],
    providers: [LocalizedDatePipe],
    templateUrl: './file-properties-table-cloud.component.html',
    styleUrls: ['./file-properties-table-cloud.component.scss']
})
export class FilePropertiesTableCloudComponent {
    private localizedDatePipe = inject(LocalizedDatePipe);
    private thumbnailService = inject(ThumbnailService);

    @Input()
    uploadedFiles;

    @Input()
    hasFile: boolean;

    @Input()
    selectedNode: Node;

    @Input()
    field;

    @Input()
    displayedColumns;

    @Input()
    mimeTypeIcon;

    @Output()
    rowClick = new EventEmitter<Node>();

    @Output()
    attachFileClick = new EventEmitter<any>();

    @Output()
    downloadFile = new EventEmitter<Node>();

    @Output()
    uploadNewFileVersion = new EventEmitter<NewVersionUploaderDialogData>();

    @Output()
    contentModelFileHandler = new EventEmitter<Node>();

    @Output()
    removeAttachFile = new EventEmitter<Node>();

    onRowClicked(file?: Node) {
        this.rowClick.emit(file);
    }

    onAttachFileClicked(nodeSelector: any) {
        this.attachFileClick.emit(nodeSelector);
    }

    downloadContent(file: Node) {
        this.downloadFile.emit(file);
    }

    onUploadNewFileVersion(customEvent: any, node: Node) {
        const newVersionUploaderDialogData: NewVersionUploaderDialogData = {
            file: customEvent.detail.files[0].file,
            node,
            showComments: true,
            allowDownload: true
        };
        this.uploadNewFileVersion.emit(newVersionUploaderDialogData);
    }

    contentModelFormFileHandler(file?: Node) {
        this.contentModelFileHandler.emit(file);
    }

    onRemoveAttachFile(file: Node) {
        this.removeAttachFile.emit(file);
    }

    getIcon(mimeType: string): string {
        return this.thumbnailService.getMimeTypeIcon(mimeType);
    }

    getColumnValue(file, prop: DisplayableCMProperties): string {
        if (!file.properties[prop.prefixedName]) {
            const fieldProperty = this.field.params.displayableCMProperties?.find((property) => property.name === prop.name);
            return fieldProperty.defaultValue ? this.checkDateTypeAndTransform(prop.dataType, fieldProperty.defaultValue) : '--';
        }
        return file.properties[prop.prefixedName] ? this.checkDateTypeAndTransform(prop.dataType, file.properties[prop.prefixedName]) : '--';
    }

    private checkDateTypeAndTransform(dataType: string, value: any): string {
        if (dataType === 'd:date') {
            return this.localizedDatePipe.transform(value);
        } else if (dataType === 'd:datetime') {
            return this.localizedDatePipe.transform(value, 'medium');
        }
        return value;
    }

    displayMenuOption(option: string): boolean {
        return this.field?.params?.menuOptions ? this.field.params.menuOptions[option] : option !== RETRIEVE_METADATA_OPTION;
    }
}
