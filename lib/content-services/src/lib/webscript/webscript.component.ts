/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { ObjectDataTableAdapter, AlfrescoApiService, LogService } from '@alfresco/adf-core';
import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { WebscriptApi } from '@alfresco/js-api';

/**
 * <adf-webscript-get [scriptPath]="string"
 *                         [scriptArgs]="Object"
 *                         [contextRoot]="string"
 *                         [servicePath]="string"
 *                         [contentType]="JSON|HTML|DATATABLE"
 *                         (success)="customMethod($event)>
 * </adf-webscript-get>
 *
 * This component, provide a get webscript viewer
 *
 * @InputParam {string} scriptPath path to Web Script (as defined by Web Script)
 * @InputParam {Object} scriptArgs arguments to pass to Web Script
 * @InputParam {string} contextRoot path where application is deployed default value 'alfresco'
 * @InputParam {string} servicePath path where Web Script service is mapped default value 'service'
 * @InputParam {string} contentType JSON | HTML | DATATABLE | TEXT
 *
 * @Output - success - The event is emitted when the data are received
 *
 */
@Component({
    selector: 'adf-webscript-get',
    templateUrl: './webscript.component.html'
})
export class WebscriptComponent implements OnChanges {

    _webscriptApi: WebscriptApi;
    get webscriptApi(): WebscriptApi {
        this._webscriptApi = this._webscriptApi ?? new WebscriptApi(this.apiService.getInstance());
        return this._webscriptApi;
    }

    /** (required) Path to the webscript (as defined by webscript). */
    @Input()
    scriptPath: string;

    /** Arguments to pass to the webscript. */
    @Input()
    scriptArgs: any;

    /** Toggles whether to show or hide the data. */
    @Input()
    showData: boolean = true;

    /** Path where the application is deployed */
    @Input()
    contextRoot: string = 'alfresco';

    /** Path that the webscript service is mapped to. */
    @Input()
    servicePath: string = 'service';

    /** Content type to interpret the data received from the webscript.
     * Can be "JSON" , "HTML" , "DATATABLE" or "TEXT"
     */
    @Input()
    contentType: string = 'TEXT';

    /** Emitted when the operation succeeds. You can get the plain data from
     * the webscript through the **success** event parameter and use it as you
     * need in your application.
     */
    @Output()
    success = new EventEmitter();

    data: any = undefined;
    showError: boolean = false;

    constructor(private apiService: AlfrescoApiService,
                private logService: LogService) {
    }

    ngOnChanges() {
        if (this.showData) {
            this.clean();
        }

        return new Promise<void>((resolve, reject) => {
            this.webscriptApi.executeWebScript('GET', this.scriptPath, this.scriptArgs, this.contextRoot, this.servicePath).then((webScriptData) => {

                this.data = webScriptData;

                if (this.showData) {
                    if (this.contentType === 'DATATABLE') {
                        this.data = this.showDataAsDataTable(webScriptData);
                    }
                }

                this.success.emit(this.data);

                resolve();
            }, (error) => {
                this.logService.log('Error' + error);
                reject();
            });
        });
    }

    /**
     * show the data in a ng2-alfresco-datatable
     *
     * @param data
     *
     * @returns the data as datatable
     */
    showDataAsDataTable(data: any) {
        const datatableData: any = null;
        try {

            if (!data.schema) {
                data.schema = ObjectDataTableAdapter.generateSchema(data.data);
            }

            if (data.schema && data.schema.length > 0) {
                this.data = new ObjectDataTableAdapter(data.data, data.schema);
            }

        } catch (error) {
            this.logService.error('error during the cast as datatable');
        }

        return datatableData;
    }

    clean() {
        this.data = undefined;
    }

    isDataTableContent() {
        return this.contentType === 'DATATABLE';
    }
}
