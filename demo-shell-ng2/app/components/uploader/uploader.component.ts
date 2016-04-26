/**
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
import {Component, NgZone} from 'angular2/core';
import {UPLOAD_DIRECTIVES} from 'ng2-uploader/ng2-uploader';
import {AlfrescoSettingsService} from 'ng2-alfresco-core/services';

@Component({
    selector: 'alfresco-uploader',
    styles: [
        `
        :host .dropzone {
            width: 100%;
            height: 100px;
            background-color: #f5f5f5;
            margin-top: 2px;
            margin-bottom: 2px;
            box-shadow: inset 0 1px 2px rgba(0,0,0,.1);
            text-align: center;
        }
        `
    ],
    template: `
        <div class="container">
            <div class="row">
                <h2>Upload File</h2>
                <input type="file" 
                       [ng-file-select]="options"
                       (onUpload)="handleUpload($event)">
                <div>
                    Response: {{ uploadFile | json }}
                </div>
            </div>
            <div class="row">
                <h2>Drag and Drop file demo</h2>
                <div class="col-md-4 col-md-offset-3">
                    <div [ng-file-drop]="options" (onUpload)="handleDropUpload($event)" class="dropzone">
                        Drop file here...
                    </div>
                    <div class="progress">
                        <div class="progress-bar" [style.width]="dropProgress + '%'"></div>
                        <span class="percent">{{ dropProgress }}%</span>
                    </div>
                </div>
            </div>
        </div>
    `,
    directives: [UPLOAD_DIRECTIVES]
})
export class UploaderComponent {
    uploadFile:any;
    options:Object;

    zone:NgZone;
    dropProgress:number = 0;
    dropResp:any[] = [];

    constructor(settings:AlfrescoSettingsService) {
        this.options = {
            url: settings.host + '/alfresco/service/api/upload',
            withCredentials: true,
            authToken: btoa('admin:admin'),
            authTokenPrefix: 'Basic',
            fieldName: 'filedata',
            formFields: {
                siteid: 'swsdp',
                containerid: 'documentLibrary'
            }
        };
        this.zone = new NgZone({enableLongStackTrace: false});
    }

    handleUpload(data):void {
        if (data && data.response) {
            data = JSON.parse(data.response);
            this.uploadFile = data;
        }
    }

    handleDropUpload(data):void {
        let index = this.dropResp.findIndex(x => x.id === data.id);
        if (index === -1) {
            this.dropResp.push(data);
        } else {
            this.zone.run(() => {
                this.dropResp[index] = data;
            });
        }

        let total = 0, uploaded = 0;
        this.dropResp.forEach(resp => {
            total += resp.progress.total;
            uploaded += resp.progress.loaded;
        });

        this.dropProgress = Math.floor(uploaded / (total / 100));
    }
}
