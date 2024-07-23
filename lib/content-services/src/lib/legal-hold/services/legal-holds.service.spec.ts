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
import { BulkHoldAddResponse, Hold, HoldEntry, HoldPaging } from '@alfresco/js-api';

describe('LegalHoldsService', () => {
    let service: LegalHoldService;
    let legalHolds: HoldPaging;
    let legalHoldEntry: HoldEntry;
    let returnedHolds: Hold[];
    const mockId = 'mockId';

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ContentTestingModule]
        });
        service = TestBed.inject(LegalHoldService);

        legalHolds = {
            list: {
                entries: [legalHoldEntry]
            }
        } as HoldPaging;

        legalHoldEntry = {
            entry: {
                id: mockId,
                name: 'some name',
                reason: 'some reason',
                description: 'some description'
            }
        };

        returnedHolds = [
            {
                id: mockId,
                name: 'some name'
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
                expect(service.legalHoldApi.getHolds).toHaveBeenCalledWith(mockId, undefined);
                done();
            });
        });
    });

    describe('assignHold', () => {
        it('should assign node to existing hold', (done) => {
            const nodeId = 'qwe';
            const holdId = 'foo';
            const mockResponse = { entry: { id: holdId } };
            spyOn(service.legalHoldApi, 'assignHold').and.returnValue(Promise.resolve(mockResponse));

            service.assignHold(nodeId, holdId).subscribe((holds) => {
                expect(holds).toEqual(mockResponse);
                expect(service.legalHoldApi.assignHold).toHaveBeenCalledWith(nodeId, holdId);
                done();
            });
        });
    });

    describe('assignHolds', () => {
        it('should assign nodes to existing hold', (done) => {
            const nodeIds = [{ id: 'qwe' }, { id: 'abc' }];
            const holdId = 'foo';
            spyOn(service.legalHoldApi, 'assignHolds').and.returnValue(Promise.resolve(legalHolds));

            service.assignHolds(nodeIds, holdId).subscribe((holds) => {
                expect(holds).toEqual(legalHolds);
                expect(service.legalHoldApi.assignHolds).toHaveBeenCalledWith(nodeIds, holdId);
                done();
            });
        });
    });

    describe('unassignHold', () => {
        it('should unassign node from existing hold', (done) => {
            const nodeId = 'qwe';
            const holdId = 'foo';

            spyOn(service.legalHoldApi, 'unassignHold').and.returnValue(Promise.resolve(undefined));

            service.unassignHold(holdId, nodeId).subscribe(() => {
                expect(service.legalHoldApi.unassignHold).toHaveBeenCalledWith(holdId, nodeId);
                done();
            });
        });
    });

    describe('createHold', () => {
        it('should create new hold', (done) => {
            const mockHold = {
                name: 'Hold 1',
                reason: 'reason 1'
            };
            spyOn(service.legalHoldApi, 'createHold').and.returnValue(Promise.resolve(legalHoldEntry));

            service.createHold(mockId, mockHold).subscribe((hold) => {
                expect(hold).toEqual(legalHoldEntry);
                expect(service.legalHoldApi.createHold).toHaveBeenCalledWith(mockId, mockHold);
                done();
            });
        });
    });

    describe('createHolds', () => {
        it('should create list of holds', (done) => {
            const mockHolds = [
                {
                    name: 'Hold 1',
                    reason: 'reason 1'
                },
                {
                    name: 'Hold 2',
                    reason: 'reason 2'
                }
            ];
            spyOn(service.legalHoldApi, 'createHolds').and.returnValue(Promise.resolve(legalHolds));

            service.createHolds(mockId, mockHolds).subscribe((holds) => {
                expect(holds).toEqual(legalHolds);
                expect(service.legalHoldApi.createHolds).toHaveBeenCalledWith(mockId, mockHolds);
                done();
            });
        });
    });

    describe('bulkHold', () => {
        it('should add nodes to hold based on search query results', (done) => {
            const nodeId = 'mockNodeId';
            const query = 'mockQuery';
            const language = 'afts';
            const mockResponse: BulkHoldAddResponse = { totalItems: 3, bulkStatusId: 'bulkStatus' };

            spyOn(service.legalHoldApi, 'bulkHold').and.returnValue(Promise.resolve(mockResponse));

            service.bulkHold(nodeId, query, language).subscribe((response) => {
                expect(response).toEqual(mockResponse);
                expect(service.legalHoldApi.bulkHold).toHaveBeenCalledWith(nodeId, query, language);
                done();
            });
        });
    });
});
