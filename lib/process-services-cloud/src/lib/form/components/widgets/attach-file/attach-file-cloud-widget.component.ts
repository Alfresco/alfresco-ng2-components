/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

/* tslint:disable:component-selector */

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
    FormService,
    LogService,
    ThumbnailService,
    NotificationService,
    FormValues,
    ContentLinkModel,
    AppConfigService,
    AlfrescoApiService,
    UploadWidgetContentLinkModel
} from '@alfresco/adf-core';
import { Node, RelatedContentRepresentation } from '@alfresco/js-api';
import { ContentCloudNodeSelectorService } from '../../../services/content-cloud-node-selector.service';
import { ProcessCloudContentService } from '../../../services/process-cloud-content.service';
import { UploadCloudWidgetComponent } from './upload-cloud.widget';
import { DestinationFolderPathModel } from '../../../models/form-cloud-representation.model';

@Component({
    selector: 'adf-cloud-attach-file-cloud-widget',
    templateUrl: './attach-file-cloud-widget.component.html',
    styleUrls: ['./attach-file-cloud-widget.component.scss'],
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
export class AttachFileCloudWidgetComponent extends UploadCloudWidgetComponent implements OnInit {

    static ALIAS_USER_FOLDER = '-my-';
    static APP_NAME = '-appname-';
    static VALID_ALIAS = ['-root-', AttachFileCloudWidgetComponent.ALIAS_USER_FOLDER, '-shared-'];
    static RETRIEVE_METADATA_OPTION = 'retrieveMetadata';

    typeId = 'AttachFileCloudWidgetComponent';
    rootNodeId = AttachFileCloudWidgetComponent.ALIAS_USER_FOLDER;
    selectedNode: Node;

    constructor(
        formService: FormService,
        logger: LogService,
        thumbnails: ThumbnailService,
        processCloudContentService: ProcessCloudContentService,
        notificationService: NotificationService,
        private contentNodeSelectorService: ContentCloudNodeSelectorService,
        private appConfigService: AppConfigService,
        private apiService: AlfrescoApiService
    ) {
        super(formService, thumbnails, processCloudContentService, notificationService, logger);
    }

    ngOnInit() {
        super.ngOnInit();
        if (this.hasFile && this.field.value.length === 1) {
            const files = this.field.value || this.field.form.values[this.field.id];
            this.contentModelFormFileHandler(files[0]);
        }
    }

    isAlfrescoAndLocal(): boolean {
        return (
            this.field.params &&
            this.field.params.fileSource &&
            this.field.params.fileSource.serviceId === 'all-file-sources'
        );
    }

    isUploadButtonVisible(): boolean {
        return (!this.hasFile || this.multipleOption) && !this.field.readOnly;
    }

    onRemoveAttachFile(file: File | RelatedContentRepresentation | Node) {
        this.removeFile(file);
        if (!this.field.value || this.field.value.length === 0) {
            this.contentModelFormFileHandler();
        }
    }

    fetchAppNameFromAppConfig(): string {
        return this.appConfigService.get('alfresco-deployed-apps')[0]?.name;
    }

    replaceAppNameAliasWithValue(path: string): string {
        if (path?.match(AttachFileCloudWidgetComponent.APP_NAME)) {
            const appName = this.fetchAppNameFromAppConfig();
            return path.replace(AttachFileCloudWidgetComponent.APP_NAME, appName);
        }
        return path;
    }

    async openSelectDialog() {
        const selectedMode = this.field.params.multiple ? 'multiple' : 'single';

        if (this.isAlfrescoAndLocal()) {
            const destinationFolderPath = this.getAliasAndRelativePathFromDestinationFolderPath(this.field.params.fileSource.destinationFolderPath);
            destinationFolderPath.path = this.replaceAppNameAliasWithValue(destinationFolderPath.path);
            const nodeId = await this.contentNodeSelectorService.fetchNodeIdFromRelativePath(destinationFolderPath.alias, { relativePath: destinationFolderPath.path });
            this.rootNodeId = nodeId ? nodeId : destinationFolderPath.alias;
        }

        this.contentNodeSelectorService
            .openUploadFileDialog(this.rootNodeId, selectedMode, this.isAlfrescoAndLocal())
            .subscribe((selections: Node[]) => {
                selections.forEach(node => (node['isExternal'] = true));
                const selectionWithoutDuplication = this.removeExistingSelection(selections);
                this.fixIncompatibilityFromPreviousAndNewForm(selectionWithoutDuplication);
                if (this.field.value.length === 1) {
                    this.contentModelFormFileHandler(selections && selections.length > 0 ? selections[0] : null);
                }
            });
    }

    getAliasAndRelativePathFromDestinationFolderPath(destinationFolderPath: string): DestinationFolderPathModel {
        let alias: string; let path: string;
        if (destinationFolderPath) {
            const startOfRelativePathIndex = destinationFolderPath.indexOf('/');
            if (startOfRelativePathIndex >= 0) {
                alias = destinationFolderPath.substring(0, startOfRelativePathIndex);
                path = destinationFolderPath.substring(startOfRelativePathIndex, destinationFolderPath.length);
            } else {
                alias = destinationFolderPath;
            }
        }

        return this.isValidAlias(alias) ? { alias, path } : { alias: AttachFileCloudWidgetComponent.ALIAS_USER_FOLDER, path: undefined };
    }

    removeExistingSelection(selections: Node[]) {
        const existingNode: Node[] = [...this.field.value || []];
        return selections.filter(opt => !existingNode.some((node) => node.id === opt.id));
    }

    downloadContent(file: Node): void {
        this.processCloudContentService.downloadFile(file.id);
    }

    onAttachFileClicked(nodeSelector: any) {
        nodeSelector.nodeId = nodeSelector.id;
        this.fileClicked(new ContentLinkModel(nodeSelector));
    }

    getWidgetIcon(): string {
        return this.isAlfrescoAndLocal() ? 'file_upload' : 'attach_file';
    }

    displayMenuOption(option: string): boolean {
        return this.field?.params?.menuOptions ? this.field.params.menuOptions[option] : option !== AttachFileCloudWidgetComponent.RETRIEVE_METADATA_OPTION;
    }

    contentModelFormFileHandler(file?: Node) {
        if (file?.id && this.field?.params?.menuOptions[AttachFileCloudWidgetComponent.RETRIEVE_METADATA_OPTION]) {
            const values: FormValues = {};
            this.apiService.getInstance().node.getNode(file.id).then(acsNode => {
                const metadata = acsNode?.entry?.properties;
                if (metadata) {
                    const keys = Object.keys(metadata);
                    keys.forEach(key => {
                        const sanitizedKey = key.replace(':', '_');
                        values[sanitizedKey] = metadata[key];
                    });
                    this.formService.updateFormValuesRequested.next(values);
                }
            });
        }
        this.selectedNode = file;
        this.fileClicked(new UploadWidgetContentLinkModel(file, this.field.id));
    }

    isValidAlias(alias: string): boolean {
        return alias && AttachFileCloudWidgetComponent.VALID_ALIAS.includes(alias);
    }
}
