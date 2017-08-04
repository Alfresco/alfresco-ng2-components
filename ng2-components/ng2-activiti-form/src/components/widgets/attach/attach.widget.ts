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

 /* tslint:disable:component-selector  */

import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ActivitiAlfrescoContentService } from '../../../services/activiti-alfresco.service';
import { ExternalContent } from '../core/external-content';
import { ExternalContentLink } from '../core/external-content-link';
import { FormFieldModel } from '../core/form-field.model';
import { FormService } from './../../../services/form.service';
import { baseHost , WidgetComponent } from './../widget.component';

declare let dialogPolyfill: any;

@Component({
    selector: 'attach-widget',
    templateUrl: './attach.widget.html',
    styleUrls: ['./attach.widget.css'], host: baseHost
})
export class AttachWidgetComponent extends WidgetComponent implements OnInit {

    selectedFolderPathId: string;
    selectedFolderSiteId: string;
    selectedFolderSiteName: string;
    selectedFolderAccountId: string;
    fileName: string;
    selectedFolderNodes: [ExternalContent];
    selectedFile: ExternalContent;

    @Input()
    field: FormFieldModel;

    @Output()
    fieldChanged: EventEmitter<FormFieldModel> = new EventEmitter<FormFieldModel>();

    @Output()
    error: EventEmitter<any> = new EventEmitter<any>();

    @ViewChild('dialog')
    dialog: any;

    constructor(public formService: FormService,
                private contentService: ActivitiAlfrescoContentService) {
         super(formService);
    }

    ngOnInit() {
        if (this.field) {
            let params = this.field.params;

            if (params &&
                params.fileSource &&
                params.fileSource.selectedFolder) {
                this.selectedFolderSiteId = params.fileSource.selectedFolder.siteId;
                this.selectedFolderSiteName = params.fileSource.selectedFolder.site;
                this.setupFileBrowser();
                this.getExternalContentNodes();
            }
        }
    }

    setupFileBrowser() {
        if (this.field) {
            let params = this.field.params;
            this.selectedFolderPathId = params.fileSource.selectedFolder.pathId;
            this.selectedFolderAccountId = params.fileSource.selectedFolder.accountId;
        }
    }

    getLinkedFileName(): string {
        let result = this.fileName;

        if (this.selectedFile &&
            this.selectedFile.title) {
            result = this.selectedFile.title;
        }
        if (this.field &&
            this.field.value &&
            this.field.value.length > 0 &&
            this.field.value[0].name) {
            result = this.field.value[0].name;
        }

        return result;
    }

    getExternalContentNodes() {
        this.contentService.getAlfrescoNodes(this.selectedFolderAccountId, this.selectedFolderPathId)
            .subscribe(
                nodes => this.selectedFolderNodes = nodes,
                (err) => {
                    this.error.emit(err);
                }
            );
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

    showDialog(): boolean {
        this.setupFileBrowser();
        this.getExternalContentNodes();

        if (this.dialog) {
            if (!this.dialog.nativeElement.showModal) {
                dialogPolyfill.registerDialog(this.dialog.nativeElement);
            }

            this.dialog.nativeElement.showModal();
            return true;
        }
        return false;
    }

    private closeDialog() {
        if (this.dialog) {
            this.dialog.nativeElement.close();
        }
    }

    cancel() {
        this.closeDialog();
    }

    reset() {
        this.field.value = null;
        this.field.json.value = null;
    }

    hasFile(): boolean {
        return this.field && this.field.value;
    }

}
