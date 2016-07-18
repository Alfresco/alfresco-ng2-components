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

import { Component, Input, Output, EventEmitter } from '@angular/core';
import {
    AlfrescoAuthenticationService,
    CONTEXT_MENU_DIRECTIVES,
    CONTEXT_MENU_PROVIDERS
} from 'ng2-alfresco-core';
import {
    ALFRESCO_DATATABLE_DIRECTIVES,
    ObjectDataTableAdapter
} from 'ng2-alfresco-datatable';

/**
 * <alfresco-webscript-get [scriptPath]="string"
 *                         [scriptArgs]="Object"
 *                         [contextRoot]="string"
 *                         [servicePath]="string"
 *                         [contentType]="JSON|HTML|DATATABLE"
 *                         (onSuccess)="customMethod($event)>
 * </alfresco-webscript-get>
 *
 * This component, provide a get webscript viewer
 *
 * @InputParam {string} scriptPath path to Web Script (as defined by Web Script)
 * @InputParam {Object} scriptArgs arguments to pass to Web Script
 * @InputParam {string} contextRoot path where application is deployed default value 'alfresco'
 * @InputParam {string} servicePath path where Web Script service is mapped default value 'service'
 * @InputParam {string} contentType JSON | HTML | DATATABLE | TEXT
 *
 * @Output - onSuccess - The event is emitted when the data are recived
 *
 * @returns {WebscriptComponent} .
 */
@Component({
    selector: 'alfresco-webscript-get',
    template: `
    <div id="webscript-data" ></div>
    <div *ngIf="isDataTableContent()" ><alfresco-datatable id="webscript-datatable-wrapper" [data]="data" ></alfresco-datatable><div>
    <div *ngIf="!show" id="error">Error during the deserialization of {{data}} as {{contentType}}</div>`,
    directives: [ALFRESCO_DATATABLE_DIRECTIVES, CONTEXT_MENU_DIRECTIVES],
    providers: [CONTEXT_MENU_PROVIDERS]
})
export class WebscriptComponent {

    @Input()
    scriptPath: string;

    @Input()
    scriptArgs: any;

    @Input()
    contextRoot: string = 'alfresco';

    @Input()
    servicePath: string = 'service';

    @Input()
    contentType: string = 'TEXT';

    @Output()
    onSuccess = new EventEmitter();

    data: any = undefined;

    show: boolean = false;

    /**
     * Constructor
     * @param auth
     */
    constructor(public authService: AlfrescoAuthenticationService) {

    }

    ngOnChanges(changes) {
        this.clean();

        return new Promise((resolve, reject) => {
            this.authService.getAlfrescoApi().webScript.executeWebScript('GET', this.scriptPath, this.scriptArgs, this.contextRoot, this.servicePath).then((data) => {
                if (this.contentType === 'JSON') {
                    this.show = this.showDataAsJSON(data);
                } else if (this.contentType === 'DATATABLE') {
                    this.show = this.showDataAsDataTable(data);
                } else {
                    this.show = this.showDataAsHTML(data);
                }

                this.onSuccess.emit(data);

                resolve();
            }, function (error) {
                console.log('Error' + error);
                reject();
            });
        });
    }

    /**
     * Parserize and show the data id data is a  JSON
     *
     * @param data
     *
     * @retutns boolean true if the component is able to Show the data as JSON
     */
    showDataAsJSON(data: any) {
        let jsonShow = true;
        try {
            this.data = JSON.stringify(data);
            let wrapper = document.getElementById('webscript-data');
            wrapper.innerHTML = this.data;
        } catch (e) {
            jsonShow = false;
        }

        return jsonShow;
    }

    /**
     * Parserize and show the data id data is a  html/xml
     *
     * @param data
     *
     * @retutns boolean true if the component is able to Show the data as html/xml
     */
    showDataAsHTML(data: any) {
        let htmlShow = false;
        let domParser = new DOMParser();

        if (domParser.parseFromString(data, 'text/xml')) {
            let wrapper = document.getElementById('webscript-data');
            wrapper.innerHTML = data;
            this.data = data;
            htmlShow = true;
        }

        return htmlShow;
    }

    /**
     * show the data in a ng2-alfresco-datatable
     *
     * @param data
     *
     * @retutns boolean true if the component is able to Show the data as datatable
     */
    showDataAsDataTable(data: any) {
        let datatableShow = true;
        try {
            if (!data.schema) {
                data.schema = ObjectDataTableAdapter.generatechema(data.data[0]);
            }
            if (data.schema && data.schema.length > 0) {
                this.data = new ObjectDataTableAdapter(data.data, data.schema);
            } else {
                datatableShow = false;
            }
        } catch (e) {
            datatableShow = false;
        }

        return datatableShow;
    }

    clean() {
        let wrapper = document.getElementById('webscript-data');
        wrapper.innerHTML = '';
        this.data = undefined;
    }

    isDataTableContent() {
        return this.contentType === 'DATATABLE' && this.show;
    }
}
