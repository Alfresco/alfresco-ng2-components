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

import { Component } from 'angular2/core';
import { bootstrap } from 'angular2/platform/browser';
import { HTTP_PROVIDERS } from 'angular2/http';
import { AlfrescoSettingsService, AlfrescoTranslationService, AlfrescoTranslationLoader } from 'ng2-alfresco-core/dist/ng2-alfresco-core';
import { ALFRESCO_ULPOAD_COMPONENTS, UploadService } from 'ng2-alfresco-upload/dist/ng2-alfresco-upload';


@Component({
    selector: 'my-app',
    template: `<label for="token">Access Token</label><br>
               <input id="token" type="text" size="48" (change)="updateToken()" [(ngModel)]="token"><br><br>
               <alfresco-upload-button [showUdoNotificationBar]="true"
                                       [uploadFolders]="false"
                                       [multipleFiles]="false"
                                       (onSuccess)="customMethod($event)">
               </alfresco-upload-button>

               <br><br>

               <alfresco-upload-button [showUdoNotificationBar]="true"
                                       [uploadFolders]="true"
                                       [multipleFiles]="false"
                                       (onSuccess)="customMethod($event)">
               </alfresco-upload-button>

               <br><br>

               <alfresco-upload-button [showUdoNotificationBar]="true"
                                       [uploadFolders]="false"
                                       [multipleFiles]="true"
                                       (onSuccess)="customMethod($event)">
               </alfresco-upload-button>

               <br><br>

               <alfresco-upload-drag-area (onSuccess)="customMethod($event)" >
                     <div style="width: 200px; height: 100px; border: 1px solid #888888">
                         DRAG HERE
                     </div>
               </alfresco-upload-drag-area>
               <file-uploading-dialog></file-uploading-dialog>`,
    directives: [ALFRESCO_ULPOAD_COMPONENTS]
})
export class MyDemoApp {
    token: string;

    constructor(alfrescoSettingsService: AlfrescoSettingsService) {
        alfrescoSettingsService.host = 'http://192.168.99.100:8080';

        if (localStorage.getItem('token')) {
            this.token = localStorage.getItem('token');
        }
    }

    updateToken() {
        localStorage.setItem('token', this.token);
    }

    public customMethod(event: Object): void {
        console.log('File uploaded');
    }
}

bootstrap(MyDemoApp, [
    HTTP_PROVIDERS,
    AlfrescoTranslationService,
    AlfrescoTranslationLoader,
    AlfrescoSettingsService,
    UploadService
]);
