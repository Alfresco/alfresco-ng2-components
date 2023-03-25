/*
 * Copyright © 2005 - 2021 Alfresco Software, Ltd. All rights reserved.
 *
 * License rights for this program may be obtained from Alfresco Software, Ltd.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { ComponentFixture, discardPeriodicTasks, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { TagsCreatorComponent } from './tags-creator.component';
import { NotificationService } from '@alfresco/adf-core';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatError, MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { ContentDirectiveModule, TagService } from '@alfresco/adf-content-services';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EMPTY, of } from 'rxjs';
import { DebugElement } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatListModule } from '@angular/material/list';

describe('TagsCreatorComponent', () => {
    let fixture: ComponentFixture<TagsCreatorComponent>;
    let component: TagsCreatorComponent;
    let tagService: TagService;

    const tagNameFieldSelector = '.adf-tag-name-field';

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [TagsCreatorComponent],
            imports: [
                ContentDirectiveModule,
                MatButtonModule,
                MatFormFieldModule,
                MatIconModule,
                MatInputModule,
                MatProgressSpinnerModule,
                MatListModule,
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
                    },
                },
                {
                    provide: NotificationService,
                    useValue: {
                        showError: () => ({})
                    },
                },
            ],
        });

        fixture = TestBed.createComponent(TagsCreatorComponent);
        component = fixture.componentInstance;
        tagService = TestBed.inject(TagService);

        fixture.detectChanges();
    });

    function getNameInput(): HTMLInputElement {
        return fixture.debugElement.query(By.css(`.adf-tag-name-field input`))?.nativeElement;
    }

    function getCreateTagLabel(): HTMLSpanElement {
        return fixture.debugElement.query(By.css('.adf-create-tag-label'))?.nativeElement;
    }

    function getRemoveTagButtons(): HTMLButtonElement[] {
        const elements = fixture.debugElement.queryAll(By.css(`[data-automation-id="remove-tag-button"]`));
        return elements.map(el => el.nativeElement);
    }

    function clickAtHideNameInputButton() {
        fixture.debugElement.query(By.css(`[data-automation-id="hide-tag-name-input-button"]`)).nativeElement.click();
        fixture.detectChanges();
    }

    function getAddedTags(): string[] {
        const tagElements = fixture.debugElement.queryAll(By.css(`.adf-tags-creation .adf-tag`));
        return tagElements.map(el => el.nativeElement.firstChild.nodeValue.trim());
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
        component.tagNameControlVisible = true;
        fixture.detectChanges();

        const tagNameInput = getNameInput();
        tagNameInput.value = tagName;
        tagNameInput.dispatchEvent(new InputEvent('input'));

        tick(timeout);
        fixture.detectChanges();
    }

    describe('Created tags list', () => {
        it('should display no tags created message after initialization', () => {
            const message =  fixture.debugElement.query(By.css('.adf-no-tags-message')).nativeElement.textContent.trim();
            expect(message).toBe('TAG.TAGS_CREATOR.NO_TAGS_CREATED');
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

    describe('Tag name field', () => {
        it('should be visible if tagNameControlVisible is true', () => {
            component.tagNameControlVisible = true;
            fixture.detectChanges();

            const tagNameField = fixture.debugElement.query(By.css(tagNameFieldSelector));
            expect(tagNameField).toBeTruthy();
            expect(tagNameField.nativeElement.hasAttribute('hidden')).toBeFalsy();
            expect(tagNameField.query(By.directive(MatFormField))).toBeTruthy();
        });

        it('should be hidden after clicking button for hiding input', fakeAsync(() => {
            component.tagNameControlVisible = true;
            fixture.detectChanges();
            tick(100);

            clickAtHideNameInputButton();

            const tagNameField = fixture.debugElement.query(By.css(tagNameFieldSelector));
            expect(tagNameField).toBeFalsy();
        }));

        it('should input be autofocused', fakeAsync(() => {
            component.tagNameControlVisible = true;
            fixture.detectChanges();
            tick(100);
            expect(getNameInput()).toBe(document.activeElement as HTMLInputElement);
        }));

        it('should input be autofocused after showing input second time', fakeAsync(() => {
            component.tagNameControlVisible = true;
            fixture.detectChanges();
            tick(100);

            clickAtHideNameInputButton();
            component.tagNameControlVisible = true;
            fixture.detectChanges();
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
                expect(error).toBe('TAG.TAGS_CREATOR.ERRORS.EMPTY_TAG');
            }));

            it('should show error for required', fakeAsync(() => {
                typeTag('');
                const error = getFirstError();
                expect(error).toBe('TAG.TAGS_CREATOR.ERRORS.REQUIRED');
            }));

            it('should show error when duplicated already added tag', fakeAsync(() => {
                const tag = 'Some tag';

                addTagToAddedList(tag);
                typeTag(tag);

                const error = getFirstError();
                expect(error).toBe('TAG.TAGS_CREATOR.ERRORS.ALREADY_ADDED_TAG');
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
                expect(error).toBe('TAG.TAGS_CREATOR.ERRORS.EXISTING_TAG');
            }));

            it('should error for required when not typed anything and blur input', fakeAsync(() => {
                component.tagNameControlVisible = true;
                fixture.detectChanges();
                tick(100);

                getNameInput().blur();
                fixture.detectChanges();

                const error = getFirstError();
                expect(error).toBe('TAG.TAGS_CREATOR.ERRORS.REQUIRED');

                flush();
            }));
        });
    });

    describe('Existing tags panel', () => {
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

        it('should not be visible when input is visible and empty string is typed in input', fakeAsync(() => {
            typeTag('   ');

            expect(getPanel()).toBeFalsy();
        }));

        it('should not be visible when input is visible and nothing has been typed', () => {
            component.tagNameControlVisible = true;
            fixture.detectChanges();

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
                component.tagNameControlVisible = true;
                fixture.detectChanges();
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
                const tagElements = fixture.debugElement.queryAll(By.css(`.adf-existing-tags-panel .adf-tag .mat-list-text`));
                return tagElements.map(el => el.nativeElement.firstChild.nodeValue.trim());
            }

            it('should call findTagByName on tagService using name set in input', fakeAsync(() => {
                spyOn(tagService, 'findTagByName').and.returnValue(EMPTY);

                const name = 'Tag';
                typeTag(name);

                expect(tagService.findTagByName).toHaveBeenCalledWith(name);
            }));

            it('should call searchTags on tagService using name set in input and correct params', fakeAsync(() => {
                spyOn(tagService, 'searchTags').and.returnValue(EMPTY);

                const name = 'Tag';
                typeTag(name);

                expect(tagService.searchTags).toHaveBeenCalledWith(name, { orderBy: 'tag', direction: 'asc' },
                    false, 0, 15 );
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
        });
    });
});
