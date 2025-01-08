/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { IdentityGroupService } from '@alfresco/adf-process-services-cloud';

export const mockVegetableAubergine: IdentityGroupModel = { id: 'aubergine', name: 'Vegetable Aubergine' };
export const mockMeatChicken: IdentityGroupModel = { id: 'chicken', name: 'Meat Chicken' };

export const mockFoodGroups = [mockVegetableAubergine, mockMeatChicken];

@Injectable()
export class IdentityGroupServiceMock extends IdentityGroupService {
    search(name: string): Observable<IdentityGroupModel[]> {
        if (name.trim() === '') {
            return EMPTY;
        }

        return of(mockFoodGroups.filter((group) => group.name.toUpperCase().includes(name.toUpperCase())));
    }
}
