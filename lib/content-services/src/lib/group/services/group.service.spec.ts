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

import { TestBed } from '@angular/core/testing';
import { ContentTestingModule } from '../../testing/content.testing.module';
import { GroupService } from '@alfresco/adf-content-services';
import { GroupEntry } from '@alfresco/js-api';

describe('GroupService', () => {
    let service: GroupService;
    let group: GroupEntry;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ContentTestingModule]
        });
        service = TestBed.inject(GroupService);
        group = {
            entry: {
                id: 'some id',
                displayName: 'some name'
            }
        };
    });

    describe('getGroup', () => {
        it('should return group returned by GroupsApi', (done) => {
            spyOn(service.groupsApi, 'getGroup').and.returnValue(Promise.resolve(group));

            service.getGroup(group.entry.id).subscribe((groupEntry) => {
                expect(groupEntry).toBe(group);
                expect(service.groupsApi.getGroup).toHaveBeenCalledWith(group.entry.id);
                done();
            });
        });
    });

    describe('updateGroup', () => {
        it('should return updated Group', (done) => {
            spyOn(service.groupsApi, 'updateGroup').and.returnValue(Promise.resolve(group));

            service.updateGroup(group.entry).subscribe((groupEntry) => {
                expect(groupEntry).toBe(group);
                expect(service.groupsApi.updateGroup).toHaveBeenCalledWith(group.entry.id, {
                    displayName: groupEntry.entry.displayName
                });
                done();
            });
        });
    });
});
