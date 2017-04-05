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

import { Component, OnInit, AfterViewInit, Optional, ViewChild, ViewChildren, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AlfrescoAuthenticationService, LogService, NotificationService } from 'ng2-alfresco-core';
import { DocumentActionsService, DocumentListComponent, ContentActionHandler, DocumentActionModel, FolderActionModel } from 'ng2-alfresco-documentlist';
import { FormService } from 'ng2-activiti-form';
import { UploadButtonComponent, UploadDragAreaComponent } from 'ng2-alfresco-upload';

@Component({
    selector: 'files-component',
    templateUrl: './files.component.html',
    styleUrls: ['./files.component.css']
})
export class FilesComponent implements OnInit, AfterViewInit {
    // The identifier of a node. You can also use one of these well-known aliases: -my- | -shared- | -root-
    currentFolderId: string = '-my-';

    errorMessage: string = null;
    fileNodeId: any;
    fileShowed: boolean = false;
    multipleFileUpload: boolean = false;
    folderUpload: boolean = false;
    acceptedFilesTypeShow: boolean = false;
    versioning: boolean = false;
    acceptedFilesType: string = '.jpg,.pdf,.js';

    @ViewChild(DocumentListComponent)
    documentList: DocumentListComponent;

    @ViewChild(UploadButtonComponent)
    uploadButton: UploadButtonComponent;

    @ViewChild(UploadDragAreaComponent)
    uploadDragArea: UploadDragAreaComponent;

    constructor(private documentActions: DocumentActionsService,
                private authService: AlfrescoAuthenticationService,
                private formService: FormService,
                private logService: LogService,
                private changeDetector: ChangeDetectorRef,
                private router: Router,
                private notificationService: NotificationService,
                @Optional() private route: ActivatedRoute) {
        documentActions.setHandler('my-handler', this.myDocumentActionHandler.bind(this));
    }

    myDocumentActionHandler(obj: any) {
        window.alert('my custom action handler');
    }

    myCustomAction1(event) {
        alert('Custom document action for ' + event.value.entry.name);
    }

    myFolderAction1(event) {
        alert('Custom folder action for ' + event.value.entry.name);
    }

    showFile(event) {
        if (event.value.entry.isFile) {
            this.fileNodeId = event.value.entry.id;
            this.fileShowed = true;
        } else {
            this.fileShowed = false;
        }
    }

    toggleMultipleFileUpload() {
        this.multipleFileUpload = !this.multipleFileUpload;
        return this.multipleFileUpload;
    }

    toggleFolder() {
        this.multipleFileUpload = false;
        this.folderUpload = !this.folderUpload;
        return this.folderUpload;
    }

    toggleAcceptedFilesType() {
        this.acceptedFilesTypeShow = !this.acceptedFilesTypeShow;
        return this.acceptedFilesTypeShow;
    }

    toggleVersioning() {
        this.versioning = !this.versioning;
        return this.versioning;
    }

    ngOnInit() {
        if (this.route) {
            this.route.params.forEach((params: Params) => {
                if (params['id']) {
                    this.currentFolderId = params['id'];
                    this.changeDetector.detectChanges();
                }
            });
        }
        if (this.authService.isBpmLoggedIn()) {
            this.formService.getProcessDefinitions().subscribe(
                defs => this.setupBpmActions(defs || []),
                err => this.logService.error(err)
            );
        } else {
            this.logService.warn('You are not logged in to BPM');
        }
    }

    ngAfterViewInit() {
        this.uploadButton.onSuccess
            .debounceTime(100)
            .subscribe((event)=> {
                this.reload(event);
            });

        this.uploadDragArea.onSuccess
            .debounceTime(100)
            .subscribe((event)=> {
                this.reload(event);
            });
    }

    viewActivitiForm(event?: any) {
        this.router.navigate(['/activiti/tasksnode', event.value.entry.id]);
    }

    onNavigationError(err: any) {
        if (err) {
            this.errorMessage = err.message || 'Navigation error';
        }
    }

    resetError() {
        this.errorMessage = null;
    }

    private setupBpmActions(actions: any[]) {
        actions.map(def => {
            let documentAction = new DocumentActionModel();
            documentAction.title = 'Activiti: ' + (def.name || 'Unknown process');
            documentAction.handler = this.getBpmActionHandler(def);
            this.documentList.actions.push(documentAction);

            let folderAction = new FolderActionModel();
            folderAction.title = 'Activiti: ' + (def.name || 'Unknown process');
            folderAction.handler = this.getBpmActionHandler(def);
            this.documentList.actions.push(folderAction);
        });
    }

    private getBpmActionHandler(processDefinition: any): ContentActionHandler {
        return function (obj: any, target?: any) {
            window.alert(`Starting BPM process: ${processDefinition.id}`);
        }.bind(this);
    }

    onPermissionsFailed(event: any){
        if (event.action === 'delete') {
            this.notificationService.openSnackMessage(`you don't have permission to delete this `+ event.type, 4000);
        }
    }

    reload(event: any) {
        if (event && event.value && event.value.entry && event.value.entry.parentId) {
            if (this.documentList.currentFolderId === event.value.entry.parentId) {
                this.documentList.reload();
            }
        }
    }
}
