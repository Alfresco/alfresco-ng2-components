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

import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { of, Observable } from 'rxjs';
import { IdentityUserModel } from '../models/identity-user.model';

@Injectable()
export class IdentityUserService {

    static USER_NAME = 'given_name';
    static USER_EMAIL = 'email';
    static USER_ACCESS_TOKEN = 'access_token';

    private helper;

    constructor() {
        this.helper = new JwtHelperService();
    }

    getCurrentIdentityUserInfo(): Observable<IdentityUserModel> {
        const fullName = this.getValueFromToken<string>(IdentityUserService.USER_NAME);
        const email = this.getValueFromToken<string>(IdentityUserService.USER_EMAIL);
        const nameParts = fullName.split(' ');
        const user = { firstName: nameParts[0], lastName: nameParts[1], email: email };
        return of(new IdentityUserModel(user));
    }

    getValueFromToken<T>(key: string): T {
        let value;
        const token = localStorage.getItem(IdentityUserService.USER_ACCESS_TOKEN);
        if (token) {
            const tokenPayload = this.helper.decodeToken(token);
            value = tokenPayload[key];
        }
        return <T> value;
    }
}
