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

import { CustomResourcesService } from './custom-resources.service';
import { PaginationModel } from '@alfresco/adf-core';
import { TestBed } from '@angular/core/testing';
import { ContentTestingModule } from '../../testing/content.testing.module';
import { FavoritePaging } from '@alfresco/js-api';

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
            spyOn(customResourcesService.favoritesApi, 'listFavorites').and.returnValue(Promise.resolve(new FavoritePaging({
                list: {
                    entries: [
                        {
                            entry: {
                                target: {
                                    file: {
                                        title: 'some-title',
                                        description: 'some-description'
                                    }
                                }
                            }
                        }
                    ]
                }
            })));
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
                            }
                        }
                    } as any
                ]);
                done();
            });
        });

        it('should return a list of items with merged properties when target properties exist', (done) => {
            spyOn(customResourcesService.favoritesApi, 'listFavorites').and.returnValue(Promise.resolve(new FavoritePaging({
                list: {
                    entries: [
                        {
                            entry: {
                                properties: {
                                    'cm:property': 'some-property'
                                },
                                target: {
                                    file: {
                                        title: 'some-title',
                                        description: 'some-description'
                                    }
                                }
                            }
                        }
                    ]
                }
            })));
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
                            }
                        }
                    } as any
                ]);
                done();
            });
        });
    });
});
