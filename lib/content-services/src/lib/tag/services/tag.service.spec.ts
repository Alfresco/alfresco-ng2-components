/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

import { LogService, setupTestBed, UserPreferencesService } from '@alfresco/adf-core';
import { TagService } from './tag.service';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ContentTestingModule } from '../../testing/content.testing.module';
import { TranslateModule } from '@ngx-translate/core';
import { throwError } from 'rxjs';
import {
    Pagination,
    RequestQuery,
    RequestSortDefinitionInner,
    ResultNode,
    ResultSetContext,
    ResultSetContextFacetQueries,
    ResultSetPaging,
    ResultSetPagingList,
    ResultSetRowEntry,
    Tag,
    TagBody,
    TagEntry,
    TagPaging,
    TagPagingList
} from '@alfresco/js-api';

describe('TagService', () => {

    let service: TagService;
    let logService: LogService;
    let userPreferencesService: UserPreferencesService;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ContentTestingModule
        ]
    });

    beforeEach(() => {
        service = TestBed.inject(TagService);
        logService = TestBed.inject(LogService);
        userPreferencesService = TestBed.inject(UserPreferencesService);

        spyOn(service.tagsApi, 'deleteTagFromNode').and.returnValue(
            Promise.resolve({})
        );
        spyOn(service.tagsApi, 'createTagForNode').and.returnValue(
            Promise.resolve(new TagEntry({}))
        );
    });

    describe('Content tests', () => {

        it('getTagsByNodeId catch errors call', async () => {
            spyOn(service, 'getTagsByNodeId').and.returnValue(throwError({error : 'error'}));
            await service.getTagsByNodeId('fake-node-id').subscribe(() => {
                throwError('This call should fail');
            }, (error) => {
                expect(error.error).toBe('error');
            });
        });

        it('remove tag from a node should trigger a refresh event', async () => {
            await service.refresh.subscribe((res) => {
                expect(res).toBeDefined();
            });

            service.removeTag('fake-node-id', 'fake-tag');
        });

        it('add tag should trigger a refresh event', async () => {
            await service.refresh.subscribe((res) => {
                expect(res).toBeDefined();
            });

            service.addTag('fake-node-id', 'fake-tag');
        });

        it('delete tag should trigger a refresh event', async () => {
            await service.refresh.subscribe((res) => {
                expect(res).toBeDefined();
            });

            service.deleteTag('fake-tag-id');
        });

        describe('createTags', () => {
            it('should call createTags on tagsApi', () => {
                spyOn(service.tagsApi, 'createTags').and.returnValue(Promise.resolve([]));
                const tag1 = new TagBody();
                tag1.tag = 'Some tag 1';
                const tag2 = new TagBody();
                tag2.tag = 'Some tag 2';
                const tags = [tag1, tag2];
                service.createTags(tags);
                expect(service.tagsApi.createTags).toHaveBeenCalledWith(tags);
            });

            it('should emit refresh when tags creation is success', fakeAsync(() => {
                const tags: TagEntry[] = [{
                    entry: {
                        id: 'Some id 1',
                        tag: 'Some tag 1'
                    }
                }];
                spyOn(service.refresh, 'emit');
                spyOn(service.tagsApi, 'createTags').and.returnValue(Promise.resolve(tags));
                service.createTags([]);
                tick();
                expect(service.refresh.emit).toHaveBeenCalledWith(tags);
            }));

            it('should call error on logService when error occurs during tags creation', fakeAsync(() => {
                spyOn(logService, 'error');
                const error = 'Some error';
                spyOn(service.tagsApi, 'createTags').and.returnValue(Promise.reject(error));
                service.createTags([]);
                tick();
                expect(logService.error).toHaveBeenCalledWith(error);
            }));
        });

        describe('searchTags', () => {
            let result: ResultSetPaging;

            beforeEach(() => {
                result = new ResultSetPaging();
                result.list = new ResultSetPagingList();
                const tag = new ResultSetRowEntry();
                tag.entry = new ResultNode();
                tag.entry.id = 'some id';
                tag.entry.name = 'some name';
                result.list.entries = [tag];
                result.list.pagination = new Pagination();
            });

            it('should call search on searchApi with correct parameters', () => {
                const searchSpy = spyOn(service.searchApi, 'search').and.returnValue(Promise.resolve(result));
                const name = 'test';
                const maxItems = 25;
                spyOnProperty(userPreferencesService, 'paginationSize').and.returnValue(maxItems);

                const sortingByName = new RequestSortDefinitionInner();
                sortingByName.field = 'cm:name';
                sortingByName.ascending = true;
                sortingByName.type = RequestSortDefinitionInner.TypeEnum.FIELD;

                service.searchTags(name);
                expect(searchSpy).toHaveBeenCalledWith({
                    query: {
                        language: RequestQuery.LanguageEnum.Afts,
                        query: `PATH:"/cm:categoryRoot/cm:taggable/*" AND cm:name:"*${name}*"`
                    },
                    paging: {
                        skipCount: 0,
                        maxItems
                    },
                    sort: [sortingByName]
                });
            });

            it('should return observable which emits paging object for tags', fakeAsync(() => {
                spyOn(service.searchApi, 'search').and.returnValue(Promise.resolve(result));

                service.searchTags('test').subscribe((tagsResult) => {
                    const tagPaging = new TagPaging();
                    tagPaging.list = new TagPagingList();
                    const tagEntry = new TagEntry();
                    tagEntry.entry = new Tag();
                    tagEntry.entry.id = 'some id';
                    tagEntry.entry.tag = 'some name';
                    tagPaging.list.entries = [tagEntry];
                    tagPaging.list.pagination = new Pagination();
                    expect(tagsResult).toEqual(tagPaging);
                });
                tick();
            }));

            it('should call error on logService when error occurs during fetching paging object for tags', fakeAsync(() => {
                spyOn(logService, 'error');
                const error: string = 'Some error';
                spyOn(service.searchApi, 'search').and.returnValue(Promise.reject(error));
                service.searchTags('test').subscribe({
                    error: () => {
                        expect(logService.error).toHaveBeenCalledWith(error);
                    }
                });
                tick();
            }));
        });

        describe('updateTag', () => {
            const tag: TagEntry = {
                entry: {
                    tag: 'fake-tag',
                    id: 'fake-node-id'
                }
            };
            const tagBody: TagBody = {tag: 'updated-tag'};
            const updatedTag: TagEntry = {
                entry: {
                    ...tagBody,
                    id: 'fake-node-id'
                }
            };

            it('should call updateTag on tagsApi', () => {
                spyOn(service.tagsApi, 'updateTag').and.returnValue(Promise.resolve(updatedTag));

                service.updateTag(tag.entry.id, tagBody);
                expect(service.tagsApi.updateTag).toHaveBeenCalledWith(tag.entry.id, tagBody);
            });

            it('should emit refresh when tag updated successfully', fakeAsync(() => {
                spyOn(service.refresh, 'emit');
                spyOn(service.tagsApi, 'updateTag').and.returnValue(Promise.resolve(updatedTag));
                service.updateTag(tag.entry.id, tagBody);
                tick();
                expect(service.refresh.emit).toHaveBeenCalledWith(updatedTag);
            }));

            it('should call error on logService when error occurs during tag update', fakeAsync(() => {
                spyOn(logService, 'error');
                const error = 'Some error';
                spyOn(service.tagsApi, 'updateTag').and.returnValue(Promise.reject(error));
                service.updateTag(tag.entry.id, tagBody);
                tick();
                expect(logService.error).toHaveBeenCalledWith(error);
            }));
        });

        describe('getCountersForTags', () => {
            let result: ResultSetPaging;
            const tag1 = 'tag 1';

            beforeEach(() => {
                result = new ResultSetPaging();
                result.list = new ResultSetPagingList();
                result.list.context = new ResultSetContext();
                const facetQuery = new ResultSetContextFacetQueries();
                facetQuery.count = 2;
                facetQuery.label = tag1;
                facetQuery.filterQuery = `TAG:"${tag1}"`;
                result.list.context.facetQueries = [facetQuery];
            });

            it('should call search on searchApi with correct parameters', () => {
                const tag2 = 'tag 2';
                spyOn(service.searchApi, 'search').and.returnValue(Promise.resolve(result));

                service.getCountersForTags([tag1, tag2]);
                expect(service.searchApi.search).toHaveBeenCalledWith({
                    query: {
                        language: RequestQuery.LanguageEnum.Afts,
                        query: `*`
                    },
                    facetQueries: [{
                        query: `TAG:"${tag1}"`,
                        label: tag1
                    }, {
                        query: `TAG:"${tag2}"`,
                        label: tag2
                    }]
                });
            });

            it('should return observable which emits facet queries with counters for tags', (done) => {
                spyOn(service.searchApi, 'search').and.returnValue(Promise.resolve(result));
                service.getCountersForTags([tag1]).subscribe((counters) => {
                    expect(counters).toBe(result.list.context.facetQueries);
                    done();
                });
            });

            it('should return observable which emits undefined if context is not present', (done) => {
                result.list.context = undefined;

                spyOn(service.searchApi, 'search').and.returnValue(Promise.resolve(result));
                service.getCountersForTags([tag1]).subscribe((counters) => {
                    expect(counters).toBeUndefined();
                    done();
                });
            });

            it('should return observable which emits undefined if list is not present', (done) => {
                result.list = undefined;

                spyOn(service.searchApi, 'search').and.returnValue(Promise.resolve(result));
                service.getCountersForTags([tag1]).subscribe((counters) => {
                    expect(counters).toBeUndefined();
                    done();
                });
            });

            it('should call error on logService when error occurs during fetching counters for tags', fakeAsync(() => {
                spyOn(logService, 'error');
                const error = 'Some error';
                spyOn(service.searchApi, 'search').and.returnValue(Promise.reject(error));

                service.getCountersForTags([tag1]).subscribe({
                    error: () => {
                        expect(logService.error).toHaveBeenCalledWith(error);
                    }
                });
                tick();
            }));
        });

        describe('findTagByName', () => {
            let tagPaging: TagPaging;
            const tagName = 'some tag';

            beforeEach(() => {
                tagPaging = new TagPaging();
            });

            it('should call listTags on tagsApi', () => {
                spyOn(service.tagsApi, 'listTags').and.returnValue(Promise.resolve(tagPaging));

                service.findTagByName(tagName);

                expect(service.tagsApi.listTags).toHaveBeenCalledWith({
                    name: tagName
                });
            });

            it('should return observable which emits found tag', (done) => {
                tagPaging.list = new TagPagingList();
                const tag = new TagEntry();
                tag.entry = new Tag();
                tag.entry.id = 'some id';
                tag.entry.tag = tagName;
                tagPaging.list.entries = [tag];
                spyOn(service.tagsApi, 'listTags').and.returnValue(Promise.resolve(tagPaging));

                service.findTagByName(tagName).subscribe((result) => {
                    expect(result).toBe(tag);
                    done();
                });
            });

            it('should call error on logService when error occurs during fetching tag for name', fakeAsync(() => {
                spyOn(logService, 'error');
                const error = 'Some error';
                spyOn(service.tagsApi, 'listTags').and.returnValue(Promise.reject(error));

                service.findTagByName(tagName).subscribe({
                    error: () => {
                        expect(logService.error).toHaveBeenCalledWith(error);
                    }
                });
                tick();
            }));
        });
    });
});
