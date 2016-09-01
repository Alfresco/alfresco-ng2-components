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

import { bootstrap } from '@angular/platform-browser-dynamic';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ALFRESCO_CORE_PROVIDERS, AlfrescoAuthenticationService, AlfrescoSettingsService } from 'ng2-alfresco-core';
import { ALFRESCO_TASKLIST_DIRECTIVES } from 'ng2-activiti-tasklist';
import { HTTP_PROVIDERS } from '@angular/http';
import { ATIVITI_FORM_PROVIDERS } from 'ng2-activiti-form';

@Component({
    selector: 'activiti-tasklist-demo',
    template: `<label for="token"><b>Insert a valid access token / ticket:</b></label><br>
               <input id="token" type="text" size="48" (change)="updateToken();documentList.reload()" [(ngModel)]="token"><br>
               <label for="token"><b>Insert the ip of your Activiti instance:</b></label><br>
               <input id="token" type="text" size="48" (change)="updateHost();documentList.reload()" [(ngModel)]="bpmHost"><br><br>
               <div *ngIf="!authenticated" style="color:#FF2323">
                    Authentication failed to ip {{ bpmHost }} with user: admin, admin, you can still try to add a valid token to perform
                    operations.
               </div>
               <hr>
        <div class="container" *ngIf="authenticated">
            <span>Task Filters</span>
            <activiti-filters (filterClick)="onFilterClick($event)"></activiti-filters>
            <span>Tasks</span>
            <activiti-tasklist [taskFilter]="taskFilter" [schemaColumn]="schemaColumn"
                                               (rowClick)="onRowClick($event)" #activititasklist></activiti-tasklist>
            <span>Task Details</span>
            <activiti-task-details [taskId]="currentTaskId" #activitidetails></activiti-task-details>
        </div>`,
    styles: [
        ':host > .container {padding: 10px}',
        '.p-10 { padding: 10px; }'
    ],
    directives: [ALFRESCO_TASKLIST_DIRECTIVES]
})
class ActivitiTaskListDemo implements OnInit {

    @ViewChild('activititasklist')
    activititasklist: any;

    @ViewChild('activitidetails')
    activitidetails: any;

    bpmHost: string = 'http://127.0.0.1:9999';

    token: string;

    authenticated: boolean;

    schemaColumn: any [] = [];

    currentTaskId: string;

    taskFilter: any;

    constructor(private authService: AlfrescoAuthenticationService,
                private settingsService: AlfrescoSettingsService) {
        this.settingsService.setProviders('BPM');
    }

    ngOnInit() {
        this.login();

        this.schemaColumn = [
            {type: 'text', key: 'name', title: 'Name', cssClass: 'full-width name-column', sortable: true}
        ];
    }

    login() {
        this.authService.login('admin', 'admin').subscribe(
            token => {
                console.log(token);
                this.token = token;
                this.authenticated = true;
            },
            error => {
                console.log(error);
                this.authenticated = false;
            });
    }

    onFilterClick(event: any) {
        this.taskFilter = event;
        this.activititasklist.load(this.taskFilter);
    }

    onRowClick(taskId) {
        this.currentTaskId = taskId;
        this.activitidetails.loadDetails(this.currentTaskId);
    }
}

bootstrap(ActivitiTaskListDemo, [
    HTTP_PROVIDERS,
    ATIVITI_FORM_PROVIDERS,
    ALFRESCO_CORE_PROVIDERS]
);
