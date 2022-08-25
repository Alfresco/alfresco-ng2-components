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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { setupTestBed } from '@alfresco/adf-core';
import { TagNodeListComponent } from './tag-node-list.component';
import { TagService } from './services/tag.service';
import { of } from 'rxjs';
import { ContentTestingModule } from '../testing/content.testing.module';
import { TranslateModule } from '@ngx-translate/core';

describe('TagNodeList', () => {

    const dataTag = {
        list: {
            pagination: {
                count: 3,
                hasMoreItems: false,
                totalItems: 3,
                skipCount: 0,
                maxItems: 100
            },
            entries: [{
                entry: {tag: 'test1', id: '0ee933fa-57fc-4587-8a77-b787e814f1d2'}
            }, {entry: {tag: 'test2', id: 'fcb92659-1f10-41b4-9b17-851b72a3b597'}}, {
                entry: {tag: 'test3', id: 'fb4213c0-729d-466c-9a6c-ee2e937273bf'}
            }]
        }
    };

    let component: any;
    let fixture: ComponentFixture<TagNodeListComponent>;
    let element: HTMLElement;
    let tagService: TagService;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ContentTestingModule
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TagNodeListComponent);

        tagService = TestBed.inject(TagService);
        spyOn(tagService, 'getTagsByNodeId').and.returnValue(of(dataTag));

        element = fixture.nativeElement;
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    describe('Rendering tests', () => {

        it('Tag list relative a single node should be rendered', async () => {
            component.nodeId = 'fake-node-id';

            component.ngOnChanges();
            fixture.detectChanges();
            await fixture.whenStable();

            expect(element.querySelector('#tag_name_0').innerHTML).toBe('test1');
            expect(element.querySelector('#tag_name_1').innerHTML).toBe('test2');
            expect(element.querySelector('#tag_name_2').innerHTML).toBe('test3');

            expect(element.querySelector('#tag_chips_delete_test1')).not.toBe(null);
            expect(element.querySelector('#tag_chips_delete_test2')).not.toBe(null);
            expect(element.querySelector('#tag_chips_delete_test3')).not.toBe(null);
        });

        it('Tag list click on delete button should delete the tag', async () => {
            component.nodeId = 'fake-node-id';

            spyOn(tagService, 'removeTag').and.returnValue(of(true));

            component.ngOnChanges();
            fixture.detectChanges();
            await fixture.whenStable();

            const deleteButton: any = element.querySelector('#tag_chips_delete_test1');
            deleteButton.click();

            expect(tagService.removeTag).toHaveBeenCalledWith('fake-node-id', '0ee933fa-57fc-4587-8a77-b787e814f1d2');
        });

        it('Should not show the delete tag button if showDelete is false', async () => {
            component.nodeId = 'fake-node-id';
            component.showDelete = false;

            component.ngOnChanges();
            fixture.detectChanges();
            await fixture.whenStable();

            const deleteButton: any = element.querySelector('#tag_chips_delete_test1');
            expect(deleteButton).toBeNull();
        });

        it('Should show the delete tag button if showDelete is true', async () => {
            component.nodeId = 'fake-node-id';
            component.showDelete = true;

            component.ngOnChanges();
            fixture.detectChanges();
            await fixture.whenStable();

            const deleteButton: any = element.querySelector('#tag_chips_delete_test1');
            expect(deleteButton).not.toBeNull();
        });
    });
});
