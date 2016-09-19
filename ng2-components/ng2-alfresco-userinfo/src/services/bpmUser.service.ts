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

import { AlfrescoAuthenticationService } from 'ng2-alfresco-core';
import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BpmUserModel } from '../models/bpmUser.model';
/**
 *
 * BPMUserService retrieve all the information of an Ecm user.
 *
 * @returns {BPMUserService} .
 */
@Injectable()
export class BPMUserService {

    constructor(public authService: AlfrescoAuthenticationService) {}

    /**
     * get User Information via ECM
     * @param userName - the user name
     */
    getCurrentUserInfo(): Observable<BpmUserModel> {
        return Observable.fromPromise(this.callApiGetProfile())
            .map(
                 data => <BpmUserModel> data
                )
            .do(
                 data => console.log('Node data', data)
                ) // eyeball results in the console
            .catch(this.handleError);
    }

    private callApiGetProfile() {
        return this.authService.getAlfrescoApi().activiti.profileApi.getProfile();
    }

    /**
     * Throw the error
     * @param error
     * @returns {ErrorObservable}
     */
    private handleError(error: Response) {
        // in a real world app, we may send the error to some remote logging infrastructure
        // instead of just logging it to the console
        console.error(error);
        return Observable.throw(error || 'Server error');
    }

}
