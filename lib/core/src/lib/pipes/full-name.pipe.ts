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

import { Pipe, PipeTransform } from '@angular/core';
import { UserLike } from './user-like.interface';

@Pipe({ name: 'fullName' })
export class FullNamePipe implements PipeTransform {

    transform(user: UserLike): string {
        return this.buildFullName(user) ? this.buildFullName(user) : this.buildFromUsernameOrEmail(user);
    }

    buildFullName(user: UserLike): string {
        const fullName: string[] = [];

        fullName.push(user?.firstName);
        fullName.push(user?.lastName);

        return fullName.join(' ').trim();
    }

    buildFromUsernameOrEmail(user: UserLike): string {
        return (user?.username || user?.email) ?? '' ;
    }
}
