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
import { LogService } from 'ng2-alfresco-core';
import { WidgetComponent } from './../widget.component';
import { FormService } from '../../../services/form.service';

@Component({
    selector: 'upload-widget',
    templateUrl: './upload.widget.html',
    styleUrls: ['./upload.widget.css']
})
export class UploadWidget extends WidgetComponent implements OnInit {

    hasFile: boolean;
    fileName: string;
    displayText: string;

    constructor(private formService: FormService,
                private logService: LogService) {
        super();
    }

    ngOnInit() {
        if (this.field &&
            this.field.value &&
            this.field.value.length > 0) {
            this.hasFile = true;
            let file = this.field.value[0];
            this.fileName = file.name;
            this.displayText = decodeURI(file.name);
        }
    }

    reset() {
        this.hasFile = false;
        this.fileName = null;
        this.displayText = null;

        if (this.field) {
            this.field.value = null;
            this.field.json.value = null;
        }
    }

    onFileChanged(event: any) {
        let files = event.target.files;
        if (files && files.length > 0) {
            let file = files[0];
            this.formService.createTemporaryRawRelatedContent(file)
                .subscribe((response: any) => {
                    this.logService.info(response);
                    this.field.value = [response];
                    this.field.json.value = [response];
                }, (error: any) => {
                    this.logService.error('Error uploading file. See console output for more details.');
                });
        }
    }

}
