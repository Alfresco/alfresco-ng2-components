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

import { CustomResourcesService } from './custom-resources.service';
import { PaginationModel } from '@alfresco/adf-core';
import { TestBed } from '@angular/core/testing';
import { ContentTestingModule } from '../../testing/content.testing.module';
import {
    Favorite,
    FavoritePaging,
    FavoritePagingList,
    NodeEntry,
    NodePaging,
    SiteEntry,
    SitePaging,
    SiteRoleEntry,
    SiteRolePaging
} from '@alfresco/js-api';
import { of } from 'rxjs';

describe('CustomResourcesService', () => {
    let customResourcesService: CustomResourcesService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ContentTestingModule]
        });

        customResourcesService = TestBed.inject(CustomResourcesService);
    });

    describe('loadFavorites', () => {
        it('should return a list of items with default properties when target properties does not exist', (done) => {
            spyOn(customResourcesService.favoritesApi, 'listFavorites').and.returnValue(
                Promise.resolve(
                    new FavoritePaging({
                        list: new FavoritePagingList({
                            entries: [
                                {
                                    entry: new Favorite({
                                        target: {
                                            file: {
                                                title: 'some-title',
                                                description: 'some-description'
                                            }
                                        },
                                        aspectNames: ['aspect-name-1', 'aspect-name-2'],
                                        allowableOperations: ['allowable-operation-1', 'allowable-operation-2']
                                    })
                                }
                            ]
                        })
                    })
                )
            );
            const pagination: PaginationModel = {
                maxItems: 100,
                skipCount: 0
            };

            customResourcesService.loadFavorites(pagination).subscribe((result) => {
                expect(result.list.entries).toEqual([
                    {
                        entry: {
                            title: 'some-title',
                            description: 'some-description',
                            properties: {
                                'cm:title': 'some-title',
                                'cm:description': 'some-description'
                            },
                            aspectNames: ['aspect-name-1', 'aspect-name-2'],
                            allowableOperations: ['allowable-operation-1', 'allowable-operation-2']
                        }
                    } as any
                ]);
                done();
            });
        });

        it('should return a list of items with merged properties when target properties exist', (done) => {
            spyOn(customResourcesService.favoritesApi, 'listFavorites').and.returnValue(
                Promise.resolve(
                    new FavoritePaging({
                        list: new FavoritePagingList({
                            entries: [
                                {
                                    entry: new Favorite({
                                        properties: {
                                            'cm:property': 'some-property'
                                        },
                                        target: {
                                            file: {
                                                title: 'some-title',
                                                description: 'some-description'
                                            }
                                        },
                                        aspectNames: ['aspect-name-1', 'aspect-name-2'],
                                        allowableOperations: ['allowable-operation-1', 'allowable-operation-2']
                                    })
                                }
                            ]
                        })
                    })
                )
            );
            const pagination: PaginationModel = {
                maxItems: 100,
                skipCount: 0
            };

            customResourcesService.loadFavorites(pagination).subscribe((result) => {
                expect(result.list.entries).toEqual([
                    {
                        entry: {
                            title: 'some-title',
                            description: 'some-description',
                            properties: {
                                'cm:title': 'some-title',
                                'cm:description': 'some-description',
                                'cm:property': 'some-property'
                            },
                            aspectNames: ['aspect-name-1', 'aspect-name-2'],
                            allowableOperations: ['allowable-operation-1', 'allowable-operation-2']
                        }
                    } as any
                ]);
                done();
            });
        });
    });

    describe('loadFolderByNodeId', () => {
        const pagination: PaginationModel = {
            maxItems: 100,
            skipCount: 0
        };

        it('should call loadTrashcan when nodeId is -trashcan-', () => {
            spyOn(customResourcesService, 'loadTrashcan').and.stub();

            customResourcesService.loadFolderByNodeId('-trashcan-', pagination);
            expect(customResourcesService.loadTrashcan).toHaveBeenCalledWith(pagination, []);
        });

        it('should call loadSharedLinks when nodeId is -sharedlinks-', () => {
            spyOn(customResourcesService, 'loadSharedLinks').and.stub();

            customResourcesService.loadFolderByNodeId('-sharedlinks-', pagination, ['include'], 'where');
            expect(customResourcesService.loadSharedLinks).toHaveBeenCalledWith(pagination, ['include'], 'where');
        });

        it('should call loadSites when nodeId is -sites-', () => {
            spyOn(customResourcesService, 'loadSites').and.stub();

            customResourcesService.loadFolderByNodeId('-sites-', pagination, ['include'], 'where');
            expect(customResourcesService.loadSites).toHaveBeenCalledWith(pagination, 'where');
        });

        it('should call loadMemberSites when nodeId is -mysites-', () => {
            spyOn(customResourcesService, 'loadMemberSites').and.stub();

            customResourcesService.loadFolderByNodeId('-mysites-', pagination, ['include'], 'where');
            expect(customResourcesService.loadMemberSites).toHaveBeenCalledWith(pagination, 'where');
        });

        it('should call loadFavorites when nodeId is -favorites-', () => {
            spyOn(customResourcesService, 'loadFavorites').and.stub();

            customResourcesService.loadFolderByNodeId('-favorites-', pagination, ['include'], 'where');
            expect(customResourcesService.loadFavorites).toHaveBeenCalledWith(pagination, ['include'], 'where');
        });

        it('should call getRecentFiles when nodeId is -recent-', () => {
            spyOn(customResourcesService, 'getRecentFiles').and.stub();

            customResourcesService.loadFolderByNodeId('-recent-', pagination, ['include'], 'where', ['filters']);
            expect(customResourcesService.getRecentFiles).toHaveBeenCalledWith('-me-', pagination, ['filters']);
        });
    });

    describe('hasCorrespondingNodeIds', () => {
        it('should return true when nodeId comes from custom source', () => {
            spyOn(customResourcesService, 'isCustomSource').and.returnValue(true);

            const result = customResourcesService.hasCorrespondingNodeIds('-trashcan-');
            expect(result).toBeTrue();
        });

        it('should return true when nodeId comes from supported source', () => {
            spyOn(customResourcesService, 'isCustomSource').and.returnValue(false);
            spyOn(customResourcesService, 'isSupportedSource').and.returnValue(true);

            const result = customResourcesService.hasCorrespondingNodeIds('-trashcan-');
            expect(result).toBeTrue();
        });

        it('should return false when nodeId comes from neither custom nor supported source', () => {
            spyOn(customResourcesService, 'isCustomSource').and.returnValue(false);
            spyOn(customResourcesService, 'isSupportedSource').and.returnValue(false);

            const result = customResourcesService.hasCorrespondingNodeIds('-trashcan-');
            expect(result).toBeFalse();
        });
    });

    describe('getIdFromEntry', () => {
        const fakeNode: any = {
            entry: {
                id: 'some-id',
                nodeId: 'some-node-id',
                guid: 'guid',
                targetGuid: 'target-guid'
            }
        };

        it('should return nodeId for shared links', () => {
            expect(customResourcesService.getIdFromEntry(fakeNode, '-sharedlinks-')).toBe('some-node-id');
        });

        it('should return guid for sites and my sites', () => {
            expect(customResourcesService.getIdFromEntry(fakeNode, '-sites-')).toBe('guid');
            expect(customResourcesService.getIdFromEntry(fakeNode, '-mysites-')).toBe('guid');
        });

        it('should return targetGuid for favorites', () => {
            expect(customResourcesService.getIdFromEntry(fakeNode, '-favorites-')).toBe('target-guid');
        });

        it('should return id for other custom sources', () => {
            expect(customResourcesService.getIdFromEntry(fakeNode, '-trashcan-')).toBe('some-id');
        });
    });

    describe('getCorrespondingNodeIds', () => {
        const fakeNode: NodeEntry = {
            entry: {
                id: 'fake-id',
                name: 'fake-name',
                nodeType: 'cm:folder',
                isFolder: true,
                isFile: false,
                modifiedAt: new Date(),
                createdAt: new Date(),
                createdByUser: { id: 'fake-user', displayName: 'Fake User' },
                modifiedByUser: { id: 'fake-user', displayName: 'Fake User' },
                parentId: 'fake-parent-id'
            }
        };

        const fakePaging: NodePaging = {
            list: {
                pagination: { count: 1, hasMoreItems: false, totalItems: 1, skipCount: 0, maxItems: 20 },
                entries: [fakeNode]
            }
        };

        it('should return empty array when source is not custom and nodeId is not defined', (done) => {
            spyOn(customResourcesService, 'isCustomSource').and.returnValue(false);

            customResourcesService.getCorrespondingNodeIds(undefined).subscribe((result) => {
                expect(result).toEqual([]);
                done();
            });
        });

        it('should return node id when source is not custom and nodeId is defined', (done) => {
            spyOn(customResourcesService, 'isCustomSource').and.returnValue(false);
            spyOn(customResourcesService['nodesApi'], 'getNode').and.returnValue(Promise.resolve(fakeNode));

            customResourcesService.getCorrespondingNodeIds('nodeId').subscribe((result) => {
                expect(result).toEqual(['fake-id']);
                done();
            });
        });

        it('should return node id when source is custom', (done) => {
            spyOn(customResourcesService, 'isCustomSource').and.returnValue(true);
            spyOn(customResourcesService, 'loadFolderByNodeId').and.returnValue(of(fakePaging));
            spyOn(customResourcesService, 'getIdFromEntry').and.callThrough();

            customResourcesService.getCorrespondingNodeIds('nodeId').subscribe((result) => {
                expect(result).toEqual(['fake-id']);
                expect(customResourcesService.getIdFromEntry).toHaveBeenCalledWith(fakeNode, 'nodeId');
                done();
            });
        });
    });

    describe('isSupportedSource', () => {
        it('should return true for supported sources', () => {
            expect(customResourcesService.isSupportedSource('-my-')).toBeTrue();
            expect(customResourcesService.isSupportedSource('-root-')).toBeTrue();
            expect(customResourcesService.isSupportedSource('-shared-')).toBeTrue();
        });

        it('should return false for unsupported sources', () => {
            expect(customResourcesService.isSupportedSource('-unsupported-')).toBeFalse();
            expect(customResourcesService.isSupportedSource('regular-node-id')).toBeFalse();
        });
    });

    describe('isCustomSource', () => {
        it('should return true for custom sources', () => {
            expect(customResourcesService.isCustomSource('-trashcan-')).toBeTrue();
            expect(customResourcesService.isCustomSource('-sharedlinks-')).toBeTrue();
            expect(customResourcesService.isCustomSource('-sites-')).toBeTrue();
            expect(customResourcesService.isCustomSource('-mysites-')).toBeTrue();
            expect(customResourcesService.isCustomSource('-favorites-')).toBeTrue();
            expect(customResourcesService.isCustomSource('-recent-')).toBeTrue();
        });

        it('should return false for other sources', () => {
            expect(customResourcesService.isCustomSource('-unsupported-')).toBeFalse();
            expect(customResourcesService.isCustomSource('regular-node-id')).toBeFalse();
        });
    });

    describe('loadSharedLinks', () => {
        it('should call sharedLinksApi.listSharedLinks', (done) => {
            spyOn(customResourcesService.sharedLinksApi, 'listSharedLinks').and.callFake(() => Promise.resolve(null));

            customResourcesService.loadSharedLinks({ maxItems: 10, skipCount: 0 }).subscribe(() => {
                expect(customResourcesService.sharedLinksApi.listSharedLinks).toHaveBeenCalledWith({
                    include: ['path', 'properties', 'allowableOperations', 'permissions', 'aspectNames'],
                    maxItems: 10,
                    skipCount: 0,
                    where: undefined
                });
                done();
            });
        });

        it('should call sharedLinksApi.listSharedLinks with custom params when provided', (done) => {
            spyOn(customResourcesService.sharedLinksApi, 'listSharedLinks').and.callFake(() => Promise.resolve(null));

            customResourcesService.loadSharedLinks({ maxItems: 10, skipCount: 0 }, ['custom'], 'customWhere').subscribe(() => {
                expect(customResourcesService.sharedLinksApi.listSharedLinks).toHaveBeenCalledWith({
                    include: ['path', 'properties', 'allowableOperations', 'permissions', 'aspectNames', 'custom'],
                    maxItems: 10,
                    skipCount: 0,
                    where: 'customWhere'
                });
                done();
            });
        });
    });

    describe('loadTrashcan', () => {
        it('should call trashcanApi.listDeletedNodes', (done) => {
            spyOn(customResourcesService.trashcanApi, 'listDeletedNodes').and.callFake(() => Promise.resolve(null));

            customResourcesService.loadTrashcan({ maxItems: 10, skipCount: 0 }).subscribe(() => {
                expect(customResourcesService.trashcanApi.listDeletedNodes).toHaveBeenCalledWith({
                    include: ['path', 'properties', 'allowableOperations', 'permissions', 'aspectNames'],
                    maxItems: 10,
                    skipCount: 0
                });
                done();
            });
        });

        it('should call trashcanApi.listDeletedNodes with custom params when provided', (done) => {
            spyOn(customResourcesService.trashcanApi, 'listDeletedNodes').and.callFake(() => Promise.resolve(null));

            customResourcesService.loadTrashcan({ maxItems: 10, skipCount: 0 }, ['custom']).subscribe(() => {
                expect(customResourcesService.trashcanApi.listDeletedNodes).toHaveBeenCalledWith({
                    include: ['path', 'properties', 'allowableOperations', 'permissions', 'aspectNames', 'custom'],
                    maxItems: 10,
                    skipCount: 0
                });
                done();
            });
        });
    });

    describe('loadSites', () => {
        const fakeSite: SiteEntry = {
            entry: {
                id: 'fake-site-id',
                guid: 'fake-site-guid',
                title: 'Fake Site',
                description: 'This is a fake site for testing purposes',
                visibility: 'PUBLIC'
            }
        };

        const fakeSitePaging: SitePaging = {
            list: {
                entries: [fakeSite],
                pagination: {
                    count: 1,
                    hasMoreItems: false,
                    totalItems: 1,
                    skipCount: 0,
                    maxItems: 25
                }
            }
        };

        it('should call sitesApi.listSites', (done) => {
            spyOn(customResourcesService.sitesApi, 'listSites').and.callFake(() => Promise.resolve(fakeSitePaging));

            customResourcesService.loadSites({ maxItems: 10, skipCount: 0 }, 'where').subscribe((result) => {
                expect(customResourcesService.sitesApi.listSites).toHaveBeenCalledWith({
                    include: ['properties', 'aspectNames'],
                    maxItems: 10,
                    skipCount: 0,
                    where: 'where'
                });
                expect(result).toEqual(fakeSitePaging);
                expect((result.list.entries[0].entry as any).name).toBe(fakeSite.entry.title);
                done();
            });
        });

        it('should return error when sitesApi.listSites fails', (done) => {
            spyOn(customResourcesService.sitesApi, 'listSites').and.rejectWith(new Error('Error'));
            customResourcesService.loadSites({ maxItems: 10, skipCount: 0 }, 'where').subscribe({
                next: () => {
                    fail('Expected to throw an error');
                    done();
                },
                error: (error) => {
                    expect(error).toEqual(new Error('Error'));
                    done();
                }
            });
        });
    });

    describe('loadMemberSites', () => {
        const fakeSite: SiteEntry = {
            entry: {
                id: 'fake-site-id',
                guid: 'fake-site-guid',
                title: 'Fake Site',
                description: 'This is a fake site for testing purposes',
                visibility: 'PUBLIC'
            }
        };

        const fakeRole: SiteRoleEntry = {
            entry: {
                id: 'fake-site-id',
                guid: 'fake-site-guid',
                role: 'Fake Role',
                site: fakeSite.entry
            }
        };

        const fakeRolePaging: SiteRolePaging = {
            list: {
                entries: [fakeRole],
                pagination: {
                    count: 1,
                    hasMoreItems: false,
                    totalItems: 1,
                    skipCount: 0,
                    maxItems: 25
                }
            }
        };

        it('should call sitesApi.listSiteMembershipsForPerson', (done) => {
            spyOn(customResourcesService.sitesApi, 'listSiteMembershipsForPerson').and.callFake(() => Promise.resolve(fakeRolePaging));

            customResourcesService.loadMemberSites({ maxItems: 10, skipCount: 0 }, 'where').subscribe((result) => {
                expect(customResourcesService.sitesApi.listSiteMembershipsForPerson).toHaveBeenCalledWith('-me-', {
                    include: ['properties'],
                    maxItems: 10,
                    skipCount: 0,
                    where: 'where'
                });
                expect((result.list.entries[0].entry as any).name).toBe(fakeSite.entry.title);
                expect((result.list.entries[0].entry as any).allowableOperations).toEqual(['create']);
                done();
            });
        });

        it('should return error when sitesApi.listSiteMembershipsForPerson fails', (done) => {
            spyOn(customResourcesService.sitesApi, 'listSiteMembershipsForPerson').and.rejectWith(new Error('Error'));
            customResourcesService.loadMemberSites({ maxItems: 10, skipCount: 0 }, 'where').subscribe({
                next: () => {
                    fail('Expected to throw an error');
                    done();
                },
                error: (error) => {
                    expect(error).toEqual(new Error('Error'));
                    done();
                }
            });
        });
    });
});
