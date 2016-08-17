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

import {Component, OnInit} from '@angular/core';
import {ALFRESCO_CORE_PROVIDERS, AlfrescoAuthenticationService, AlfrescoSettingsService} from 'ng2-alfresco-core';
import {bootstrap} from '@angular/platform-browser-dynamic';
import {ActivitiTaskList} from 'ng2-activiti-tasklist';
import {ObjectDataTableAdapter, ObjectDataColumn} from 'ng2-alfresco-datatable';
import {HTTP_PROVIDERS} from '@angular/http';

declare let AlfrescoApi: any;

@Component({
    selector: 'activiti-tasklist-demo',
    template: `label for="token"><b>Insert a valid access token / ticket:</b></label><br>
               <input id="token" type="text" size="48" (change)="updateToken();documentList.reload()" [(ngModel)]="token"><br>
               <label for="token"><b>Insert the ip of your Alfresco instance:</b></label><br>
               <input id="token" type="text" size="48" (change)="updateHost();documentList.reload()" [(ngModel)]="bpmHost"><br><br>
               <div *ngIf="!authenticated" style="color:#FF2323">
                    Authentication failed to ip {{ bpmHost }} with user: admin, admin, you can still try to add a valid token to perform
                    operations.
               </div>
               <hr>
                <label for="token"><b>Insert a scriptPath</b></label><br>
                <input id="token" type="text" size="48"  [(ngModel)]="scriptPath"><br>
                <label for="token"><b>Insert a contextRoot</b></label><br>
                <input id="token" type="text" size="48"  [(ngModel)]="contextRoot"><br>
                <label for="token"><b>Insert a servicePath</b></label><br>
                <input id="token" type="text" size="48"  [(ngModel)]="servicePath"><br>
        <div class="container" *ngIf="authenticated">
            <activiti-tasklist></activiti-tasklist>
        </div>`,
    styles: [
        ':host > .container {padding: 10px}',
        '.p-10 { padding: 10px; }'
    ],
    directives: [ActivitiTaskList]
})
class ActivitiTaskListDemo implements OnInit {

    bpmHost: string = 'http://127.0.0.1:9999';

    token: string;

    data: ObjectDataTableAdapter;

    authenticated: boolean;

    constructor(private authService: AlfrescoAuthenticationService,
                private settingsService: AlfrescoSettingsService) {
        this.settingsService.setProviders('BPM');
        this.data = new ObjectDataTableAdapter([], []);
    }

    ngOnInit() {
        this.login();

        let schema = [
            {type: 'text', key: 'id', title: 'Id'},
            {type: 'text', key: 'name', title: 'Name', cssClass: 'full-width name-column', sortable: true},
            {type: 'text', key: 'formKey', title: 'Form Key', sortable: true},
            {type: 'text', key: 'created', title: 'Created', sortable: true}
        ];

        let columns = schema.map(col => new ObjectDataColumn(col));
        this.data.setColumns(columns);
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
}

bootstrap(ActivitiTaskListDemo, [
    HTTP_PROVIDERS,
    ALFRESCO_CORE_PROVIDERS]
);
