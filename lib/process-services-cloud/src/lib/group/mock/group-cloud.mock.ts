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
import { IdentityGroupModel } from '../models/identity-group.model';
import { IdentityGroupFilterInterface } from '../services/identity-group-filter.interface';
import { IdentityGroupServiceInterface } from '../services/identity-group.service.interface';

export const mockVegetableAubergine: IdentityGroupModel = { id: 'aubergine', name: 'Vegetable Aubergine'};
export const mockMeatChicken: IdentityGroupModel = { id: 'chicken', name: 'Meat Chicken'};

export const mockFoodGroups = [ mockVegetableAubergine, mockMeatChicken ];

export const mockSearchGroupEmptyFilters: IdentityGroupFilterInterface = {
    roles: [],
    withinApplication: ''
};

@Injectable({
    providedIn: 'root'
})
export class IdentityGroupServiceMock implements IdentityGroupServiceInterface {
    search(name: string, _filters?: IdentityGroupFilterInterface): Observable<IdentityGroupModel[]> {
        if (name.trim() === '') {
            return EMPTY;
        }

        return of(mockFoodGroups.filter(group =>
            group.name.toUpperCase().includes(name.toUpperCase())
        ));
    }
}
