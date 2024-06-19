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

import { TestBed } from '@angular/core/testing';
import { LegalHoldService } from './legal-hold.service';
import { ContentTestingModule } from '../../testing/content.testing.module';
import { Hold, HoldPaging } from '@alfresco/js-api';

describe('LegalHoldsService', () => {
    let service: LegalHoldService;
    let legalHolds: HoldPaging;
    let returnedHolds: Hold[];
    const mockId = 'mockId';

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ContentTestingModule]
        });
        service = TestBed.inject(LegalHoldService);

        legalHolds = {
            list: {
                entries: [
                    {
                        entry: {
                            id: mockId,
                            name: 'some name',
                            reason: 'some description'
                        }
                    }
                ]
            }
        } as HoldPaging;

        returnedHolds = [
            {
                id: mockId,
                name: 'some name',
                reason: 'some description',
                description: undefined
            }
        ];
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('getHolds', () => {
        it('should return array of Hold interface', (done) => {
            spyOn(service.legalHoldApi, 'getHolds').and.returnValue(Promise.resolve(legalHolds));

            service.getHolds(mockId).subscribe((holds) => {
                expect(holds).toEqual(returnedHolds);
                expect(service.legalHoldApi.getHolds).toHaveBeenCalledWith(mockId, {});
                done();
            });
        });
    });
});
