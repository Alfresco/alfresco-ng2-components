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
import { AlfrescoApiService } from './alfresco-api.service';
import { LogService } from './log.service';
import { BpmUserModel } from '../models/bpm-user.model';
import { map, catchError } from 'rxjs/operators';
import { UserRepresentation } from '@alfresco/js-api';

/**
 *
 * BPMUserService retrieve all the information of an Ecm user.
 *
 */
@Injectable({
    providedIn: 'root'
})
export class BpmUserService {

    constructor(private apiService: AlfrescoApiService,
                private logService: LogService) {
    }

    /**
     * Gets information about the current user.
     * @returns User information object
     */
    getCurrentUserInfo(): Observable<BpmUserModel> {
        return from(this.apiService.getInstance().activiti.profileApi.getProfile())
            .pipe(
                map((userRepresentation: UserRepresentation) => {
                    return new BpmUserModel(userRepresentation);
                }),
                catchError((err) => this.handleError(err))
            );
    }

    /**
     * Gets the current user's profile image as a URL.
     * @returns URL string
     */
    getCurrentUserProfileImage(): string {
        return this.apiService.getInstance().activiti.profileApi.getProfilePictureUrl();
    }

    /**
     * Throw the error
     * @param error
     */
    private handleError(error: any) {
        // in a real world app, we may send the error to some remote logging infrastructure
        // instead of just logging it to the console
        this.logService.error(error);
        return throwError(error || 'Server error');
    }

}
