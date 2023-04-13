/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LocalizedDatePipe, ThumbnailService } from '@alfresco/adf-core';
import { Node } from '@alfresco/js-api';
import { NewVersionUploaderDialogData } from '@alfresco/adf-content-services';

export const RETRIEVE_METADATA_OPTION = 'retrieveMetadata';

@Component({
    selector: 'adf-cloud-file-properties-table',
    templateUrl: './file-properties-table-cloud.component.html',
    styleUrls: ['./file-properties-table-cloud.component.scss']
})
export class FilePropertiesTableCloudComponent {
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
    rowClick: EventEmitter<Node> = new EventEmitter<Node>();

    @Output()
    attachFileClick: EventEmitter<any> = new EventEmitter<any>();

    @Output()
    downloadFile: EventEmitter<Node> = new EventEmitter<Node>();

    @Output()
    uploadNewFileVersion: EventEmitter<NewVersionUploaderDialogData> = new EventEmitter<NewVersionUploaderDialogData>();

    @Output()
    contentModelFileHandler: EventEmitter<any> = new EventEmitter<Node>();

    @Output()
    removeAttachFile: EventEmitter<any> = new EventEmitter<any>();

    constructor(private localizedDatePipe: LocalizedDatePipe, private thumbnailService: ThumbnailService) {}

    onRowClicked(file?: Node) {
        this.rowClick.emit(file);
    }

    onAttachFileClicked(nodeSelector: any) {
        this.attachFileClick.emit(nodeSelector);
    }

    downloadContent(file: Node) {
        this.downloadFile.emit(file);
    }

    onUploadNewFileVersion(customEvent: any, node: Node){
        const newVersionUploaderDialogData: NewVersionUploaderDialogData = {
            file: customEvent.detail.files[0].file,
            node
        };
        this.uploadNewFileVersion.emit(newVersionUploaderDialogData);
    }

    contentModelFormFileHandler(file?: any) {
        this.contentModelFileHandler.emit(file);
    }

    onRemoveAttachFile(file: any) {
        this.removeAttachFile.emit(file);
    }

    getIcon(mimeType: string): string {
        return this.thumbnailService.getMimeTypeIcon(mimeType);
    }

    getColumnValue(file, displayableCMProperty): string {
        if (!file.properties[displayableCMProperty.prefixedName]) {
            const fieldProperty = this.field.params.displayableCMProperties?.find(property => property.name === displayableCMProperty.name);
            return fieldProperty.defaultValue ? this.checkDateTypeAndTransform(displayableCMProperty.dataType, fieldProperty.defaultValue) : '--' ;
        }
        return file.properties[displayableCMProperty.prefixedName] ?
            this.checkDateTypeAndTransform(displayableCMProperty.dataType, file.properties[displayableCMProperty.prefixedName]) :
            '--' ;
    }

    checkDateTypeAndTransform(dataType, value): string {
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
