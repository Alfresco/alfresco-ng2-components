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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { setupTestBed } from '@alfresco/adf-core';
import { TagNodeListComponent } from './tag-node-list.component';
import { TagService } from './services/tag.service';
import { of } from 'rxjs';
import { ContentTestingModule } from '../testing/content.testing.module';
import { TranslateModule } from '@ngx-translate/core';
import { TagEntry } from '@alfresco/js-api';

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
            entries: [
                {
                    entry: {tag: 'test1', id: '0ee933fa-57fc-4587-8a77-b787e814f1d2'}
                },
                {
                    entry: {tag: 'test2', id: 'fcb92659-1f10-41b4-9b17-851b72a3b597'}
                },
                {
                    entry: {tag: 'test3', id: 'fb4213c0-729d-466c-9a6c-ee2e937273bf'}
                },
                {
                    entry: {tag: 'test4', id: 'as4213c0-729d-466c-9a6c-ee2e937273as'}
                }
            ]
        }
    };

    let component: TagNodeListComponent;
    let fixture: ComponentFixture<TagNodeListComponent>;
    let element: HTMLElement;
    let tagService: TagService;
    let resizeCallback: ResizeObserverCallback;

    function findViewMoreButton(): HTMLButtonElement {
        return element.querySelector('.adf-view-more-button');
    }

    function findTagChips(): NodeListOf<Element> {
        return element.querySelectorAll('.adf-tag-chips');
    }

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ContentTestingModule
        ]
    });

    beforeEach(() => {
        const resizeObserverSpy = spyOn(window, 'ResizeObserver').and.callThrough();
        fixture = TestBed.createComponent(TagNodeListComponent);

        tagService = TestBed.inject(TagService);
        spyOn(tagService, 'getTagsByNodeId').and.returnValue(of(dataTag));

        element = fixture.nativeElement;
        component = fixture.componentInstance;
        component.nodeId = 'fake-node-id';
        fixture.detectChanges();
        resizeCallback = resizeObserverSpy.calls.mostRecent().args[0];
    });

    describe('Rendering tests', () => {

        it('Tag list relative a single node should be rendered', async () => {
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
            spyOn(tagService, 'removeTag').and.returnValue(of(undefined));

            component.ngOnChanges();
            fixture.detectChanges();
            await fixture.whenStable();

            const deleteButton: any = element.querySelector('#tag_chips_delete_test1');
            deleteButton.click();

            expect(tagService.removeTag).toHaveBeenCalledWith('fake-node-id', '0ee933fa-57fc-4587-8a77-b787e814f1d2');
        });

        it('Should not show the delete tag button if showDelete is false', async () => {
            component.showDelete = false;

            component.ngOnChanges();
            fixture.detectChanges();
            await fixture.whenStable();

            const deleteButton: any = element.querySelector('#tag_chips_delete_test1');
            expect(deleteButton).toBeNull();
        });

        it('Should show the delete tag button if showDelete is true', async () => {
            component.showDelete = true;

            component.ngOnChanges();
            fixture.detectChanges();
            await fixture.whenStable();

            const deleteButton: any = element.querySelector('#tag_chips_delete_test1');
            expect(deleteButton).not.toBeNull();
        });

        it('should not render view more button by default', async () => {
            component.ngOnChanges();
            fixture.detectChanges();
            await fixture.whenStable();

            expect(findViewMoreButton().hidden).toBeTrue();
            expect(findTagChips()).toHaveSize(4);
        });
    });

    describe('Limit tags display', () => {
        let initialEntries: TagEntry[];

        async function renderTags(entries?: TagEntry[]): Promise<any> {
            dataTag.list.entries = entries || initialEntries;
            component.tagsEntries = dataTag.list.entries;
            fixture.detectChanges();
            await fixture.whenStable();
        }

        beforeAll(() => {
            initialEntries = dataTag.list.entries;
        });

        beforeEach(() => {
            component.limitTagsDisplayed = true;
            component.ngOnInit();
            element.style.maxWidth = '309px';
        });

        it('should render view more button when limiting is enabled', async () => {
            await renderTags();
            component.ngOnChanges();
            fixture.detectChanges();
            await fixture.whenStable();
            expect(findViewMoreButton().hidden).toBeFalse();
            expect(findTagChips()).toHaveSize(component.tagsEntries.length);
        });

        it('should not render view more button when limiting is enabled and all tags fits into container', async () => {
            await renderTags();
            element.style.maxWidth = '800px';

            component.ngOnChanges();
            fixture.detectChanges();
            await fixture.whenStable();

            expect(findViewMoreButton().hidden).toBeTrue();
            expect(findTagChips()).toHaveSize(4);
        });

        it('should display all tags when view more button is clicked', async () => {
            await renderTags();
            component.ngOnChanges();
            fixture.detectChanges();
            await fixture.whenStable();

            let viewMoreButton = findViewMoreButton();
            viewMoreButton.click();
            fixture.detectChanges();
            await fixture.whenStable();

            viewMoreButton = findViewMoreButton();
            expect(viewMoreButton.hidden).toBeTrue();
            expect(findTagChips()).toHaveSize(4);
        });

        it('should not render view more button when tag takes more than one line and there are no more tags', async () => {
            await renderTags([{
                entry: {
                    tag: 'VeryLongTag VeryLongTag VeryLongTag VeryLongTag VeryLongTag VeryLongTag VeryLongTag VeryLongTag',
                    id: '0ee933fa-57fc-4587-8a77-b787e814f1d2'
                }
            }]);
            component.ngOnChanges();
            fixture.detectChanges();
            await fixture.whenStable();
            expect(findViewMoreButton().hidden).toBeTrue();
            expect(findTagChips()).toHaveSize(component.tagsEntries.length);
        });

        it('should render view more button when tag takes more than one line and there are more tags', async () => {
            await renderTags([{
                entry: {
                    tag: 'VeryLongTag VeryLongTag VeryLongTag VeryLongTag VeryLongTag VeryLongTag VeryLongTag VeryLongTag',
                    id: '0ee933fa-57fc-4587-8a77-b787e814f1d2'
                }
            }, {
                entry: {
                    tag: 'Some other tag',
                    id: '0ee933fa-57fc-4587-8a77-b787e814f1d3'
                }
            }]);
            component.ngOnChanges();
            fixture.detectChanges();
            await fixture.whenStable();
            const viewMoreButton = findViewMoreButton();
            expect(viewMoreButton.hidden).toBeFalse();
            expect(viewMoreButton.style.left).toBe('0px');
            expect(findTagChips()).toHaveSize(component.tagsEntries.length);
        });

        it('should not render view more button when there is enough space after resizing', async () => {
            await renderTags();
            component.ngOnChanges();
            fixture.detectChanges();
            await fixture.whenStable();
            element.style.maxWidth = '800px';
            resizeCallback([], null);
            fixture.detectChanges();
            const viewMoreButton = findViewMoreButton();
            expect(viewMoreButton.hidden).toBeTrue();
            expect(findTagChips()).toHaveSize(4);
        });

        it('should render view more button when there is not enough space after resizing', async () => {
            await renderTags();
            element.style.maxWidth = '800px';

            component.ngOnChanges();
            fixture.detectChanges();
            await fixture.whenStable();
            element.style.maxWidth = '309px';
            resizeCallback([], null);
            fixture.detectChanges();

            expect(findViewMoreButton().hidden).toBeFalse();
            expect(findTagChips()).toHaveSize(component.tagsEntries.length);
        });

        it('should not render view more button again resizing when there is not enough space if user requested to see all tags', async () => {
            await renderTags();
            component.ngOnChanges();
            fixture.detectChanges();
            await fixture.whenStable();
            const viewMoreButton = findViewMoreButton();
            viewMoreButton.click();
            fixture.detectChanges();
            element.style.maxWidth = '309px';
            resizeCallback([], null);
            fixture.detectChanges();
            expect(viewMoreButton.hidden).toBeTrue();
            expect(findTagChips()).toHaveSize(4);
        });
    });
});
