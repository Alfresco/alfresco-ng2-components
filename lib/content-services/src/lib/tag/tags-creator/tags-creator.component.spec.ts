/*
 * Copyright © 2005 - 2021 Alfresco Software, Ltd. All rights reserved.
 *
 * License rights for this program may be obtained from Alfresco Software, Ltd.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { ComponentFixture, discardPeriodicTasks, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { TagsCreatorComponent } from './tags-dialog.smart-component';
import { NotificationService } from '@alfresco/adf-core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatError, MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { ContentDirectiveModule, TagService } from '@alfresco/adf-content-services';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EMPTY, of, Subject } from 'rxjs';
import { DebugElement } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { TagEntry } from '@alfresco/js-api';

describe('TagsDialogComponent', () => {
    let fixture: ComponentFixture<TagsCreatorComponent>;
    let tagService: TagService;
    let notificationService: NotificationService;
    let dialog: MatDialogRef<TagsCreatorComponent>;

    let addTagButton: HTMLButtonElement;

    const tagNameFieldSelector = '.acc-tag-name-field';

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [TagsCreatorComponent],
            imports: [
                HttpClientModule,
                ContentDirectiveModule,
                MatButtonModule,
                MatDialogModule,
                MatFormFieldModule,
                MatIconModule,
                MatInputModule,
                MatProgressSpinnerModule,
                NoopAnimationsModule,
                ReactiveFormsModule,
                TranslateModule.forRoot()
            ],
            providers: [
                {
                    provide: TagService,
                    useValue: {
                        findTagByName: () => of(null),
                        searchTags: () =>
                            of({
                                list: {
                                    entries: [],
                                },
                            }),
                        createTags: () => EMPTY,
                    },
                },
                {
                    provide: MatDialogRef,
                    useValue: {
                        close: () => {},
                    },
                },
                {
                    provide: NotificationService,
                    useValue: {
                        showInfo: () => ({})
                    },
                },
            ],

            teardown: { destroyAfterEach: true },
        });

        fixture = TestBed.createComponent(TagsCreatorComponent);
        tagService = TestBed.inject(TagService);
        dialog = TestBed.inject(MatDialogRef<TagsCreatorComponent>);
        notificationService = TestBed.inject(NotificationService);

        fixture.detectChanges();

        addTagButton = fixture.debugElement.query(By.css(`[data-automation-id="tags-dialog-add-button"]`)).nativeElement;
    });

    function getNameInput(): HTMLInputElement {
        return fixture.debugElement.query(By.css(`.acc-tag-name-field input`))?.nativeElement;
    }

    function getCreateTagLabel(): HTMLSpanElement {
        return fixture.debugElement.query(By.css('.acc-create-tag-label'))?.nativeElement;
    }

    function getRemoveTagButtons(): HTMLButtonElement[] {
        const elements = fixture.debugElement.queryAll(By.css(`[data-automation-id="tags-dialog-remove-tag-button"]`));
        return elements.map(el => el.nativeElement);
    }

    function clickAtHideNameInputButton() {
        fixture.debugElement.query(By.css(`[data-automation-id="tags-dialog-hide-name-input-button"]`)).nativeElement.click();
        fixture.detectChanges();
    }

    function getAddedTags(): string[] {
        const tagElements = fixture.debugElement.queryAll(By.css(`.acc-tags-creation .acc-tag`));
        return tagElements.map(el => el.nativeElement.firstChild.nodeValue.trim());
    }

    function clickAtAddTagButton(): void {
        addTagButton.click();
        fixture.detectChanges();
    }

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

    function typeTag(tagName: string, timeout = 300): void {
        clickAtAddTagButton();

        const tagNameInput = getNameInput();
        tagNameInput.value = tagName;
        tagNameInput.dispatchEvent(new InputEvent('input'));

        tick(timeout);
        fixture.detectChanges();
    }

    describe('Created tags list', () => {
        it('should display no tags created message after initialization', () => {
            const message =  fixture.debugElement.query(By.css('.acc-no-tags-message')).nativeElement.textContent.trim();
            expect(message).toBe('CONTENT_STRUCTURING.TAGS.TAGS_DIALOG.NO_TAGS_CREATED');
        });

        it('should display all tags which have been typed in input and accepted using enter', fakeAsync(() => {
            const tag1 = 'Tag 1';
            const tag2 = 'Tag 2';

            addTagToAddedList(tag1, true);
            addTagToAddedList(tag2, true);

            const tagElements = getAddedTags();
            expect(tagElements.length).toBe(2);
            expect(tagElements[0]).toBe(tag1);
            expect(tagElements[1]).toBe(tag2);
        }));

        it('should display all tags which have been typed in input and accepted by clicking at create label', fakeAsync(() => {
            const tag1 = 'Tag 1';
            const tag2 = 'Tag 2';

            addTagToAddedList(tag1);
            addTagToAddedList(tag2);

            const tagElements = getAddedTags();
            expect(tagElements).toEqual([tag1, tag2]);
        }));

        it('should not add tag if contains only spaces', fakeAsync(() => {
            addTagToAddedList('  ', true);

            expect(getAddedTags().length).toBe(0);
        }));

        it('should not add tag if field is empty', fakeAsync(() => {
            addTagToAddedList('', true);

            expect(getAddedTags().length).toBe(0);
        }));

        it('should not duplicate already added tag', fakeAsync(() => {
            const tag = 'Some tag';

            addTagToAddedList(tag, true);
            addTagToAddedList(tag, true);

            expect(getAddedTags().length).toBe(1);
        }));

        it('should not duplicate already existing tag', fakeAsync(() => {
            const tag = 'Tag';

            spyOn(tagService, 'findTagByName').and.returnValue(of({
                entry: {
                    tag,
                    id: 'tag-1'
                }
            }));
            addTagToAddedList(tag, true);

            expect(getAddedTags().length).toBe(0);
        }));

        it('should not add tag if hit enter during tags loading', fakeAsync(() => {
            addTagToAddedList('Tag', true, 0);
            expect(getAddedTags().length).toBe(0);
        }));


        it('should remove specific tag after clicking at remove icon', fakeAsync(() => {
            const tag1 = 'Tag 1';
            const tag2 = 'Tag 2';

            addTagToAddedList(tag1);
            addTagToAddedList(tag2);

            getRemoveTagButtons()[0].click();

            tick();
            fixture.detectChanges();

            const tagElements = getAddedTags();
            expect(tagElements).toEqual([tag2]);
        }));
    });

    describe('Tag creation button', () => {
        it('should display add icon', () => {
            expect(addTagButton.textContent.trim()).toBe('add');
        });

        it('should be visible initially', () => {
            expect(addTagButton.hasAttribute('hidden')).toBeFalsy();
        });

        it('should not be visible after click', () => {
            clickAtAddTagButton();

            expect(addTagButton.hasAttribute('hidden')).toBeTruthy();
        });

        it('should be visible after hiding input', () => {
            clickAtAddTagButton();
            clickAtHideNameInputButton();

            expect(addTagButton.hasAttribute('hidden')).toBeFalsy();
        });
    });

    describe('Tag name field', () => {
        it('should be visible after clicking at add tag button', () => {
            clickAtAddTagButton();

            const tagNameField = fixture.debugElement.query(By.css(tagNameFieldSelector));
            expect(tagNameField).toBeTruthy();
            expect(tagNameField.nativeElement.hasAttribute('hidden')).toBeFalsy();
            expect(tagNameField.query(By.directive(MatFormField))).toBeTruthy();
        });

        it('should be hidden after clicking button for hiding input', () => {
            clickAtAddTagButton();

            clickAtHideNameInputButton();

            const tagNameField = fixture.debugElement.query(By.css(tagNameFieldSelector));
            expect(tagNameField).toBeFalsy();
        });

        it('should input be autofocused', fakeAsync(() => {
            clickAtAddTagButton();
            tick(100);
            expect(getNameInput()).toBe(document.activeElement as HTMLInputElement);
        }));

        it('should input be autofocused after showing input second time', fakeAsync(() => {
            clickAtAddTagButton();
            tick(100);

            clickAtHideNameInputButton();
            clickAtAddTagButton();
            tick(100);

            expect(getNameInput()).toBe(document.activeElement as HTMLInputElement);
        }));

        describe('Errors', () => {
            function getFirstError(): string {
                const error = fixture.debugElement.query(By.directive(MatError));
                return error.nativeElement.textContent;
            }

            it('should show error for only spaces', fakeAsync(() => {
                typeTag('  ');
                const error = getFirstError();
                expect(error).toBe('CONTENT_STRUCTURING.TAGS.TAGS_DIALOG.ERRORS.EMPTY_TAG');
            }));

            it('should show error for required', fakeAsync(() => {
                typeTag('');
                const error = getFirstError();
                expect(error).toBe('CONTENT_STRUCTURING.TAGS.TAGS_DIALOG.ERRORS.REQUIRED');
            }));

            it('should show error when duplicated already added tag', fakeAsync(() => {
                const tag = 'Some tag';

                addTagToAddedList(tag);
                typeTag(tag);

                const error = getFirstError();
                expect(error).toBe('CONTENT_STRUCTURING.TAGS.TAGS_DIALOG.ERRORS.ALREADY_ADDED_TAG');
            }));

            it('should show error when duplicated already existing tag', fakeAsync(() => {
                const tag = 'Some tag';

                spyOn(tagService, 'findTagByName').and.returnValue(of({
                    entry: {
                        tag,
                        id: 'tag-1'
                    }
                }));
                typeTag(tag);

                const error = getFirstError();
                expect(error).toBe('CONTENT_STRUCTURING.TAGS.TAGS_DIALOG.ERRORS.EXISTING_TAG');
            }));

            it('should error for required when not typed anything and blur input', fakeAsync(() => {
                clickAtAddTagButton();
                tick(100);

                getNameInput().blur();
                fixture.detectChanges();

                const error = getFirstError();
                expect(error).toBe('CONTENT_STRUCTURING.TAGS.TAGS_DIALOG.ERRORS.REQUIRED');

                flush();
            }));
        });
    });

    describe('Existing tags panel', () => {
        function getPanel(): DebugElement {
            return fixture.debugElement.query(By.css(`.acc-existing-tags-panel`));
        }

        function scrollTagList() {
            fixture.debugElement
                    .query(By.css(`.acc-existing-tags-panel .acc-tags-list`))
                    .nativeElement.dispatchEvent(new Event('scroll'));
            fixture.detectChanges();
        }

        it('should be visible when input is visible and something is typed in input', fakeAsync(() => {
            typeTag('some tag');

            expect(getPanel()).toBeTruthy();
        }));

        it('should not be visible initially when input is hidden and nothing was typed', () => {
            expect(getPanel()).toBeFalsy();
        });

        it('should not be visible when input is visible and empty string is typed in input', fakeAsync(() => {
            typeTag('   ');

            expect(getPanel()).toBeFalsy();
        }));

        it('should not be visible when input is visible and nothing has been typed', () => {
            clickAtAddTagButton();

            expect(getPanel()).toBeFalsy();
        });

        it('should not be visible when something has been typed and input has been hidden', fakeAsync(() => {
            typeTag('some tag');

            clickAtHideNameInputButton();

            expect(getPanel()).toBeFalsy();
        }));

        describe('Label for tag creation', () => {
            it('should be visible', fakeAsync(() => {
                typeTag('some tag');

                expect(getCreateTagLabel()).toBeTruthy();
            }));

            it('should not be visible if typed only spaces', fakeAsync(() => {
                typeTag('  ');

                expect(getCreateTagLabel()).toBeFalsy();
            }));

            it('should not be visible if required error occurs', fakeAsync(() => {
                typeTag('');
                expect(getCreateTagLabel()).toBeFalsy();
            }));

            it('should not be visible when trying to duplicate already added tag', fakeAsync(() => {
                const tag = 'Some tag';

                addTagToAddedList(tag);
                typeTag(tag);

                expect(getCreateTagLabel().hasAttribute('hidden')).toBeTruthy();
            }));

            it('should not be visible when trying to duplicate already existing tag', fakeAsync(() => {
                const tag = 'Tag';
                spyOn(tagService, 'findTagByName').and.returnValue(of({
                    entry: {
                        tag,
                        id: 'tag-1'
                    }
                }));
                typeTag(tag);
                expect(getCreateTagLabel().hasAttribute('hidden')).toBeTruthy();
            }));

            it('should not be visible if typed nothing', () => {
                clickAtAddTagButton();
                expect(getCreateTagLabel()).toBeFalsy();
            });

            it('should not be visible during typing', fakeAsync(() => {
                typeTag('some tag', 0);
                expect(getCreateTagLabel()).toBeFalsy();
                discardPeriodicTasks();
                flush();
            }));
        });

        describe('Existing tags', () => {
            function getExistingTags(): string[] {
                const tagElements = fixture.debugElement.queryAll(By.css(`.acc-existing-tags-panel .acc-tag`));
                return tagElements.map(el => el.nativeElement.firstChild.nodeValue.trim());
            }

            it('should call findTagByName on tagService using name set in input', fakeAsync(() => {
                spyOn(tagService, 'findTagByName').and.returnValue(EMPTY);

                const name = 'Tag';
                typeTag(name);

                expect(tagService.findTagByName).toHaveBeenCalledWith(name);
            }));

            it('should call searchTags on tagService using name set in input', fakeAsync(() => {
                spyOn(tagService, 'searchTags').and.returnValue(EMPTY);

                const name = 'Tag';
                typeTag(name);

                expect(tagService.searchTags).toHaveBeenCalledWith(name);
            }));

            it('should display loaded existing tags', fakeAsync(() => {
                const tag1 = 'Tag 1';
                const tag2 = 'Tag 2';

                spyOn(tagService, 'searchTags').and.returnValue(
                    of({
                        list: {
                            entries: [
                                { entry: { tag: tag1 } as any },
                                { entry: { tag: tag2 } as any },
                            ],
                            pagination: {}
                        }
                    })
                );

                typeTag('Tag');

                const tagElements = getExistingTags();
                expect(tagElements).toEqual([tag1, tag2]);
            }));

            it('should display exact tag', fakeAsync(() => {
                const tag = 'Tag';
                spyOn(tagService, 'findTagByName').and.returnValue(of({
                    entry: {
                        tag,
                        id: 'tag-1'
                    }
                }));

                typeTag(tag);

                const tagElements = getExistingTags();
                expect(tagElements).toEqual([tag]);
            }));

            it('should exact tag be above others existing tags when there are some different existing tags than exact tag', fakeAsync(() => {
                const tag = 'Tag';
                const tag1 = 'Tag 1';
                const tag2 = 'Tag 2';

                spyOn(tagService, 'findTagByName').and.returnValue(of({
                    entry: {
                        tag,
                        id: 'tag-1'
                    }
                }));
                spyOn(tagService, 'searchTags').and.returnValue(
                    of({
                        list: {
                            entries: [
                                { entry: { tag: tag1 } as any },
                                { entry: { tag: tag2 } as any },
                            ],
                            pagination: {}
                        },
                    })
                );
                typeTag(tag);

                const tagElements = getExistingTags();
                expect(tagElements).toEqual([tag, tag1, tag2]);
            }));

            it('should call searchTags with correct name and skipCount after scrolling if pagination has more items', fakeAsync(() => {
                const searchTagsSpy = spyOn(tagService, 'searchTags').and.returnValues(
                    of({
                        list: {
                            entries: [
                                { entry: { tag: 'Tag 1' }  as any },
                            ],
                            pagination: {
                                hasMoreItems: true,
                                skipCount: 1,
                                maxItems: 5,
                            },
                        },
                    }),
                    new Subject()
                );
                const name = 'Tag';
                typeTag(name);

                searchTagsSpy.calls.reset();
                scrollTagList();

                expect(searchTagsSpy).toHaveBeenCalledWith(name, {
                    orderBy: 'tag',
                    direction: 'asc'
                }, false, 6);
            }));

            it('should not call searchTags after scrolling if pagination has not more items', fakeAsync(() => {
                const searchTagsSpy = spyOn(tagService, 'searchTags').and.returnValues(
                    of({
                        list: {
                            entries: [
                                { entry: { tag: 'Tag 1' } as any},
                            ],
                            pagination: {
                                hasMoreItems: false,
                                skipCount: 1,
                                maxItems: 5,
                            },
                        },
                    }),
                    new Subject()
                );

                typeTag('Tag');

                searchTagsSpy.calls.reset();
                scrollTagList();

                expect(searchTagsSpy).not.toHaveBeenCalled();
            }));

            it('should display more existing tags after scrolling if pagination has more items ', fakeAsync(() => {
                const tag1 = 'Tag 1';
                const tag2 = 'Tag 2';
                const tag3 = 'Tag 3';
                const tag4 = 'Tag 4';

                spyOn(tagService, 'searchTags').and.returnValues(
                    of({
                        list: {
                            entries: [
                                { entry: { tag: tag1 } as any },
                                { entry: { tag: tag2 } as any },
                            ],
                            pagination: {
                                hasMoreItems: true,
                            },
                        },
                    }),
                    of({
                        list: {
                            entries: [
                                { entry: { tag: tag3 } as any },
                                { entry: { tag: tag4 } as any },
                            ],
                            pagination: {}
                        },
                    })
                );
                typeTag('Tag');
                scrollTagList();

                const tagElements = getExistingTags();
                expect(tagElements).toEqual([tag1, tag2, tag3, tag4]);
            }));

            it('should not display more existing tags after scrolling if pagination has not more items', fakeAsync(() => {
                const tag1 = 'Tag 1';
                const tag2 = 'Tag 2';

                spyOn(tagService, 'searchTags').and.returnValues(
                    of({
                        list: {
                            entries: [
                                { entry: { tag: tag1 } as any },
                                { entry: { tag: tag2 } as any },
                            ],
                            pagination: {
                                hasMoreItems: false
                            },
                        },
                    })
                );

                typeTag('Tag');
                scrollTagList();

                const tagElements = getExistingTags();
                expect(tagElements).toEqual([tag1, tag2]);
            }));

            it('should exact tag be still above others existing tags after loading more existing tags after scrolling', fakeAsync(() => {
                const tag = 'Tag';
                spyOn(tagService, 'findTagByName').and.returnValue(of({
                    entry: {
                        tag,
                        id: 'tag-1'
                    }
                }));

                const tag1 = 'Tag 1';
                const tag2 = 'Tag 2';
                const tag3 = 'Tag 3';
                const tag4 = 'Tag 4';

                spyOn(tagService, 'searchTags').and.returnValues(
                    of({
                        list: {
                            entries: [
                                {  entry: { tag: tag1 } as any },
                                { entry: { tag: tag2 } as any },
                            ],
                            pagination: {
                                hasMoreItems: true,
                            },
                        },
                    }),
                    of({
                        list: {
                            entries: [
                                {
                                    entry: { tag: tag3 } as any,
                                },
                                {
                                    entry: { tag: tag4 } as any,
                                },
                            ],
                            pagination: {}
                        },
                    })
                );

                typeTag(tag);
                scrollTagList();

                const tagElements = getExistingTags();
                expect(tagElements).toEqual([tag, tag1, tag2, tag3, tag4]);
            }));
        });

        describe('Spinner', () => {
            function getSpinner(): DebugElement {
                return fixture.debugElement.query(By.css(`.mat-progress-spinner`));
            }

            it('should be displayed when existing tags are loading', fakeAsync(() => {
                typeTag('tag', 0);

                const spinner = getSpinner();
                expect(spinner).toBeTruthy();

                discardPeriodicTasks();
                flush();
            }));

            it('should not be displayed when existing tags stopped loading', fakeAsync(() => {
                typeTag('tag');

                const spinner = getSpinner();
                expect(spinner).toBeFalsy();
            }));

            it('should have correct diameter', fakeAsync(() => {
                typeTag('tag', 0);

                const spinner = getSpinner();
                expect(spinner.componentInstance.diameter).toBe(50);

                discardPeriodicTasks();
                flush();
            }));

            it('should be displayed when existing tags are loading after scrolling if pagination has more items', fakeAsync(() => {
                spyOn(tagService, 'searchTags').and.returnValues(
                    of({
                        list: {
                            entries: [
                                {
                                    entry: { tag: 'Tag 1' } as any,
                                },
                            ],
                            pagination: {
                                hasMoreItems: true,
                            },
                        },
                    }),
                    new Subject()
                );
                typeTag('Tag');
                scrollTagList();

                const spinner = getSpinner();
                expect(spinner).toBeTruthy();
            }));

            it('should not be displayed when existing tags are loaded after scrolling', fakeAsync(() => {
                spyOn(tagService,'searchTags').and.returnValues(
                    of({
                        list: {
                            entries: [
                                { entry: { tag: 'Tag 1' } as any },
                            ],
                            pagination: {
                                hasMoreItems: true,
                            },
                        },
                    }),
                    of({
                        list: {
                            entries: [
                                { entry: { name: 'Tag 1' } as any },
                            ],
                        },
                    } as any)
                );
                typeTag('Tag');
                scrollTagList();

                const spinner = getSpinner();
                expect(spinner).toBeFalsy();
            }));

            it('should not be displayed when existing tags are loading after scrolling if pagination has not more items', fakeAsync(() => {
                spyOn(tagService, 'searchTags').and.returnValues(
                    of({
                        list: {
                            entries: [
                                { entry: { tag: 'Tag 1' } as any },
                            ],
                            pagination: {
                                hasMoreItems: false,
                            },
                        },
                    }),
                    new Subject()
                );
                typeTag('Tag');
                scrollTagList();

                const spinner = getSpinner();
                expect(spinner).toBeFalsy();
            }));

            it('should have correct diameter when loading after scrolling', fakeAsync(() => {
                spyOn(tagService, 'searchTags').and.returnValues(
                    of({
                        list: {
                            entries: [
                                { entry: { tag: 'Tag 1' } as any},
                            ],
                            pagination: {
                                hasMoreItems: true,
                            },
                        },
                    }),
                    new Subject()
                );
                typeTag('Tag');
                scrollTagList();

                const spinner = getSpinner();
                expect(spinner.componentInstance.diameter).toBe(20);
            }));
        });
    });

    describe('Action buttons', () => {
        describe('Close button', () => {
            let closeButton: HTMLButtonElement;

            beforeEach(() => {
                closeButton = fixture.debugElement.query(By.css(`[data-automation-id="tags-dialog-cancel-button"]`)).nativeElement;
            });

            it('should first button have correct label', () => {
                expect(closeButton.textContent.trim()).toBe('CONTENT_STRUCTURING.CANCEL');
            });
        });

        describe('Save button', () => {
            let saveButton: HTMLButtonElement;

            beforeEach(() => {
                saveButton = fixture.debugElement.query(By.css(`[data-automation-id="tags-dialog-save-button"]`)).nativeElement;
            });

            it('should have correct label', () => {
                expect(saveButton.textContent.trim()).toBe('CONTENT_STRUCTURING.SAVE');
            });

            it('should be disabled initially', () => {
                expect(saveButton.disabled).toBeTruthy();
            });

            it('should hide input after click', fakeAsync(() => {
                addTagToAddedList('some tag');
                clickAtAddTagButton();
                saveButton.click();
                tick(300);
                fixture.detectChanges();

                expect(getNameInput()).toBeFalsy();
            }));

            it('should hide remove buttons for created tags list', fakeAsync(() => {
                const tag1 = 'Tag 1';
                const tag2 = 'Tag 2';

                addTagToAddedList(tag1);
                addTagToAddedList(tag2);

                spyOn(tagService, 'createTags').and.returnValue(new Subject());

                saveButton.click();
                fixture.detectChanges();

                const removeButtons = getRemoveTagButtons();
                expect(removeButtons[0].hasAttribute('hidden')).toBeTruthy();
                expect(removeButtons[1].hasAttribute('hidden')).toBeTruthy();
            }));

            it('should call createTags on tagService', fakeAsync(() => {
                const tagName = 'some tag';
                addTagToAddedList(tagName);
                spyOn(tagService, 'createTags').and.returnValue(new Subject());
                saveButton.click();

                expect(tagService.createTags).toHaveBeenCalledWith([jasmine.objectContaining({ tag: tagName })]);
            }));

            it('should close dialog after creating tags successfully', fakeAsync(() => {
                const tagName = 'some tag';
                addTagToAddedList(tagName);
                spyOn(dialog, 'close');

                const createTags$ = new Subject<TagEntry[]>();
                spyOn(tagService, 'createTags').and.returnValue(createTags$);

                saveButton.click();
                createTags$.next([]);
                expect(dialog.close).toHaveBeenCalledWith(true);
            }));

            it('should call showInfo on NotificationService after creating tags successfully', fakeAsync(() => {
                const tagName = 'some tag';
                addTagToAddedList(tagName);
                spyOn(notificationService, 'showInfo');

                const createTags$ = new Subject<TagEntry[]>();
                spyOn(tagService, 'createTags').and.returnValue(createTags$);

                saveButton.click();
                createTags$.next([]);
                expect(notificationService.showInfo).toHaveBeenCalledWith('CONTENT_STRUCTURING.TAGS.TAGS_DIALOG.CREATE_TAGS_SUCCESS');
            }));

            it('should be disabled after clicking', fakeAsync(() => {
                addTagToAddedList('some tag');
                spyOn(tagService, 'createTags').and.returnValue(new Subject());

                saveButton.click();
                fixture.detectChanges();

                expect(saveButton.disabled).toBeTruthy();
            }));
        });
    });
});
