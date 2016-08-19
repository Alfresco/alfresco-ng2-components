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

import {AlfrescoAuthenticationService} from 'ng2-alfresco-core';
import {ProcessInstance} from '../models/process-instance';
import {Injectable}     from '@angular/core';
import {Observable}     from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class ActivitiProcessService {

    constructor(public authService: AlfrescoAuthenticationService) {
    }

    getProcesses(): Observable<ProcessInstance[]> {
        let request = {'page': 0, 'sort': 'created-desc', 'state': 'all'};

        return Observable.fromPromise(this.authService.getAlfrescoApi().activiti.processApi.getProcessInstances(request))
            .map(this.extractData)
            .catch(this.handleError);
    }

    private extractData(res: any) {
        return res.data || {};
    }

    private handleError(error: any) {
        console.error(error);
        return Observable.throw(error || 'Server error');
    }
}
