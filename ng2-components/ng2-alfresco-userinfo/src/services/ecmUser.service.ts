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

import { AlfrescoApiService } from 'ng2-alfresco-core';
import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { EcmUserModel } from '../models/ecmUser.model';
/**
 *
 * ECMUserService retrieve all the information of an Ecm user.
 *
 * @returns {ECMUserService} .
 */
@Injectable()
export class ECMUserService {

    constructor(private apiService: AlfrescoApiService) {}

    /**
     * get User Information via ECM
     * @param userName - the user name
     */
    getUserInfo(userName: string): Observable<EcmUserModel> {
        return Observable.fromPromise(this.callApiGetPersonInfo(userName))
            .map( data => <EcmUserModel> data )
            .do(
                 data => console.log('Node data', data)
                ) // eyeball results in the console
            .catch(this.handleError);
    }

    private callApiGetPersonInfo(userName: string, opts?: any) {
        return this.apiService.getInstance().core.peopleApi.getPerson(userName, opts);
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
