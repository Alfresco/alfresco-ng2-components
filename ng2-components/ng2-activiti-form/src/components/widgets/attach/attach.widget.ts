/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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

import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { WidgetComponent } from './../widget.component';
import { ActivitiAlfrescoContentService } from '../../../services/activiti-alfresco.service';
import { ExternalContent } from '../core/external-content';
import { ExternalContentLink } from '../core/external-content-link';
import { FormFieldModel } from '../core/form-field.model';

declare let __moduleName: string;
declare var componentHandler;
declare let dialogPolyfill: any;

@Component({
    moduleId: __moduleName,
    selector: 'attach-widget',
    templateUrl: './attach.widget.html',
    styleUrls: ['./attach.widget.css']
})
export class AttachWidget extends WidgetComponent implements OnInit {

    selectedFolderPathId: string;
    selectedFolderSiteId: string;
    selectedFolderSiteName: string;
    selectedFolderAccountId: string;
    fileName: string;
    hasFile: boolean;
    selectedFolderNodes: [ExternalContent];
    selectedFile: ExternalContent;

    @Input()
    field: FormFieldModel;

    @Output()
    fieldChanged: EventEmitter<FormFieldModel> = new EventEmitter<FormFieldModel>();

    @ViewChild('dialog')
    dialog: any;

    constructor(private contentService: ActivitiAlfrescoContentService) {
        super();
    }

    ngOnInit() {
        if (this.field &&
            this.field.value) {
            this.hasFile = true;
        }
        if (this.field &&
            this.field.params &&
            this.field.params.fileSource &&
            this.field.params.fileSource.selectedFolder) {
            this.selectedFolderSiteId = this.field.params.fileSource.selectedFolder.siteId;
            this.selectedFolderSiteName = this.field.params.fileSource.selectedFolder.site;
            this.setupFileBrowser();
            this.getExternalContentNodes();
        }
    }

    private setupFileBrowser() {
        this.selectedFolderPathId = this.field.params.fileSource.selectedFolder.pathId;
        this.selectedFolderAccountId = this.field.params.fileSource.selectedFolder.accountId;
    }

    getLinkedFileName(): string {
        let result = this.fileName;

        if (this.selectedFile &&
            this.selectedFile.title) {
            result = this.selectedFile.title;
        }
        if (this.field.value &&
            this.field.value.length > 0 &&
            this.field.value[0].name) {
            result = this.field.value[0].name;
        }

        return result;
    }

    private getExternalContentNodes() {

        this.contentService.getAlfrescoNodes(this.selectedFolderAccountId, this.selectedFolderPathId)
            .subscribe(
                (nodes) => {
                    this.selectedFolderNodes = nodes;
                },
                error =>  console.error(error));
    }

    selectFile(node: ExternalContent, $event: any) {
        this.contentService.linkAlfrescoNode(this.selectedFolderAccountId, node, this.selectedFolderSiteId).subscribe(
            (link: ExternalContentLink) => {
                this.selectedFile = node;
                this.field.value = [link];
                this.field.json.value = [link];
                this.closeDialog();
                this.fieldChanged.emit(this.field);
            }
        );
    }

    selectFolder(node: ExternalContent, $event: any) {
        this.selectedFolderPathId = node.id;
        this.getExternalContentNodes();
    }

    public showDialog() {
        this.setupFileBrowser();
        this.getExternalContentNodes();

        if (!this.dialog.nativeElement.showModal) {
            dialogPolyfill.registerDialog(this.dialog.nativeElement);
        }

        if (this.dialog) {
            this.dialog.nativeElement.showModal();
        }
    }

    private closeDialog() {
        if (this.dialog) {
            this.dialog.nativeElement.close();
        }
    }

    public cancel() {
        this.closeDialog();
    }

    reset() {
        this.field.value = null;
        this.field.json.value = null;
        this.hasFile = false;
    }

}
