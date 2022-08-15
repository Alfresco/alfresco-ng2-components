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

import { setupTestBed } from '@alfresco/adf-core';
import { TagService } from './tag.service';
import { TestBed } from '@angular/core/testing';
import { ContentTestingModule } from '../../testing/content.testing.module';
import { TranslateModule } from '@ngx-translate/core';
import { throwError } from 'rxjs';
import { TagEntry } from '@alfresco/js-api';

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
    });
});
