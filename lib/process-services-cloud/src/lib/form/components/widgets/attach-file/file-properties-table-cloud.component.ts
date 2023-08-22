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
import { LocalizedDatePipe, ThumbnailService, FormFieldModel } from '@alfresco/adf-core';
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
    field: FormFieldModel;

    @Input()
    displayedColumns: string[];

    @Input()
    mimeTypeIcon: string;

    @Output()
    rowClicked: EventEmitter<Node> = new EventEmitter<Node>();

    @Output()
    showClicked: EventEmitter<Node> = new EventEmitter<Node>();

    @Output()
    downloadClicked: EventEmitter<Node> = new EventEmitter<Node>();

    @Output()
    newVersionClicked: EventEmitter<NewVersionUploaderDialogData> = new EventEmitter<NewVersionUploaderDialogData>();

    @Output()
    retrieveMetadataClicked: EventEmitter<Node> = new EventEmitter<Node>();

    @Output()
    removeClicked: EventEmitter<Node> = new EventEmitter<Node>();

    constructor(private localizedDatePipe: LocalizedDatePipe, private thumbnailService: ThumbnailService) {}

    onRowClicked(node: Node) {
        this.rowClicked.emit(node);
    }

    onShowClicked(node: Node) {
        this.showClicked.emit(node);
    }

    onDownloadClicked(node: Node) {
        this.downloadClicked.emit(node);
    }

    onNewVersionClicked(customEvent: CustomEvent, node: Node) {
        const newVersionUploaderDialogData: NewVersionUploaderDialogData = {
            file: customEvent.detail.files[0].file,
            node
        };
        this.newVersionClicked.emit(newVersionUploaderDialogData);
    }

    onRetrieveMetadataClicked(node: Node) {
        this.retrieveMetadataClicked.emit(node);
    }

    onRemoveClicked(node: Node) {
        this.removeClicked.emit(node);
    }

    getIcon(mimeType: string): string {
        return this.thumbnailService.getMimeTypeIcon(mimeType);
    }

    displayMenuOption(option: string): boolean {
        return this.field?.params?.menuOptions ? this.field.params.menuOptions[option] : option !== RETRIEVE_METADATA_OPTION;
    }

    getColumnValue(node: Node, displayableCMProperty): string {
        if (!node.properties[displayableCMProperty.prefixedName]) {
            const fieldProperty = this.field.params.displayableCMProperties?.find(property => property.name === displayableCMProperty.name);
            return fieldProperty.defaultValue ? this.checkDateTypeAndTransform(displayableCMProperty.dataType, fieldProperty.defaultValue) : '--' ;
        }
        return node.properties[displayableCMProperty.prefixedName] ?
            this.checkDateTypeAndTransform(displayableCMProperty.dataType, node.properties[displayableCMProperty.prefixedName]) :
            '--' ;
    }

    private checkDateTypeAndTransform(dataType: string, value: string): string {
        if (dataType === 'd:date') {
            return this.localizedDatePipe.transform(value);
        } else if (dataType === 'd:datetime') {
            return this.localizedDatePipe.transform(value, 'medium');
        }
        return value;
    }
}
