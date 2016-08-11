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

import {
    Component,
    OnInit
} from '@angular/core';
import {
    AlfrescoPipeTranslate,
    AlfrescoTranslationService,
    CONTEXT_MENU_DIRECTIVES,
    CONTEXT_MENU_PROVIDERS
} from 'ng2-alfresco-core';
import {
    ALFRESCO_DATATABLE_DIRECTIVES,
    ObjectDataTableAdapter
} from 'ng2-alfresco-datatable';
import { ActivitiProcessService } from '../services/activiti-process-service.service';
import { ProcessInstance } from '../models/process-instance';

declare let __moduleName: string;

@Component({
    moduleId: __moduleName,
    selector: 'activiti-processlist',
    styles: [
      `
              :host h1 {
                  font-size:22px
              }
          `
    ],
    templateUrl: './ng2-activiti-processlist.component.html',
    directives: [ ALFRESCO_DATATABLE_DIRECTIVES, CONTEXT_MENU_DIRECTIVES ],
    pipes: [ AlfrescoPipeTranslate ],
    providers: [ CONTEXT_MENU_PROVIDERS ]
})
export class Ng2ActivitiProcesslistComponent implements OnInit {

    errorMessage: string;
    processInstances: ProcessInstance[];
    data: ObjectDataTableAdapter;

    constructor (
        private processService: ActivitiProcessService,
        private translate: AlfrescoTranslationService
    ) {
        if (translate !== null) {
            translate.addTranslationFolder('node_modules/ng2-activiti-processlist/src');
        }
    }

    ngOnInit() {
        this.getProcesses();
    }

    getProcesses() {
        this.processService.getProcesses()
            .subscribe(
                (processInstances) => {
                    // this.processInstances = processInstances;
                    this.data = new ObjectDataTableAdapter(
                        processInstances,
                        [
                            {type: 'text', key: 'id', title: 'Id', sortable: true},
                            {type: 'text', key: 'name', title: 'Name', cssClass: 'full-width name-column', sortable: true},
                            {type: 'text', key: 'started', title: 'Started', sortable: true},
                            {type: 'text', key: 'startedBy.email', title: 'Started By', sortable: true}
                        ]
                    );
                },
                error =>  this.errorMessage = <any>error);
    }

    onItemClick(processInstance: ProcessInstance, event: any) {
        console.log(processInstance, event);
    }

}
