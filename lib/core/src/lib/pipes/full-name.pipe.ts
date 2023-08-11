/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Inject, Optional, Pipe, PipeTransform } from '@angular/core';
import { UserLike } from './user-like.interface';
import { ADF_FULL_NAME_PIPE_INCLUDE_EMAIL } from './full-name-email-required.token';

@Pipe({ name: 'fullName' })
export class FullNamePipe implements PipeTransform {

    constructor(@Optional() @Inject(ADF_FULL_NAME_PIPE_INCLUDE_EMAIL) private includeEmail = false) {
    }

    transform(user: UserLike, includeEmail?: boolean): string {
        return this.buildFullName(user, includeEmail) ? this.buildFullName(user, includeEmail) : this.buildFromUsernameOrEmail(user, includeEmail);
    }

    private includeEmailInFullName(includeEmail: boolean | undefined) {
        return includeEmail === undefined ? !!this.includeEmail : includeEmail;
    }

    private buildFullName(user: UserLike, includeEmail: boolean | undefined): string {
        const fullName: string[] = [];
        let hasName = false;

        if (user?.firstName) {
            hasName = true;
            fullName.push(user?.firstName);
        }

        if (user?.lastName) {
            hasName = true;
            fullName.push(user?.lastName);
        }

        if (this.includeEmailInFullName(includeEmail) && hasName && !!user?.email) {
            fullName.push(`<${user.email}>`);
        }

        return fullName.join(' ');
    }

    private buildFromUsernameOrEmail(user: UserLike, includeEmail: boolean | undefined): string {
        let fullName = (user?.username || user?.email) ?? '';

        if (this.includeEmailInFullName(includeEmail) && user.username && user.email) {
            fullName += ` <${user.email}>`;
        }

        return fullName;
    }
}
