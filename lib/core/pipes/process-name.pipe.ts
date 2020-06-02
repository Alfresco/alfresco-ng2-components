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
import { LocalizedDatePipe } from './localized-date.pipe';

@Pipe({ name: 'processName' })
export class ProcessNamePipe implements PipeTransform {
    static DATE_TIME_IDENTIFIER = '%{datetime}';
    static PROCESS_DEFINITION_IDENTIFIER = '%{processdefinition}';
    static DATE_TIME_IDENTIFIER_REG_EXP = new RegExp(ProcessNamePipe.DATE_TIME_IDENTIFIER, 'i');
    static PROCESS_DEFINITION_IDENTIFIER_REG_EXP = new RegExp(ProcessNamePipe.PROCESS_DEFINITION_IDENTIFIER, 'i');

    constructor(private localizedDatePipe: LocalizedDatePipe) {
    }

    transform(processNameFormat: string, selectedProcessDefinitionName?: string): string {
        let processName = processNameFormat;
        if (processName.toLowerCase().includes(ProcessNamePipe.DATE_TIME_IDENTIFIER)) {
            const presentDateTime = moment.now();
            processName = processName.replace(
                ProcessNamePipe.DATE_TIME_IDENTIFIER_REG_EXP,
                this.localizedDatePipe.transform(presentDateTime, 'medium')
            );
        }

        if (processName.toLowerCase().includes(ProcessNamePipe.PROCESS_DEFINITION_IDENTIFIER)) {
            selectedProcessDefinitionName = selectedProcessDefinitionName ? selectedProcessDefinitionName : '';
            processName = processName.replace(
                ProcessNamePipe.PROCESS_DEFINITION_IDENTIFIER_REG_EXP,
                selectedProcessDefinitionName
            );
        }
        return processName;
    }
}
