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
import { ContentTestingModule } from '../../testing/content.testing.module';
import { ContentIncludeQuery, GroupEntry } from '@alfresco/js-api';
import { GroupService } from './group.service';

describe('GroupService', () => {
    let service: GroupService;
    let group: GroupEntry;
    let returnedGroup: GroupEntry;
    let opts: ContentIncludeQuery;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ContentTestingModule]
        });
        service = TestBed.inject(GroupService);
        group = {
            entry: {
                id: 'some id',
                displayName: 'some name',
                description: 'some description'
            }
        };
        returnedGroup = JSON.parse(JSON.stringify(group));
        opts = {
            include: ['description']
        };
    });

    describe('getGroup', () => {
        it('should return group returned by GroupsApi', (done) => {
            spyOn(service.groupsApi, 'getGroup').and.returnValue(Promise.resolve(returnedGroup));

            service.getGroup(group.entry.id, opts).subscribe((groupEntry) => {
                expect(groupEntry).toBe(returnedGroup);
                expect(service.groupsApi.getGroup).toHaveBeenCalledWith(group.entry.id, {
                    include: ['description']
                });
                done();
            });
        });

        it('should return group returned by GroupsApi when description is not supplied', (done) => {
            returnedGroup.entry.description = undefined;
            spyOn(service.groupsApi, 'getGroup').and.returnValue(Promise.resolve(returnedGroup));

            service.getGroup(group.entry.id, opts).subscribe((groupEntry) => {
                expect(groupEntry).toEqual({
                    entry: {
                        id: returnedGroup.entry.id,
                        displayName: returnedGroup.entry.displayName,
                        description: ''
                    }
                });
                expect(service.groupsApi.getGroup).toHaveBeenCalledWith(group.entry.id, {
                    include: ['description']
                });
                done();
            });
        });
    });

    describe('updateGroup', () => {
        it('should return updated Group', (done) => {
            spyOn(service.groupsApi, 'updateGroup').and.returnValue(Promise.resolve(returnedGroup));

            service.updateGroup(group.entry, opts).subscribe((groupEntry) => {
                expect(groupEntry).toEqual(returnedGroup);
                expect(service.groupsApi.updateGroup).toHaveBeenCalledWith(
                    group.entry.id,
                    {
                        displayName: group.entry.displayName,
                        description: group.entry.description
                    },
                    {
                        include: ['description']
                    }
                );
                done();
            });
        });

        it('should return updated Group when description is not supplied', (done) => {
            returnedGroup.entry.description = undefined;
            spyOn(service.groupsApi, 'updateGroup').and.returnValue(Promise.resolve(returnedGroup));

            service.updateGroup(group.entry, opts).subscribe((groupEntry) => {
                expect(groupEntry).toEqual({
                    entry: {
                        id: returnedGroup.entry.id,
                        displayName: returnedGroup.entry.displayName,
                        description: ''
                    }
                });
                expect(service.groupsApi.updateGroup).toHaveBeenCalledWith(
                    group.entry.id,
                    {
                        displayName: group.entry.displayName,
                        description: group.entry.description
                    },
                    {
                        include: ['description']
                    }
                );
                done();
            });
        });

        it('should allow to update only description', (done) => {
            spyOn(service.groupsApi, 'updateGroup').and.returnValue(Promise.resolve(returnedGroup));
            group.entry.displayName = undefined;

            service.updateGroup(group.entry, opts).subscribe((groupEntry) => {
                expect(groupEntry).toEqual(returnedGroup);
                expect(service.groupsApi.updateGroup).toHaveBeenCalledWith(
                    group.entry.id,
                    {
                        displayName: group.entry.displayName,
                        description: group.entry.description
                    },
                    {
                        include: ['description']
                    }
                );
                done();
            });
        });
    });
});
