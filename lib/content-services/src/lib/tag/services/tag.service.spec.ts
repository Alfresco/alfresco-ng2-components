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

import { LogService, setupTestBed, UserPreferencesService } from '@alfresco/adf-core';
import { TagService } from './tag.service';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ContentTestingModule } from '../../testing/content.testing.module';
import { TranslateModule } from '@ngx-translate/core';
import { throwError } from 'rxjs';
import { Pagination, Tag, TagBody, TagEntry, TagPaging, TagPagingList } from '@alfresco/js-api';

describe('TagService', () => {

    let service: TagService;
    let logService: LogService;
    let userPreferencesService: UserPreferencesService;

    const mockTagPaging = (): TagPaging => {
        const tagPaging = new TagPaging();
        tagPaging.list = new TagPagingList();
        const tag = new TagEntry();
        tag.entry = new Tag();
        tag.entry.id = 'some id';
        tag.entry.tag = 'some name';
        tagPaging.list.entries = [tag];
        tagPaging.list.pagination = new Pagination();
        return tagPaging;
    };

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

        it('should catch errors on getTagsByNodeId  call', async () => {
            spyOn(service, 'getTagsByNodeId').and.returnValue(throwError({error : 'error'}));
            await service.getTagsByNodeId('fake-node-id').subscribe(() => {
                throwError('This call should fail');
            }, (error) => {
                expect(error.error).toBe('error');
            });
        });

        it('should trigger a refresh event on removeTag() call', async () => {
            await service.refresh.subscribe((res) => {
                expect(res).toBeDefined();
            });

            service.removeTag('fake-node-id', 'fake-tag');
        });

        it('should trigger a refresh event on addTag() call', async () => {
            await service.refresh.subscribe((res) => {
                expect(res).toBeDefined();
            });

            service.addTag('fake-node-id', 'fake-tag');
        });

        it('should trigger a refresh event on deleteTag() call', async () => {
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

        describe('getAllTheTags', () => {
            let result: TagPaging;

            beforeEach(() => {
                result = mockTagPaging();
            });

            it('should call listTags on TagsApi with correct parameters when includedCounts is true', () => {
                spyOn(service.tagsApi, 'listTags').and.returnValue(Promise.resolve(result));
                const skipCount =  10;

                service.getAllTheTags({
                    skipCount
                }, true);
                expect(service.tagsApi.listTags).toHaveBeenCalledWith({
                    include: ['count'],
                    skipCount
                });
            });

            it('should call listTags on TagsApi with correct parameters when includedCounts is false', () => {
                spyOn(service.tagsApi, 'listTags').and.returnValue(Promise.resolve(result));
                const skipCount =  10;

                service.getAllTheTags({
                    skipCount
                }, false);
                expect(service.tagsApi.listTags).toHaveBeenCalledWith({
                    include: undefined,
                    skipCount
                });
            });

            it('should return observable which emits paging object for tags', fakeAsync(() => {
                spyOn(service.tagsApi, 'listTags').and.returnValue(Promise.resolve(result));

                service.getAllTheTags().subscribe((tagsResult) => {
                    expect(tagsResult).toEqual(result);
                });
                tick();
            }));

            it('should call error on logService when error occurs during fetching paging object for tags', fakeAsync(() => {
                spyOn(logService, 'error');
                const error: string = 'Some error';
                spyOn(service.tagsApi, 'listTags').and.returnValue(Promise.reject(error));
                service.getAllTheTags().subscribe({
                    error: () => {
                        expect(logService.error).toHaveBeenCalledWith(error);
                    }
                });
                tick();
            }));
        });

        describe('searchTags', () => {
            let result: TagPaging;

            beforeEach(() => {
                result = mockTagPaging();
            });

            it('should call listTags on TagsApi with correct default parameters', () => {
                spyOn(service.tagsApi, 'listTags').and.returnValue(Promise.resolve(result));
                const name = 'test';
                const maxItems = 25;
                spyOnProperty(userPreferencesService, 'paginationSize').and.returnValue(maxItems);

                service.searchTags(name);
                expect(service.tagsApi.listTags).toHaveBeenCalledWith({
                    tag: `*${name}*`,
                    skipCount: 0,
                    maxItems,
                    sorting: {
                        orderBy: 'tag',
                        direction: 'asc'
                    },
                    matching: true,
                    include: undefined
                });
            });

            it('should call listTags on TagsApi with correct specified parameters', () => {
                spyOn(service.tagsApi, 'listTags').and.returnValue(Promise.resolve(result));
                const name = 'test';
                spyOnProperty(userPreferencesService, 'paginationSize').and.returnValue(25);
                const maxItems = 100;
                const skipCount = 200;
                const sorting = {
                    orderBy: 'id',
                    direction: 'asc'
                };

                service.searchTags(name, sorting, true, skipCount, maxItems);
                expect(service.tagsApi.listTags).toHaveBeenCalledWith({
                    tag: `*${name}*`,
                    skipCount,
                    maxItems,
                    sorting,
                    matching: true,
                    include: ['count']
                });
            });

            it('should return observable which emits paging object for tags', fakeAsync(() => {
                spyOn(service.tagsApi, 'listTags').and.returnValue(Promise.resolve(result));

                service.searchTags('test').subscribe((tagsResult) => {
                    expect(tagsResult).toEqual(result);
                });
                tick();
            }));

            it('should call error on logService when error occurs during fetching paging object for tags', fakeAsync(() => {
                spyOn(logService, 'error');
                const error: string = 'Some error';
                spyOn(service.tagsApi, 'listTags').and.returnValue(Promise.reject(error));
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
                    tag: tagName,
                    include: undefined
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

        describe('assignTagsToNode', () => {
            let singleResult: TagEntry;
            let tags: TagBody[];

            const nodeId = 'some node id';

            beforeEach(() => {
                singleResult = new TagEntry();
                singleResult.entry = new Tag();
                singleResult.entry.tag = 'some name';
                const tag = new TagBody();
                tag.tag = 'some name';
                tags = [tag];
            });

            it('should call assignTagsToNode on TagsApi with correct parameters', () => {
                spyOn(service.tagsApi, 'assignTagsToNode').and.returnValue(Promise.resolve(singleResult));

                service.assignTagsToNode(nodeId, tags);
                expect(service.tagsApi.assignTagsToNode).toHaveBeenCalledWith(nodeId, tags);
            });

            it('should return observable which emits paging object for tags', fakeAsync(() => {
                const pagingResult = mockTagPaging();
                const tag2 = new TagBody();
                tag2.tag = 'some other tag';
                tags.push(tag2);
                spyOn(service.tagsApi, 'assignTagsToNode').and.returnValue(Promise.resolve(pagingResult));

                service.assignTagsToNode(nodeId, tags).subscribe((tagsResult) => {
                    expect(tagsResult).toEqual(pagingResult);
                });
                tick();
            }));

            it('should return observable which emits single tag', fakeAsync(() => {
                spyOn(service.tagsApi, 'assignTagsToNode').and.returnValue(Promise.resolve(singleResult));

                service.assignTagsToNode(nodeId, tags).subscribe((tagsResult) => {
                    expect(tagsResult).toEqual(singleResult);
                });
                tick();
            }));
        });
    });
});
