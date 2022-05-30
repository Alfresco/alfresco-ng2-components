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

@Pipe({ name: 'fullName' })
export class FullNamePipe implements PipeTransform {
    transform(user: any): string {
        let fullName = '';
        if (user) {
            if (user.displayName) {
                const firstAndLastName = user.displayName.split(' ');
                if (firstAndLastName[0]) {
                    fullName += firstAndLastName[0];
                }
                if (firstAndLastName[1]) {
                    fullName += fullName.length > 0 ? ' ' : '';
                    fullName += firstAndLastName[1];
                }

            } else {
                if (user.firstName && user.firstName !== 'null') {
                    fullName += user.firstName;
                }
                if (user.lastName && user.lastName !== 'null') {
                    fullName += fullName.length > 0 ? ' ' : '';
                    fullName += user.lastName;
                }
                if (!fullName) {
                    fullName += user.username ? user.username : user.email ? user.email : '';
                }
            }
        }
        return fullName;
    }
}
