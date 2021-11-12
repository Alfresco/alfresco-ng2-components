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
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { UserProcessModel } from '../models/user-process.model';
import { EcmUserModel } from '../models/ecm-user.model';
import { IdentityUserModel } from '../models/identity-user.model';

export type User = Partial<
        Pick<UserProcessModel, 'firstName' | 'lastName'> &
        Pick<EcmUserModel, 'firstName' | 'lastName' | 'displayName'> &
        Pick<IdentityUserModel, 'firstName' | 'lastName' | 'username'>
    >;

@Pipe({
    name: 'usernameInitials'
})
export class InitialUsernamePipe implements PipeTransform {
    constructor(private sanitized: DomSanitizer) {
    }

    transform(
        user: User | undefined,
        className: string = '',
        delimiter: string = ''
    ): SafeHtml {
        let safeHtml: SafeHtml = '';

        if (user) {
            const {
                firstName,
                lastName,
                displayName,
                username
            } = user;

            const canCreateInitialsForName = !!firstName || !!lastName || !!displayName;

            if (canCreateInitialsForName) {
                const initialResult = this.getInitialUserName(
                    firstName ?? displayName,
                    lastName,
                    delimiter
                );

                safeHtml = this.getSafeHtml(initialResult, className);
            } else if (username) {
                safeHtml = this.getSafeHtml(username[0].toUpperCase(), className);
            }
        }

        return safeHtml;
    }

    getInitialUserName(firstName?: string, lastName?: string, delimiter?: string): string {
        return `${firstName?.[0] ?? ''}${delimiter}${lastName?.[0] ?? ''}`;
    }

    getSafeHtml(initials: string, className: string): SafeHtml {
        return this.sanitized.bypassSecurityTrustHtml(
            `<div id="user-initials-image" class="${className}">${initials}</div>`
        );
    }
}
