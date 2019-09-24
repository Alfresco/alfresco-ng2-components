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

import { Injectable } from '@angular/core';
import { Observable, from, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ContentService } from './content.service';
import { AlfrescoApiService } from './alfresco-api.service';
import { LogService } from './log.service';
import { EcmUserModel } from '../models/ecm-user.model';
import { PersonEntry } from '@alfresco/js-api';

@Injectable({
    providedIn: 'root'
})
export class EcmUserService {

    constructor(private apiService: AlfrescoApiService,
                private contentService: ContentService,
                private logService: LogService) {
    }

    /**
     * Gets information about a user identified by their username.
     * @param userName Target username
     * @returns User information
     */
    getUserInfo(userName: string): Observable<EcmUserModel> {
        return from(this.apiService.getInstance().core.peopleApi.getPerson(userName))
            .pipe(
                map((personEntry: PersonEntry) => {
                    return new EcmUserModel(personEntry.entry);
                }),
                catchError((err) => this.handleError(err))
            );
    }

    /**
     * Gets information about the user who is currently logged-in.
     * @returns User information as for getUserInfo
     */
    getCurrentUserInfo() {
        return this.getUserInfo('-me-');
    }

    /**
     * Returns a profile image as a URL.
     * @param avatarId Target avatar
     * @returns Image URL
     */
    getUserProfileImage(avatarId: string): string {
        if (avatarId) {
            return this.contentService.getContentUrl(avatarId);
        }
        return null;
    }

    /**
     * Throw the error
     * @param error
     */
    private handleError(error: any) {
        this.logService.error(error);
        return throwError(error || 'Server error');
    }

}
