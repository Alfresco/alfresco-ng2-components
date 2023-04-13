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

import { Injectable } from '@angular/core';
import { Observable, EMPTY, of } from 'rxjs';
import { IdentityUserModel } from '../models/identity-user.model';
import { IdentityUserFilterInterface } from '../services/identity-user-filter.interface';
import { IdentityUserServiceInterface } from '../services/identity-user.service.interface';

export const mockYorkshirePudding: IdentityUserModel = { id: 'yorkshire', username: 'Yorkshire Pudding', firstName: 'Yorkshire', lastName: 'Pudding', email: 'pudding@food.com' };
export const mockShepherdsPie: IdentityUserModel = { id: 'shepherds', username: 'Shepherds Pie', firstName: 'Shepherds', lastName: 'Pie', email: 'shepherds@food.com'};
export const mockKielbasaSausage: IdentityUserModel = { id: 'kielbasa', username: 'Kielbasa Sausage', firstName: 'Kielbasa', lastName: 'Sausage', email: 'sausage@food.com' };

export const mockFoodUsers: IdentityUserModel[] = [mockYorkshirePudding, mockShepherdsPie, mockKielbasaSausage];

export const mockPreselectedFoodUsers = [
    { ...mockYorkshirePudding, readonly: false },
    { ...mockKielbasaSausage, readonly: false }
];

@Injectable({
    providedIn: 'root'
})
export class IdentityUserServiceMock implements IdentityUserServiceInterface {

    queryParams: { search: string; application?: string; roles?: string[]; groups?: string[] };

    getCurrentUserInfo(): IdentityUserModel {
        return mockKielbasaSausage;
    }

    search(name: string, _filters?: IdentityUserFilterInterface): Observable<IdentityUserModel[]> {
        if (name.trim() === '') {
            return EMPTY;
        }

        return of(mockFoodUsers.filter(group =>
            group.username.toUpperCase().includes(name.toUpperCase())
        ));
    }
}
