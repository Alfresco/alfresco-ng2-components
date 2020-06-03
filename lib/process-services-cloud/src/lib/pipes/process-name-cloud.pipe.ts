/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment-es6';
import { LocalizedDatePipe } from '@alfresco/adf-core';
import { ProcessDefinitionCloud } from '../process/start-process/models/process-definition-cloud.model';

@Pipe({ name: 'processNameCloud' })
export class ProcessNameCloudPipe implements PipeTransform {
    static DATE_TIME_IDENTIFIER_REG_EXP = new RegExp('%{datetime}', 'i');
    static PROCESS_DEFINITION_IDENTIFIER_REG_EXP = new RegExp('%{processdefinition}', 'i');

    constructor(private localizedDatePipe: LocalizedDatePipe) {
    }

    transform(processNameFormat: string, selectedProcessDefinition?: ProcessDefinitionCloud): string {
        let processName = processNameFormat;
        if (processName.match(ProcessNameCloudPipe.DATE_TIME_IDENTIFIER_REG_EXP)) {
            const presentDateTime = moment.now();
            processName = processName.replace(
                ProcessNameCloudPipe.DATE_TIME_IDENTIFIER_REG_EXP,
                this.localizedDatePipe.transform(presentDateTime, 'medium')
            );
        }

        if (processName.match(ProcessNameCloudPipe.PROCESS_DEFINITION_IDENTIFIER_REG_EXP)) {
            const selectedProcessDefinitionName = selectedProcessDefinition ? selectedProcessDefinition.name : '';
            processName = processName.replace(
                ProcessNameCloudPipe.PROCESS_DEFINITION_IDENTIFIER_REG_EXP,
                selectedProcessDefinitionName
            );
        }
        return processName;
    }
}
