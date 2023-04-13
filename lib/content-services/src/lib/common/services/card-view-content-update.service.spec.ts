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

import { MinimalNode } from '@alfresco/js-api';
import { fakeAsync, TestBed } from '@angular/core/testing';
import { CardViewContentUpdateService } from './card-view-content-update.service';

describe('CardViewContentUpdateService', () => {

  let cardViewContentUpdateService: CardViewContentUpdateService;

        beforeEach(() => {
          cardViewContentUpdateService = TestBed.inject(CardViewContentUpdateService);
        });

        it('should send updated node when aspect changed', fakeAsync(() => {
            const fakeNode: MinimalNode = { id: 'Bigfoot'} as MinimalNode;
            cardViewContentUpdateService.updatedAspect$.subscribe((node: MinimalNode) => {
                expect(node.id).toBe('Bigfoot');
            });

            cardViewContentUpdateService.updateNodeAspect(fakeNode);
        }));
});
