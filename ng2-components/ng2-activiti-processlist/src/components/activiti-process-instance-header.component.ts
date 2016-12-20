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

import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges  } from '@angular/core';
import { AlfrescoTranslationService } from 'ng2-alfresco-core';
import { ProcessInstance } from '../models/process-instance.model';

declare let componentHandler: any;

@Component({
    selector: 'activiti-process-instance-header',
    moduleId: module.id,
    templateUrl: './activiti-process-instance-header.component.html',
    styleUrls: ['./activiti-process-instance-header.component.css']
})
export class ActivitiProcessInstanceHeader implements OnChanges {

    @Input()
    processInstance: ProcessInstance;

    @Output()
    onError: EventEmitter<any> = new EventEmitter<any>();

    constructor(private translate: AlfrescoTranslationService) {

        if (translate) {
            translate.addTranslationFolder('ng2-activiti-processlist', 'node_modules/ng2-activiti-processlist/src');
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        this.processInstance = new ProcessInstance(changes['processInstance'].currentValue);
    }

    isRunning(): boolean {
        return this.processInstance && !this.processInstance.ended;
    }
}
