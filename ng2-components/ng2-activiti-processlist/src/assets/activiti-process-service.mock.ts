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

import { Observable } from 'rxjs/Observable';
import {
    ProcessList,
    SingleProcessList
} from './activiti-process.model.mock';
import { ActivitiProcessService } from './../services/activiti-process-service.service';
import { AlfrescoSettingsService } from 'ng2-alfresco-core';

export class ActivitiProcessServiceMock extends ActivitiProcessService {

    getProcessesResult: ProcessList = new SingleProcessList('Example process 1');
    getProcessesReject: boolean = false;
    getProcessesRejectError: string = 'Error';

    constructor(
        settings?: AlfrescoSettingsService
    ) {
        super(settings, null);
    }

    getProcesses() {
        if (this.getProcessesReject) {
            return Observable.throw(this.getProcessesRejectError);
        }
        return Observable.create(observer => {
            observer.next(this.getProcessesResult);
            observer.complete();
        }).map((json) => {
            return json.data;
        });
    }
}
