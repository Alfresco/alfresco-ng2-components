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

import { Component, OnInit } from '@angular/core';
import { WidgetComponent } from './../widget.component';
import { AlfrescoSettingsService, AlfrescoAuthenticationService } from 'ng2-alfresco-core';

declare let __moduleName: string;
declare var componentHandler;

@Component({
    moduleId: __moduleName,
    selector: 'upload-widget',
    templateUrl: './upload.widget.html',
    styleUrls: ['./upload.widget.css']
})
export class UploadWidget extends WidgetComponent implements OnInit {

    constructor(private settingsService: AlfrescoSettingsService,
                private authService: AlfrescoAuthenticationService) {
        super();
    }

    hasFile: boolean;
    fileName: string;

    ngOnInit() {
        if (this.field &&
            this.field.value &&
            this.field.value.length > 0) {
            this.hasFile = true;
        }
    }

    getUploadedFileName(): string {
        let result = this.fileName;

        if (this.field &&
            this.field.value &&
            this.field.value.length > 0) {
            let file = this.field.value[0];
            result = file.name;
        }

        return result;
    }

    reset() {
        this.field.value = null;
        this.field.json.value = null;
        this.hasFile = false;
    }

    onFileChanged(event: any) {
        let files = event.srcElement.files;
        if (files && files.length > 0) {

            let file = files[0];

            this.hasFile = true;
            this.fileName = file.name;

            let formData: FormData = new FormData();
            formData.append('file', file, file.name);

            let xhr: XMLHttpRequest = new XMLHttpRequest();

            xhr.withCredentials = true;

            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        let jsonFile = JSON.parse(xhr.response);
                        console.log(jsonFile);
                        this.field.value = [jsonFile];
                        this.field.json.value = [jsonFile];
                    } else {
                        console.error(xhr.response);
                        window.alert('Error uploading file. See console output for more details.');
                    }
                }
            };

            let url = `${this.settingsService.bpmHost}/activiti-app/app/rest/content/raw`;
            xhr.open('POST', url, true);
            xhr.setRequestHeader('Authorization', this.authService.getTicketBpm());
            xhr.send(formData);
        }
    }

}
