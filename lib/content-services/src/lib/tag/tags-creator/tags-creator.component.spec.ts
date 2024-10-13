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

import { TagsCreatorMode, TagService } from '@alfresco/adf-content-services';
import { NoopTranslateModule, NotificationService } from '@alfresco/adf-core';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { DebugElement } from '@angular/core';
import { ComponentFixture, discardPeriodicTasks, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { MatChipHarness } from '@angular/material/chips/testing';
import { MatError } from '@angular/material/form-field';
import { MatProgressSpinnerHarness } from '@angular/material/progress-spinner/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { EMPTY, of, throwError } from 'rxjs';
import { TagsCreatorComponent } from './tags-creator.component';

describe('TagsCreatorComponent', () => {
    let fixture: ComponentFixture<TagsCreatorComponent>;
    let component: TagsCreatorComponent;
    let tagService: TagService;
    let notificationService: NotificationService;
    let loader: HarnessLoader;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NoopAnimationsModule, NoopTranslateModule, TagsCreatorComponent],
            providers: [
                {
                    provide: TagService,
                    useValue: {
                        findTagByName: () => of(null),
                        searchTags: () =>
                            of({
                                list: {
                                    entries: []
                                }
                            })
                    }
                },
                {
                    provide: NotificationService,
                    useValue: {
                        showError: () => ({})
                    }
                }
            ]
        });

        fixture = TestBed.createComponent(TagsCreatorComponent);
        loader = TestbedHarnessEnvironment.loader(fixture);
        component = fixture.componentInstance;
        tagService = TestBed.inject(TagService);
        notificationService = TestBed.inject(NotificationService);

        fixture.detectChanges();
    });

    /**
     * Get name input element
     * @returns native element
     */
    function getNameInput(): HTMLInputElement {
        return fixture.debugElement.query(By.css(`.adf-tag-name-field input`))?.nativeElement;
    }

    /**
     * Get the create tag label
     * @returns native element
     */
    function getCreateTagLabel(): HTMLSpanElement {
        return fixture.debugElement.query(By.css('.adf-create-tag-label'))?.nativeElement;
    }

    /**
     * Get remove tag buttons
     * @returns list of native elements
     */
    function getRemoveTagButtons(): HTMLButtonElement[] {
        const elements = fixture.debugElement.queryAll(By.css(`.adf-dynamic-chip-list-delete-icon`));
        return elements.map((el) => el.nativeElement);
    }

    /**
     * Get newly added tags
     * @returns list of tags
     */
    async function getAddedTags(): Promise<string[]> {
        const matChipHarness = await loader.getAllHarnesses(MatChipHarness.with({ selector: '.adf-dynamic-chip-list-chip' }));
        const tagElements = [];
        for (const matChip of matChipHarness) {
            tagElements.push(await matChip.getText());
        }
        return tagElements;
    }

    /**
     * Adds tag to the added list
     * @param tagName tag name
     * @param addUsingEnter use Enter when adding
     * @param typingTimeout typing timeout in milliseconds (default 300)
     */
    function addTagToAddedList(tagName: string, addUsingEnter?: boolean, typingTimeout = 300): void {
        typeTag(tagName, typingTimeout);

        if (addUsingEnter) {
            getNameInput().dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter' }));
        } else {
            getCreateTagLabel().click();
        }

        tick(300);
        fixture.detectChanges();
    }

    /**
     * type a new tag
     * @param tagName tag name
     * @param timeout typing timeout in milliseconds (default 300)
     */
    function typeTag(tagName: string, timeout = 300): void {
        component.tagNameControlVisible = true;
        fixture.detectChanges();

        const tagNameInput = getNameInput();
        tagNameInput.value = tagName;
        tagNameInput.dispatchEvent(new InputEvent('input'));

        tick(timeout);
        fixture.detectChanges();
    }

    /**
     * Get the existing tags label
     * @returns label
     */
    function getExistingTagsLabel(): string {
        return fixture.debugElement.query(By.css('.adf-existing-tags-label')).nativeElement.textContent.trim();
    }

    describe('Created tags list', () => {
        it('should display no tags created message after initialization', () => {
            const message = fixture.debugElement.query(By.css('.adf-no-tags-message')).nativeElement.textContent.trim();
            expect(message).toBe('TAG.TAGS_CREATOR.NO_TAGS_CREATED');
        });

        it('should display all tags which have been typed in input and accepted using enter', fakeAsync(async () => {
            const tag1 = 'Tag 1';
            const tag2 = 'Tag 2';

            addTagToAddedList(tag1, true);
            addTagToAddedList(tag2, true);

            const tagElements = await getAddedTags();
            expect(tagElements.length).toBe(2);
            expect(tagElements[0]).toBe(tag1);
            expect(tagElements[1]).toBe(tag2);
        }));

        it('should display all tags which have been typed in input and accepted by clicking at create label', fakeAsync(async () => {
            const tag1 = 'Tag 1';
            const tag2 = 'Tag 2';

            addTagToAddedList(tag1);
            addTagToAddedList(tag2);

            const tagElements = await getAddedTags();
            expect(tagElements).toEqual([tag1, tag2]);
        }));

        it('should not add tag if contains only spaces', fakeAsync(async () => {
            addTagToAddedList('  ', true);

            expect((await getAddedTags()).length).toBe(0);
        }));

        it('should not add tag if field is empty', fakeAsync(async () => {
            addTagToAddedList('', true);

            expect((await getAddedTags()).length).toBe(0);
        }));

        it('should not duplicate already added tag', fakeAsync(async () => {
            const tag = 'Some tag';

            addTagToAddedList(tag, true);
            addTagToAddedList(tag, true);

            expect((await getAddedTags()).length).toBe(1);
        }));

        it('should not duplicate already existing tag', fakeAsync(async () => {
            const tag = 'Tag';

            spyOn(tagService, 'findTagByName').and.returnValue(
                of({
                    entry: {
                        tag,
                        id: 'tag-1'
                    }
                })
            );
            addTagToAddedList(tag, true);

            expect((await getAddedTags()).length).toBe(0);
        }));

        it('should not add tag if hit enter during tags loading', fakeAsync(async () => {
            addTagToAddedList('Tag', true, 0);
            expect((await getAddedTags()).length).toBe(0);
        }));

        it('should remove specific tag after clicking at remove icon', fakeAsync(async () => {
            const tag1 = 'Tag 1';
            const tag2 = 'Tag 2';

            addTagToAddedList(tag1);
            addTagToAddedList(tag2);

            getRemoveTagButtons()[0].click();

            tick();
            fixture.detectChanges();

            const tagElements = await getAddedTags();
            expect(tagElements).toEqual([tag2]);
        }));

        it('should disable button for removing tag if disabledTagsRemoving is true', fakeAsync(() => {
            const tag1 = 'Tag 1';
            component.disabledTagsRemoving = true;

            addTagToAddedList(tag1);
            tick();

            expect(getRemoveTagButtons()[0].hasAttribute('disabled')).toBeTrue();
        }));

        it('should show button for removing tag if disabledTagsRemoving is false', fakeAsync(() => {
            const tag1 = 'Tag 1';
            component.disabledTagsRemoving = false;

            addTagToAddedList(tag1);
            tick();

            expect(getRemoveTagButtons()[0].hasAttribute('hidden')).toBeFalse();
        }));

        it('should display tags passed by tags input', async () => {
            component.tags = ['Passed tag 1', 'Passed tag 2'];
            fixture.detectChanges();
            expect(await getAddedTags()).toEqual(component.tags);
        });
    });

    describe('Tag name field', () => {
        it('should input be autofocused when there are no tags present', fakeAsync(() => {
            component.tagNameControlVisible = true;
            fixture.detectChanges();
            tick(100);
            expect(getNameInput()).toBe(document.activeElement as HTMLInputElement);
        }));
        //eslint-disable-next-line
        xit('should input not be autofocused when there are tags present', fakeAsync(() => {
            component.tags = ['Tag 1'];
            component.tagNameControlVisible = true;
            fixture.detectChanges();
            tick(100);
            expect(getNameInput()).not.toEqual(document.activeElement as HTMLInputElement);
        }));

        it('should input be autofocused after showing input second time', fakeAsync(() => {
            component.tagNameControlVisible = true;
            fixture.detectChanges();
            tick(100);

            component.tagNameControlVisible = true;
            fixture.detectChanges();
            tick(100);

            expect(getNameInput()).toBe(document.activeElement as HTMLInputElement);
        }));

        describe('showEmptyTagMessage', () => {
            it('should return true when tags empty and non editable state', () => {
                component.tags = [];
                component.tagNameControlVisible = false;
                expect(component.showEmptyTagMessage).toBeTrue();
            });
        });

        describe('Errors', () => {
            /**
             * Get first error
             * @returns error text
             */
            function getFirstError(): string {
                const error = fixture.debugElement.query(By.directive(MatError));
                return error?.nativeElement.textContent.trim();
            }

            it('should show error for only spaces', fakeAsync(() => {
                typeTag('  ');
                component.tagNameControl.markAsTouched();
                fixture.detectChanges();
                const error = getFirstError();
                expect(error).toBe('TAG.TAGS_CREATOR.ERRORS.EMPTY_TAG');
            }));

            it('should show error for only spaces if tags are changed', fakeAsync(() => {
                typeTag('  ');
                component.tagNameControl.markAsTouched();
                component.tags = ['new tag 1', 'new tag 2'];
                fixture.detectChanges();
                expect(getFirstError()).toBe('TAG.TAGS_CREATOR.ERRORS.EMPTY_TAG');
            }));

            it('should show error when duplicated already added tag', fakeAsync(() => {
                const tag = 'Some tag';

                addTagToAddedList(tag);
                typeTag(tag);

                const error = getFirstError();
                expect(error).toBe('TAG.TAGS_CREATOR.ERRORS.ALREADY_ADDED_TAG');
            }));

            it('should show error when duplicated already added tag if tags are changed', fakeAsync(() => {
                const tag = 'Some tag';

                addTagToAddedList(tag);
                typeTag(tag);
                component.tags = ['Some tag'];
                fixture.detectChanges();

                expect(getFirstError()).toBe('TAG.TAGS_CREATOR.ERRORS.ALREADY_ADDED_TAG');
            }));

            it('should show error for prohibited characters', fakeAsync(() => {
                typeTag('tag*"<>\\/?:|{}()^.');
                component.tagNameControl.markAsTouched();
                fixture.detectChanges();
                const error = getFirstError();
                expect(error).toBe('TAG.TAGS_CREATOR.ERRORS.SPECIAL_CHARACTERS');
            }));

            it('should show error when duplicated already existing tag', fakeAsync(() => {
                const tag = 'Some tag';

                spyOn(tagService, 'findTagByName').and.returnValue(
                    of({
                        entry: {
                            tag,
                            id: 'tag-1'
                        }
                    })
                );
                typeTag(tag);

                const error = getFirstError();
                expect(error).toBe('TAG.TAGS_CREATOR.ERRORS.EXISTING_TAG');
            }));

            it('should show error when duplicated already existing tag with spaces', fakeAsync(() => {
                const tag = 'Some tag';

                spyOn(tagService, 'findTagByName').and.returnValue(
                    of({
                        entry: {
                            tag,
                            id: 'tag-1'
                        }
                    })
                );
                typeTag(tag + ' ');

                const error = getFirstError();
                expect(error).toBe('TAG.TAGS_CREATOR.ERRORS.EXISTING_TAG');
            }));

            it('should show error when deleting other Tag1 and Tag2 is typed and already existing tag', fakeAsync(() => {
                const tag1 = 'Some tag';
                const tag2 = 'Other tag';

                addTagToAddedList(tag1, true, 0);
                tick();

                spyOn(tagService, 'findTagByName').and.returnValue(
                    of({
                        entry: {
                            tag: tag2,
                            id: 'tag-1'
                        }
                    })
                );
                typeTag(tag2);
                component.removeTag(tag1);
                tick();
                fixture.detectChanges();
                const error = getFirstError();
                expect(error).toBe('TAG.TAGS_CREATOR.ERRORS.EXISTING_TAG');
            }));
        });
    });

    describe('Existing tags panel', () => {
        /**
         * Get the existing tags panel
         * @returns debug element
         */
        function getPanel(): DebugElement {
            return fixture.debugElement.query(By.css(`.adf-existing-tags-panel`));
        }

        it('should be visible when input is visible and something is typed in input', fakeAsync(() => {
            typeTag('some tag');

            expect(getPanel()).toBeTruthy();
        }));

        it('should not be visible initially when input is hidden and nothing was typed', () => {
            expect(getPanel()).toBeFalsy();
        });

        it('should be visible when input is visible and nothing has been typed to reserve required space', () => {
            component.tagNameControlVisible = true;
            fixture.detectChanges();

            expect(getPanel()).toBeTruthy();
        });

        it('should have correct label when mode is Create and Assign', fakeAsync(() => {
            component.mode = TagsCreatorMode.CREATE_AND_ASSIGN;

            typeTag('some tag');
            expect(getExistingTagsLabel()).toBe('TAG.TAGS_CREATOR.EXISTING_TAGS_SELECTION');
        }));

        it('should have correct label when mode is Create', fakeAsync(() => {
            component.mode = TagsCreatorMode.CREATE;

            typeTag('some tag');
            expect(getExistingTagsLabel()).toBe('TAG.TAGS_CREATOR.EXISTING_TAGS');
        }));

        describe('Label for tag creation', () => {
            it('should be visible', fakeAsync(() => {
                typeTag('some tag');

                expect(getCreateTagLabel()).toBeTruthy();
            }));

            it('should not be visible if typed only spaces', fakeAsync(() => {
                typeTag('  ');

                expect(getCreateTagLabel().hidden).toBeTrue();
            }));

            it('should not be visible if required error occurs', fakeAsync(() => {
                typeTag('');
                expect(getCreateTagLabel().hidden).toBeTrue();
            }));

            it('should not be visible when trying to duplicate already added tag', fakeAsync(() => {
                const tag = 'Some tag';

                addTagToAddedList(tag);
                typeTag(tag);

                expect(getCreateTagLabel().hasAttribute('hidden')).toBeTruthy();
            }));

            it('should not be visible when trying to duplicate already existing tag', fakeAsync(() => {
                const tag = 'Tag';
                spyOn(tagService, 'findTagByName').and.returnValue(
                    of({
                        entry: {
                            tag,
                            id: 'tag-1'
                        }
                    })
                );
                typeTag(tag);
                expect(getCreateTagLabel().hasAttribute('hidden')).toBeTruthy();
            }));

            it('should not be visible during typing', fakeAsync(() => {
                typeTag('some tag', 0);
                expect(getCreateTagLabel()).toBeFalsy();
                discardPeriodicTasks();
                flush();
            }));
        });

        describe('Existing tags', () => {
            /**
             * Get the existing tags
             * @returns list of tags
             */
            function getExistingTags(): string[] {
                const tagElements = fixture.debugElement.queryAll(By.css(`.adf-existing-tags-panel .adf-tag`));
                return tagElements.map((el) => el.nativeElement.textContent.trim());
            }

            it('should call findTagByName on tagService using name set in input', fakeAsync(() => {
                spyOn(tagService, 'findTagByName').and.returnValue(EMPTY);

                const name = 'Tag';
                typeTag(name);

                expect(tagService.findTagByName).toHaveBeenCalledWith(name);
            }));

            it('should not perform search if an illegal character is specified', fakeAsync(() => {
                spyOn(tagService, 'findTagByName').and.returnValue(EMPTY);
                spyOn(tagService, 'searchTags').and.returnValue(EMPTY);

                const name = 'Tag:"\'>';
                typeTag(name);

                expect(tagService.findTagByName).not.toHaveBeenCalled();
                expect(tagService.searchTags).not.toHaveBeenCalled();
            }));

            it('should call searchTags on tagService using name set in input and correct params', fakeAsync(() => {
                spyOn(tagService, 'searchTags').and.returnValue(EMPTY);

                const name = 'Tag';
                typeTag(name);

                expect(tagService.searchTags).toHaveBeenCalledWith(name, { orderBy: 'tag', direction: 'asc' }, false, 0, 15);
            }));

            it('should display loaded existing tags', fakeAsync(() => {
                const tag1 = 'Tag 1';
                const tag2 = 'Tag 2';

                spyOn(tagService, 'searchTags').and.returnValue(
                    of({
                        list: {
                            entries: [{ entry: { tag: tag1 } as any }, { entry: { tag: tag2 } as any }],
                            pagination: {}
                        }
                    })
                );

                typeTag('Tag');
                component.tagNameControl.markAsTouched();
                fixture.detectChanges();

                const tagElements = getExistingTags();
                expect(tagElements).toEqual([tag1, tag2]);
            }));

            it('should exclude tags passed through tags input from loaded existing tags', fakeAsync(() => {
                const tag1 = 'Tag 1';
                const tag2 = 'Tag 2';
                component.tags = [tag1];

                spyOn(tagService, 'searchTags').and.returnValue(
                    of({
                        list: {
                            entries: [{ entry: { tag: tag1 } as any }, { entry: { tag: tag2 } as any }],
                            pagination: {}
                        }
                    })
                );

                typeTag('Tag');

                expect(getExistingTags()).toEqual([tag2]);
            }));

            it('should not display existing tags if searching fails', fakeAsync(() => {
                spyOn(notificationService, 'showError');
                spyOn(tagService, 'searchTags').and.returnValue(throwError({}));

                typeTag('Tag');

                expect(getExistingTags()).toEqual([]);
                expect(notificationService.showError).toHaveBeenCalledWith('TAG.TAGS_CREATOR.ERRORS.FETCH_TAGS');
            }));

            it('should display exact tag', fakeAsync(() => {
                const tag = 'Tag';
                spyOn(tagService, 'findTagByName').and.returnValue(
                    of({
                        entry: {
                            tag,
                            id: 'tag-1'
                        }
                    })
                );

                typeTag(tag);

                const tagElements = getExistingTags();
                expect(tagElements).toEqual([tag]);
            }));

            it('should not display exact tag if that tag was passed through tags input', fakeAsync(() => {
                const tag = 'Tag';
                component.tags = [tag];
                spyOn(tagService, 'findTagByName').and.returnValue(
                    of({
                        entry: {
                            tag,
                            id: 'tag-1'
                        }
                    })
                );

                typeTag(tag);

                expect(getExistingTags()).toEqual([]);
            }));

            it('should not display exact tag if exact tag loading fails', fakeAsync(() => {
                spyOn(notificationService, 'showError');
                spyOn(tagService, 'findTagByName').and.returnValue(throwError({}));

                typeTag('Tag');

                expect(getExistingTags()).toEqual([]);
                expect(notificationService.showError).toHaveBeenCalledWith('TAG.TAGS_CREATOR.ERRORS.FETCH_TAGS');
            }));

            it('should exact tag be above others existing tags when there are some different existing tags than exact tag', fakeAsync(() => {
                const tag = 'Tag';
                const tag1 = 'Tag 1';
                const tag2 = 'Tag 2';

                spyOn(tagService, 'findTagByName').and.returnValue(
                    of({
                        entry: {
                            tag,
                            id: 'tag-1'
                        }
                    })
                );
                spyOn(tagService, 'searchTags').and.returnValue(
                    of({
                        list: {
                            entries: [{ entry: { tag: tag1 } as any }, { entry: { tag: tag2 } as any }],
                            pagination: {}
                        }
                    })
                );
                typeTag(tag);

                const tagElements = getExistingTags();
                expect(tagElements).toEqual([tag, tag1, tag2]);
            }));

            it('should selection be disabled if mode is Create', fakeAsync(() => {
                component.mode = TagsCreatorMode.CREATE;
                expect(component.isOnlyCreateMode()).toBeTrue();
            }));

            it('should selection be enabled if mode is Create And Assign', fakeAsync(() => {
                component.mode = TagsCreatorMode.CREATE_AND_ASSIGN;
                expect(component.isOnlyCreateMode()).toBeFalse();
            }));

            it('should select existing tag when selectionChange event emits', fakeAsync(async () => {
                const selectedTag = { entry: { tag: 'tag1' } as any };
                const leftTag = 'tag2';
                component.mode = TagsCreatorMode.CREATE_AND_ASSIGN;
                spyOn(tagService, 'searchTags').and.returnValue(
                    of({
                        list: {
                            entries: [selectedTag, { entry: { tag: leftTag } as any }],
                            pagination: {}
                        }
                    })
                );

                typeTag('Tag');

                component.addExistingTagToTagsToAssign(selectedTag);
                fixture.detectChanges();

                expect(await getAddedTags()).toEqual([selectedTag.entry.tag]);
                expect(getExistingTags()).toEqual([leftTag]);
            }));
        });

        describe('Spinner', () => {
            /**
             * Get the material progress spinner
             * @returns debug element
             */
            async function getSpinner(): Promise<MatProgressSpinnerHarness> {
                const progressSpinner = await loader.getHarnessOrNull(MatProgressSpinnerHarness);

                return progressSpinner;
            }

            it('should be displayed when existing tags are loading', fakeAsync(async () => {
                typeTag('tag', 0);
                component.tagNameControl.markAsTouched();
                fixture.detectChanges();

                const spinner = await getSpinner();
                expect(spinner).toBeTruthy();

                discardPeriodicTasks();
                flush();
            }));

            it('should not be displayed when existing tags stopped loading', fakeAsync(async () => {
                typeTag('tag');

                const spinner = await getSpinner();
                expect(spinner).toBeFalsy();
            }));

            it('should have correct diameter', fakeAsync(async () => {
                typeTag('tag', 0);

                const spinner = await getSpinner();
                expect((await (await spinner.host()).getDimensions()).width).toBe(50);
                expect((await (await spinner.host()).getDimensions()).height).toBe(50);

                discardPeriodicTasks();
                flush();
            }));
        });
    });
});
