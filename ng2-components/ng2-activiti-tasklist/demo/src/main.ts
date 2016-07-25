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
import { HTTP_PROVIDERS } from '@angular/http';
import { ALFRESCO_CORE_PROVIDERS, AlfrescoAuthenticationService, AlfrescoSettingsService } from 'ng2-alfresco-core';
import { bootstrap } from '@angular/platform-browser-dynamic';
import { ActivitiTaskList } from 'ng2-activiti-tasklist';
import { ObjectDataTableAdapter, ObjectDataColumn } from 'ng2-alfresco-datatable';

declare let AlfrescoApi: any;

@Component({
    selector: 'activiti-tasklist-demo',
    template: `
        <activiti-tasklist [data]="data"></activiti-tasklist>
    `,
    styles: [
        ':host > .container {padding: 10px}',
        '.p-10 { padding: 10px; }'
    ],
    directives: [ActivitiTaskList],
    providers: [AlfrescoAuthenticationService]
})
class ActivitiTaskListDemo implements OnInit {
    data: ObjectDataTableAdapter;

    constructor(private setting: AlfrescoSettingsService) {
        this.setting.setProviders(['BPM']);
        this.data = new ObjectDataTableAdapter([], []);
    }

    ngOnInit() {
        let schema = [
            {type: 'text', key: 'id', title: 'Id'},
            {type: 'text', key: 'name', title: 'Name', cssClass: 'full-width name-column', sortable: true},
            {type: 'text', key: 'formKey', title: 'Form Key', sortable: true},
            {type: 'text', key: 'created', title: 'Created', sortable: true}
        ];

        let columns = schema.map(col => new ObjectDataColumn(col));
        this.data.setColumns(columns);
    }

}

bootstrap(ActivitiTaskListDemo, [
        HTTP_PROVIDERS,
        ALFRESCO_CORE_PROVIDERS]
);
