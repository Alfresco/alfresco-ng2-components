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

import { TestBed } from '@angular/core/testing';
import { LegalHoldService } from './legal-hold.service';
import { ContentTestingModule } from '../../testing/content.testing.module';
import { BulkAssignHoldResponseEntry, Hold, HoldBulkStatusEntry, HoldEntry, HoldPaging, RequestQuery, SEARCH_LANGUAGE } from '@alfresco/js-api';

describe('LegalHoldsService', () => {
    let service: LegalHoldService;
    let legalHolds: HoldPaging;
    let legalHoldEntry: HoldEntry;
    let returnedHolds: Hold[];
    const filePlanId = 'mockId';
    const nodeId = 'mockNodeId';
    const holdId = 'holdId';
    const mockBulkResponse: BulkAssignHoldResponseEntry = {
        entry: {
            totalItems: 3,
            bulkStatusId: 'bulkStatus'
        }
    };
    const mockBulkStatusResponse: HoldBulkStatusEntry = {
        entry: {
            bulkStatusId: 'bulkStatus',
            status: 'IN_PROGRESS',
            totalItems: 3,
            processedItems: 2,
            errorsCount: 0,
            startTime: new Date('2024'),
            holdBulkOperation: {
                op: 'ADD',
                query: {
                    query: 'mockQuery',
                    language: SEARCH_LANGUAGE.AFTS
                }
            }
        }
    };

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
                id: holdId,
                name: 'some name',
                reason: 'some reason',
                description: 'some description'
            }
        };

        returnedHolds = [
            {
                id: holdId,
                name: 'some name',
                reason: 'some reason',
                description: 'some description'
            }
        ] as Hold[];

        spyOn(service.legalHoldApi, 'bulkAssignHold').and.returnValue(Promise.resolve(mockBulkResponse));
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('getHolds', () => {
        it('should return array of Hold interface', (done) => {
            spyOn(service.legalHoldApi, 'getHolds').and.returnValue(Promise.resolve(legalHolds));

            service.getHolds(filePlanId).subscribe((holds) => {
                expect(holds).toEqual(returnedHolds);
                expect(service.legalHoldApi.getHolds).toHaveBeenCalledWith(filePlanId, undefined);
                done();
            });
        });
    });

    describe('assignHold', () => {
        it('should assign node to existing hold', (done) => {
            const mockResponse = { entry: { id: holdId } } as HoldEntry;
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

            service.createHold(filePlanId, mockHold).subscribe((hold) => {
                expect(hold).toEqual(legalHoldEntry);
                expect(service.legalHoldApi.createHold).toHaveBeenCalledWith(filePlanId, mockHold);
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

            service.createHolds(filePlanId, mockHolds).subscribe((holds) => {
                expect(holds).toEqual(legalHolds);
                expect(service.legalHoldApi.createHolds).toHaveBeenCalledWith(filePlanId, mockHolds);
                done();
            });
        });
    });

    describe('bulkAssignHold', () => {
        it('should add nodes to hold based on search query results', (done) => {
            const query: RequestQuery = {
                query: 'mockQuery',
                language: SEARCH_LANGUAGE.AFTS
            };

            service.bulkAssignHold(nodeId, query).subscribe((response) => {
                expect(response).toEqual(mockBulkResponse);
                expect(service.legalHoldApi.bulkAssignHold).toHaveBeenCalledWith(nodeId, query);
                done();
            });
        });
    });

    describe('bulkAssignHoldToFolder', () => {
        it('should add nodes to hold based on search query results', (done) => {
            const folderId = 'mockFolderId';
            const query: RequestQuery = {
                query: `ANCESTOR:'workspace://SpacesStore/${folderId}' and TYPE:content`,
                language: SEARCH_LANGUAGE.AFTS
            };

            service.bulkAssignHoldToFolder(nodeId, folderId, SEARCH_LANGUAGE.AFTS).subscribe((response) => {
                expect(response).toEqual(mockBulkResponse);
                expect(service.legalHoldApi.bulkAssignHold).toHaveBeenCalledWith(nodeId, query);
                done();
            });
        });
    });

    describe('getBulkOperationStatus', () => {
        it('should get bulk operation status based on bulkStatusId and nodeId', (done) => {
            spyOn(service.legalHoldApi, 'getBulkStatus').and.returnValue(Promise.resolve(mockBulkStatusResponse));
            const bulkStatusId = 'mockBulkStatusId';

            service.getBulkOperationStatus(bulkStatusId, nodeId).subscribe((response) => {
                expect(response).toEqual(mockBulkStatusResponse);
                expect(service.legalHoldApi.getBulkStatus).toHaveBeenCalledWith(bulkStatusId, nodeId);
                done();
            });
        });
    });
});
