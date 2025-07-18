/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { UserLike } from './user-like.interface';

@Pipe({
    name: 'usernameInitials'
})
export class InitialUsernamePipe implements PipeTransform {
    constructor(private sanitized: DomSanitizer) {}

    transform(user: UserLike & { displayName?: string }, className: string = '', delimiter: string = ''): SafeHtml {
        let safeHtml: SafeHtml = '';
        if (user) {
            const initialResult = this.getInitialUserName(user.firstName || user.displayName || user.username, user.lastName, delimiter);
            const div = document.createElement('div');
            div.textContent = initialResult;
            div.dataset.automationId = 'user-initials-image';
            div.className = className;

            safeHtml = this.sanitized.bypassSecurityTrustHtml(div.outerHTML);
        }
        return safeHtml;
    }

    getInitialUserName(firstName: string, lastName: string, delimiter: string): string {
        firstName = firstName ? firstName[0] : '';
        lastName = lastName ? lastName[0] : '';
        return firstName + delimiter + lastName;
    }
}
