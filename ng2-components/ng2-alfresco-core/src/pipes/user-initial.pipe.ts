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

import { Pipe, PipeTransform } from '@angular/core';
import { LightUserRepresentation } from '../models/user-process.model';

@Pipe({
    name: 'usernameInitials'
})
export class InitialUsernamePipe implements PipeTransform {

    transform(user: LightUserRepresentation, className: string = '', delimiter: string = ''): string {
        let result = '';
        if (user) {
            let initialResult = this.getInitialUserName(user.firstName, user.lastName, delimiter);
            result = `<div class="${className}">${initialResult}</div>`;
        }
        return result;
    }

    getInitialUserName(firstName: string, lastName: string, delimiter: string) {
        firstName = (firstName ? firstName[0] : '');
        lastName = (lastName ? lastName[0] : '');
        return firstName + delimiter + lastName;
    }
}
