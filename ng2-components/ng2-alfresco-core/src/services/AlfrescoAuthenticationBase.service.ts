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

import { Http, Response } from '@angular/http';
import { AlfrescoSettingsService } from './AlfrescoSettingsService.service';
import { Observable } from 'rxjs/Rx';

declare let AlfrescoApi: any;

export class AlfrescoAuthenticationBase {

    alfrescoApi: any;


    /**
     * Constructor
     * @param alfrescoSettingsService
     */
    constructor(public alfrescoSetting: AlfrescoSettingsService,
                public http: Http) {
    }

    /**
     * The method save the toke in the localStorage
     * @param ticket
     */
    public saveTicket(provider: string, ticket: string): void {
        if (ticket) {
            localStorage.setItem(`ticket-${provider}`, ticket);
        }
    }

    /**
     * Remove the login ticket from localStorage
     */
    public removeTicket(provider: string): void {
        localStorage.removeItem(`ticket-${provider}`);
    }

    /**
     * The method write the error in the console browser
     * @param error
     * @returns {ErrorObservable}
     */
    public handleError(error: Response): Observable<any> {
        console.error('Error when logging in', error);
        return Observable.throw(error || 'Server error');
    }

}
