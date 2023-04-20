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

import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';
import { LocalizedDatePipe } from '@alfresco/adf-core';
import { ProcessInstanceCloud } from '../process/start-process/models/process-instance-cloud.model';

export const DATE_TIME_IDENTIFIER_REG_EXP = new RegExp('%{datetime}', 'i');
export const PROCESS_DEFINITION_IDENTIFIER_REG_EXP = new RegExp('%{processdefinition}', 'i');

@Pipe({ name: 'processNameCloud' })
export class ProcessNameCloudPipe implements PipeTransform {
    constructor(private localizedDatePipe: LocalizedDatePipe) {
    }

    transform(processNameFormat: string, processInstance?: ProcessInstanceCloud): string {
        let processName = processNameFormat;
        if (processName.match(DATE_TIME_IDENTIFIER_REG_EXP)) {
            const presentDateTime = moment.now();
            processName = processName.replace(
                DATE_TIME_IDENTIFIER_REG_EXP,
                this.localizedDatePipe.transform(presentDateTime, 'medium')
            );
        }

        if (processName.match(PROCESS_DEFINITION_IDENTIFIER_REG_EXP)) {
            const selectedProcessDefinitionName = processInstance ? processInstance.processDefinitionName : '';
            processName = processName.replace(
                PROCESS_DEFINITION_IDENTIFIER_REG_EXP,
                selectedProcessDefinitionName
            );
        }
        return processName;
    }
}
