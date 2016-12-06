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

import { Component, OnInit, Optional, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AlfrescoAuthenticationService } from 'ng2-alfresco-core';
import {
    DocumentActionsService,
    DocumentList,
    ContentActionHandler,
    DocumentActionModel,
    FolderActionModel
} from 'ng2-alfresco-documentlist';
import { FormService } from 'ng2-activiti-form';

@Component({
    selector: 'files-component',
    templateUrl: './files.component.html',
    styleUrls: ['./files.component.css']
})
export class FilesComponent implements OnInit {
    currentPath: string = '/Sites/swsdp/documentLibrary';
    currentFolderId: string = null;

    errorMessage: string = null;
    fileNodeId: any;
    fileShowed: boolean = false;
    multipleFileUpload: boolean = false;
    folderUpload: boolean = false;
    acceptedFilesTypeShow: boolean = false;
    versioning: boolean = false;

    acceptedFilesType: string = '.jpg,.pdf,.js';

    @ViewChild(DocumentList)
    documentList: DocumentList;

    constructor(private documentActions: DocumentActionsService,
                public auth: AlfrescoAuthenticationService,
                private formService: FormService,
                private router: Router,
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

    onFolderChanged(event?: any) {
        if (event) {
            this.currentPath = event.path;
        }
    }

    onBreadcrumbPathChanged(event?: any) {
        if (event) {
            this.currentPath = event.value;
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
                this.currentFolderId = params.hasOwnProperty('id') ? params['id'] : null;
            });
        }
        if (this.auth.isBpmLoggedIn()) {
            this.formService.getProcessDefinitions().subscribe(
                defs => this.setupBpmActions(defs || []),
                err => console.log(err)
            );
        } else {
            console.log('You are not logged in');
        }
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
}
