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

import { NgModule, Component, OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { CoreModule, SettingsService, AuthService, StorageService } from 'ng2-alfresco-core';
import { UploadModule } from 'ng2-alfresco-upload';

@Component({
    selector: 'alfresco-app-demo',
    template: `<label for="ticket"><b>Insert a valid access ticket / ticket:</b></label><br>
               <input id="ticket" type="text" size="48" (change)="updateTicket()" [(ngModel)]="ticket"><br>
               <label for="host"><b>Insert the ip of your Alfresco instance:</b></label><br>
               <input id="host" type="text" size="48" (change)="updateHost()" [(ngModel)]="ecmHost"><br><br>
               <div *ngIf="!authenticated" style="color:#FF2323">
                    Authentication failed to ip {{ host }} with user: admin, admin, you can still try to add a valid ticket to perform
                    operations.
               </div>

                <h5>Upload</h5>
                <br>
                <div *ngIf="acceptedFilesTypeShow">
                    <span class="mdl-input__label">Extension accepted</span>
                    <input type="text" data-automation-id="accepted-files-type" [(ngModel)]="acceptedFilesType">
                    <br/>
                </div>
                <div *ngIf="!acceptedFilesTypeShow">
                    <alfresco-upload-button data-automation-id="multiple-file-upload"
                                            [currentFolderPath]="currentPath"
                                            [multipleFiles]="multipleFileUpload"
                                            [uploadFolders]="folderUpload"
                                            [versioning] = "versioning"
                                            (onSuccess)="documentList.reload()">
                        <div class="mdl-spinner mdl-js-spinner is-active"></div>
                    </alfresco-upload-button>
                </div>
                <div *ngIf="acceptedFilesTypeShow">
                    <alfresco-upload-button data-automation-id="multiple-file-upload"
                                            [currentFolderPath]="currentPath"
                                            acceptedFilesType="{{acceptedFilesType}}"
                                            [multipleFiles]="multipleFileUpload"
                                            [uploadFolders]="folderUpload"
                                            [versioning] = "versioning"
                                            (onSuccess)="documentList.reload()">
                        <div class="mdl-spinner mdl-js-spinner is-active"></div>
                    </alfresco-upload-button>
                </div>

                <p style="width:250px;margin: 20px;">
                    <label for="switch-multiple-file" class="mdl-switch mdl-js-switch mdl-js-ripple-effect">
                        <input type="checkbox" id="switch-multiple-file" class="mdl-switch__input" (change)="toggleMultipleFileUpload()" >
                        <span class="mdl-switch__label">Multiple File Upload</span>
                    </label>
                </p>

                <p style="width:250px;margin: 20px;">
                    <label for="switch-folder-upload" class="mdl-switch mdl-js-switch mdl-js-ripple-effect">
                        <input type="checkbox" id="switch-folder-upload" class="mdl-switch__input" (change)="toggleFolder()">
                        <span class="mdl-switch__label">Folder Upload</span>
                    </label>
                </p>

                <p style="width:250px;margin: 20px;">
                    <label for="switch-accepted-file-type" class="mdl-switch mdl-js-switch mdl-js-ripple-effect">
                        <input type="checkbox" id="switch-accepted-file-type" class="mdl-switch__input" (change)="toggleAcceptedFilesType()">
                        <span class="mdl-switch__label">Filter extension</span>
                    </label>
                </p>

                <p style="width:250px;margin: 20px;">
                    <label for="switch-versioning" class="mdl-switch mdl-js-switch mdl-js-ripple-effect">
                        <input type="checkbox" id="switch-versioning" class="mdl-switch__input" (change)="toggleVersioning()">
                        <span class="mdl-switch__label">Versioning</span>
                    </label>
                </p>
               <br><br>

               <alfresco-upload-drag-area (onSuccess)="customMethod($event)" class="upload-border">
                     <div class="drag-area">
                         DRAG HERE
                     </div>
               </alfresco-upload-drag-area>
               <file-uploading-dialog></file-uploading-dialog>
               `,
    styles: [`.upload-border { position: absolute; padding: 5px 5px }`,
        `.drag-area { width: 200px; height: 100px; border: 1px solid #888888;}`]
})
export class MyDemoApp implements OnInit {

    public ecmHost: string = 'http://localhost:8080';

    authenticated: boolean;
    multipleFileUpload: boolean = false;
    folderUpload: boolean = false;
    acceptedFilesTypeShow: boolean = false;
    versioning: boolean = false;

    ticket: string;

    constructor(private authService: AuthService,
                private settingsService: SettingsService,
                private storage: StorageService) {
        settingsService.ecmHost = this.ecmHost;
        settingsService.setProviders('ECM');

        if (this.authService.getTicketEcm()) {
            this.ticket = this.authService.getTicketEcm();
        }
    }

    public updateTicket(): void {
        this.storage.setItem('ticket-ECM', this.ticket);
    }

    public updateHost(): void {
        this.settingsService.ecmHost = this.ecmHost;
        this.login();
    }

    public customMethod(event: Object): void {
        console.log('File uploaded');
    }

    public ngOnInit(): void {
        this.login();
    }

    login() {
        this.authService.login('admin', 'admin').subscribe(
            ticket => {
                console.log(ticket);
                this.ticket = this.authService.getTicketEcm();
                this.authenticated = true;
            },
            error => {
                console.log(error);
                this.authenticated = false;
            });
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
}

@NgModule({
    imports: [
        BrowserModule,
        CoreModule.forRoot(),
        UploadModule.forRoot()
    ],
    declarations: [ MyDemoApp ],
    bootstrap:    [ MyDemoApp ]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
