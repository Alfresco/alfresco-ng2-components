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

import { LogService, setupTestBed } from '@alfresco/adf-core';
import { TagService } from './tag.service';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ContentTestingModule } from '../../testing/content.testing.module';
import { TranslateModule } from '@ngx-translate/core';
import { throwError } from 'rxjs';
import {
    RequestQuery,
    RequestSortDefinitionInner,
    ResultSetPaging,
    SearchApi, SearchRequest,
    TagBody,
    TagEntry
} from '@alfresco/js-api';

describe('TagService', () => {

    let service: TagService;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ContentTestingModule
        ]
    });

    beforeEach(() => {
        service = TestBed.inject(TagService);
        spyOn(service['tagsApi'], 'deleteTagFromNode').and.returnValue(
            Promise.resolve({})
        );
        spyOn(service['tagsApi'], 'createTagForNode').and.returnValue(
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

        it('delete tag should trigger a refresh event', async () => {
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

        describe('createTags', () => {
            it('should call createTags on tagsApi', () => {
                spyOn(service.tagsApi, 'createTags').and.returnValue(Promise.resolve([]));
                const tag1: TagBody = new TagBody();
                tag1.tag = 'Some tag 1';
                const tag2: TagBody = new TagBody();
                tag2.tag = 'Some tag 2';
                const tags: TagBody[] = [tag1, tag2];
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
                const logService: LogService = TestBed.inject(LogService);
                spyOn(logService, 'error');
                const error: string = 'Some error';
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
            });

            it('should call search on searchApi with correct parameters', () => {
                const searchSpy: jasmine.Spy<(queryBody: SearchRequest) => Promise<ResultSetPaging>> =
                    spyOn(SearchApi.prototype, 'search').and.returnValue(Promise.resolve(result));
                const name: string = 'test';
                const sortingByName: RequestSortDefinitionInner = new RequestSortDefinitionInner();
                sortingByName.field = 'cm:name';
                sortingByName.ascending = true;
                sortingByName.type = RequestSortDefinitionInner.TypeEnum.FIELD;
                service.searchTags(name);
                expect(searchSpy).toHaveBeenCalledWith({
                    query: {
                        language: RequestQuery.LanguageEnum.Afts,
                        query: `PATH:"/cm:categoryRoot/cm:taggable/*" AND cm:name:"${name}*"`
                    },
                    paging: {
                        skipCount: 0,
                        maxItems: 100
                    },
                    sort: [sortingByName]
                });
            });

            it('should return observable which emits paging object for tags', (done) => {
                spyOn(SearchApi.prototype, 'search').and.returnValue(Promise.resolve(result));
                service.searchTags('test').subscribe((tagsResult) => {
                    expect(tagsResult).toBe(result);
                    done();
                });
            });

            it('should call error on logService when error occurs during fetching paging object for tags', fakeAsync(() => {
                const logService: LogService = TestBed.inject(LogService);
                spyOn(logService, 'error');
                const error: string = 'Some error';
                spyOn(SearchApi.prototype, 'search').and.returnValue(Promise.reject(error));
                service.searchTags('test').subscribe({
                    error: () => {
                        expect(logService.error).toHaveBeenCalledWith(error);
                    }
                });
                tick();
            }));
        });
    });
});
