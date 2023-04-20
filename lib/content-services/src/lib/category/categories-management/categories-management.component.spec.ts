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

import { Category, CategoryPaging, ResultNode, ResultSetPaging } from '@alfresco/js-api';
import { DebugElement } from '@angular/core';
import { ComponentFixture, discardPeriodicTasks, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { Validators } from '@angular/forms';
import { MatError } from '@angular/material/form-field';
import { MatListOption, MatSelectionList } from '@angular/material/list';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { of, Subject } from 'rxjs';
import { ContentTestingModule } from '../../testing/content.testing.module';
import { CategoriesManagementMode } from './categories-management-mode';
import { CategoryService } from '../services/category.service';
import { CategoriesManagementComponent } from './categories-management.component';

describe('CategoriesManagementComponent', () => {
    let component: CategoriesManagementComponent;
    let fixture: ComponentFixture<CategoriesManagementComponent>;
    let categoryService: CategoryService;
    const classifiableChangedSubject = new Subject<void>();
    const category1 = new Category({ id: 'test', name: 'testCat' });
    const category2 = new Category({ id: 'test2', name: 'testCat2' });
    const category3 = new Category({ id: 'test3', name: 'testCat3' });
    const category4 = new Category({ id: 'test4', name: 'testCat4' });
    const resultCat1 = new ResultNode({ id: 'test', name: 'testCat', path: { name: 'general/categories' }});
    const resultCat2 = new ResultNode({ id: 'test2', name: 'testCat2', path: { name: 'general/categories' }});
    const categoryPagingResponse: CategoryPaging = { list: { pagination: {}, entries: [ { entry: category1 }, { entry: category2 }]}};
    const categorySearchResponse: ResultSetPaging = { list: { pagination: {}, entries: [ { entry: resultCat1 }, { entry: resultCat2 }]}};

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [CategoriesManagementComponent],
            imports: [
                TranslateModule.forRoot(),
                ContentTestingModule
            ],
            providers: [
                {
                    provide: CategoryService,
                    useValue: {
                        getSubcategories: () => of(categoryPagingResponse),
                        searchCategories: () => of(categorySearchResponse)
                    }
                }
            ],
            teardown: { destroyAfterEach: true }
        });

        fixture = TestBed.createComponent(CategoriesManagementComponent);
        component = fixture.componentInstance;
        categoryService = TestBed.inject(CategoryService);
    });

    function getNoCategoriesMessage(): string {
        return fixture.debugElement.query(By.css(`.adf-no-categories-message`))?.nativeElement.textContent.trim();
    }

    function getAssignedCategoriesList(): HTMLSpanElement[] {
        return fixture.debugElement.queryAll(By.css('.adf-assigned-categories'))?.map((debugElem) => debugElem.nativeElement);
    }

    function getExistingCategoriesList(): MatListOption[] {
        return fixture.debugElement.queryAll(By.directive(MatListOption))?.map((debugElem) => debugElem.componentInstance);
    }

    function createCategory(name: string, addUsingEnter?: boolean, typingTimeout = 300): void {
        typeCategory(name, typingTimeout);

        if (addUsingEnter) {
            getCategoryControlInput().dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter' }));
        } else {
            getCreateCategoryLabel().click();
        }

        tick(300);
        fixture.detectChanges();
    }

    function getFirstError(): string {
        return fixture.debugElement.query(By.directive(MatError)).nativeElement.textContent;
    }

    function getSelectionList(): MatSelectionList {
        return fixture.debugElement.query(By.directive(MatSelectionList)).componentInstance;
    }

    function getRemoveCategoryButtons(): HTMLButtonElement[] {
        return fixture.debugElement.queryAll(By.css(`[data-automation-id="categories-remove-category-button"]`)).map((debugElem) => debugElem.nativeElement);
    }

    function getCategoryControlInput(): HTMLInputElement {
        return fixture.debugElement.query(By.css('.adf-category-name-field input'))?.nativeElement;
    }

    function getCreateCategoryLabel(): HTMLSpanElement {
        return fixture.debugElement.query(By.css('.adf-existing-categories-panel span'))?.nativeElement;
    }

    function typeCategory(name: string, timeout = 300): void {
        component.categoryNameControlVisible = true;
        fixture.detectChanges();

        const categoryControlInput = getCategoryControlInput();
        categoryControlInput.value = name;
        categoryControlInput.dispatchEvent(new InputEvent('input'));

        tick(timeout);
        fixture.detectChanges();
    }

    describe('Shared tests', () => {
        beforeEach(() => {
            component.managementMode = CategoriesManagementMode.CRUD;
            component.categories = [category3, category4];
            fixture.detectChanges();
        });

        describe('Assigned categories list', () => {
            it('should display all categories assigned/created', () => {
                const assignedCategories = getAssignedCategoriesList();
                expect(assignedCategories.length).toBe(2);
                expect(assignedCategories[0].textContent.trim()).toContain(category3.name);
                expect(assignedCategories[1].textContent.trim()).toContain(category4.name);
            });

            it('should unassign/remove specific category after clicking at remove icon and emit categories change', () => {
                const removeBtns = getRemoveCategoryButtons();
                const categoriesChangeSpy = spyOn(component.categoriesChange, 'emit');
                removeBtns[0].click();

                fixture.detectChanges();

                const assignedCategories = getAssignedCategoriesList();
                expect(component.categories.length).toBe(1);
                expect(assignedCategories.length).toBe(1);
                expect(assignedCategories[0].textContent.trim()).toContain(category4.name);
                expect(categoriesChangeSpy).toHaveBeenCalledWith(component.categories);
            });

            it('should disable unassigning/removing categories when disableRemoval is set', () => {
                component.disableRemoval = true;
                fixture.detectChanges();
                const removeBtns = getRemoveCategoryButtons();
                const allBtnsDisabled = removeBtns.every((removeBtn) => removeBtn.disabled);
                expect(allBtnsDisabled).toBeTrue();
            });
        });

        describe('Category name control', () => {
            beforeEach(() => {
                component.categoryNameControlVisible = true;
                fixture.detectChanges();
            });
            it('should be hidden initially', () => {
                component.categoryNameControlVisible = false;
                fixture.detectChanges();
                const categoryControl: HTMLDivElement = fixture.debugElement.query(By.css('.adf-category-name-field')).nativeElement;
                expect(categoryControl.hidden).toBeTrue();
            });

            it('should be visible when categoryNameControlVisible is true', () => {
                const categoryControl = fixture.debugElement.query(By.css('.adf-category-name-field'));
                expect(categoryControl).toBeTruthy();
            });

            it('should have correct label and hide button', () => {
                const categoryControlLabel = fixture.debugElement.query(By.css('#adf-category-name-input-label')).nativeElement;
                const categoryControlHideBtn: HTMLButtonElement = fixture.debugElement.query(By.css('.adf-category-name-field button')).nativeElement;
                expect(categoryControlHideBtn).toBeTruthy();
                expect(categoryControlHideBtn.attributes.getNamedItem('title').textContent.trim()).toBe('CATEGORIES_MANAGEMENT.HIDE_INPUT');
                expect(categoryControlLabel.textContent.trim()).toBe('CATEGORIES_MANAGEMENT.NAME');
            });

            it('should hide category control and existing categories panel on clicking hide button', () => {
                const categoryControlHideBtn: HTMLButtonElement = fixture.debugElement.query(By.css('.adf-category-name-field button')).nativeElement;
                const controlVisibilityChangeSpy = spyOn(component.categoryNameControlVisibleChange, 'emit').and.callThrough();
                categoryControlHideBtn.click();
                fixture.detectChanges();

                const categoryControl: HTMLDivElement = fixture.debugElement.query(By.css('.adf-category-name-field')).nativeElement;
                expect(categoryControl.hidden).toBeTrue();
                expect(component.categoryNameControlVisible).toBeFalse();
                expect(component.existingCategoriesPanelVisible).toBeFalse();
                expect(controlVisibilityChangeSpy).toHaveBeenCalledOnceWith(false);
            });
        });

        describe('Spinner', () => {
            function getSpinner(): DebugElement {
                return fixture.debugElement.query(By.css(`.mat-progress-spinner`));
            }

            it('should be displayed with correct diameter when existing categories are loading', fakeAsync(() => {
                typeCategory('Category 1', 0);

                const spinner = getSpinner();
                expect(spinner).toBeTruthy();
                expect(spinner.componentInstance.diameter).toBe(50);

                discardPeriodicTasks();
                flush();
            }));

            it('should not be displayed when existing categories stopped loading', fakeAsync(() => {
                typeCategory('Category 1');

                const spinner = getSpinner();
                expect(spinner).toBeFalsy();
            }));
        });

        it('should display correct message when there are no existing categories', fakeAsync(() => {
            spyOn(categoryService, 'getSubcategories').and.returnValue(of({list: { pagination: {}, entries: []}}));
            typeCategory('test');

            const noExistingCategoriesMsg = fixture.debugElement.query(By.css('mat-selection-list p'))?.nativeElement.textContent.trim();
            expect(noExistingCategoriesMsg).toBe('CATEGORIES_MANAGEMENT.NO_EXISTING_CATEGORIES');
        }));
    });

    describe('Assign mode', () => {
        beforeEach(() => {
            component.managementMode = CategoriesManagementMode.ASSIGN;
            component.categories = [category3, category4];
            component.classifiableChanged = classifiableChangedSubject.asObservable();
            fixture.detectChanges();
        });

        it('should return false for is CRUD mode check', () => {
            expect(component.isCRUDMode).toBeFalse();
        });

        it('should display correct no categories message', () => {
            component.categories = [];
            fixture.detectChanges();
            expect(getNoCategoriesMessage()).toBe('CATEGORIES_MANAGEMENT.NO_CATEGORIES_ASSIGNED');
        });

        it('should store initially assigned categories', () => {
            expect(component.initialCategories.length).toBe(2);
        });

        it('should pad assigned categories', () => {
            const assignedCategories = getAssignedCategoriesList();
            const allCategoriesPadded = assignedCategories.every((categoryElem) => categoryElem.classList.contains('adf-categories-padded'));
            expect(allCategoriesPadded).toBeTrue();
        });

        it('should have correct remove category title', () => {
            const removeBtns = getRemoveCategoryButtons();
            const isTitleCorrect = removeBtns.every((removeBtn) => removeBtn.attributes.getNamedItem('title').textContent === 'CATEGORIES_MANAGEMENT.UNASSIGN_CATEGORY');
            expect(isTitleCorrect).toBeTrue();
        });

        it('should have no required validator set for category control', () => {
            expect(component.categoryNameControl.hasValidator(Validators.required)).toBeFalse();
        });

        it('should display validation error when searching for empty category', fakeAsync(() => {
            typeCategory('   ');

            expect(getFirstError()).toBe('CATEGORIES_MANAGEMENT.ERRORS.EMPTY_CATEGORY');
        }));

        it('should clear categories and hide category control when classifiable aspect is removed', () => {
            const controlVisibilityChangeSpy = spyOn(component.categoryNameControlVisibleChange, 'emit').and.callThrough();
            classifiableChangedSubject.next();
            fixture.detectChanges();

            expect(controlVisibilityChangeSpy).toHaveBeenCalledOnceWith(false);
            expect(component.categoryNameControlVisible).toBeFalse();
            expect(component.categories).toEqual([]);
        });

        it('should not display create category label', fakeAsync(() => {
            typeCategory('test');

            expect(getCreateCategoryLabel()).toBeUndefined();
        }));

        it('should not disable existing categories', fakeAsync(() => {
            typeCategory('test');

            expect(getSelectionList().disabled).toBeFalse();
        }));

        it('should add selected category to categories list and remove from existing categories', fakeAsync(() => {
            const categoriesChangeSpy = spyOn(component.categoriesChange, 'emit').and.callThrough();
            typeCategory('test');
            const options = getExistingCategoriesList();
            // eslint-disable-next-line no-underscore-dangle
            options[0]._handleClick();

            expect(component.categories.length).toBe(3);
            expect(component.categories[2].name).toBe('testCat');
            expect(component.existingCategories.length).toBe(1);
            expect(categoriesChangeSpy).toHaveBeenCalledOnceWith(component.categories);
            discardPeriodicTasks();
            flush();
        }));

        it('should remove selected category from categories list and add it back to existing categories', fakeAsync(() => {
            typeCategory('test');
            const options = getExistingCategoriesList();
            // eslint-disable-next-line no-underscore-dangle
            options[0]._handleClick();
            fixture.detectChanges();

            const categoriesChangeSpy = spyOn(component.categoriesChange, 'emit').and.callThrough();
            const removeCategoryBtns = getRemoveCategoryButtons();
            removeCategoryBtns[2].click();
            fixture.detectChanges();

            expect(component.categories.length).toBe(2);
            expect(component.categories[1].name).toBe('testCat4');
            expect(categoriesChangeSpy).toHaveBeenCalledOnceWith(component.categories);
            expect(component.existingCategories.length).toBe(2);
            discardPeriodicTasks();
            flush();
        }));

        it('should not add back to existing categories when category was assigned initially', fakeAsync(() => {
            typeCategory('test');
            expect(component.existingCategories.length).toBe(2);
            const categoriesChangeSpy = spyOn(component.categoriesChange, 'emit').and.callThrough();
            const removeCategoryBtns = getRemoveCategoryButtons();
            removeCategoryBtns[0].click();
            fixture.detectChanges();

            expect(component.categories.length).toBe(1);
            expect(component.categories[0].name).toBe('testCat4');
            expect(categoriesChangeSpy).toHaveBeenCalledOnceWith(component.categories);
            expect(component.existingCategories.length).toBe(2);
            discardPeriodicTasks();
            flush();
        }));
    });

    describe('CRUD mode', () => {
        beforeEach(() => {
            component.managementMode = CategoriesManagementMode.CRUD;
            component.categories = [category3, category4];
            fixture.detectChanges();
        });
        it('should return true for is CRUD mode check', () => {
            expect(component.isCRUDMode).toBeTrue();
        });

        it('should display correct no categories message', () => {
            component.categories = [];
            fixture.detectChanges();
            expect(getNoCategoriesMessage()).toBe('CATEGORIES_MANAGEMENT.NO_CATEGORIES_CREATED');
        });

        it('should have correct remove category title', () => {
            const removeBtns = getRemoveCategoryButtons();
            const isTitleCorrect = removeBtns.every((removeBtn) => removeBtn.attributes.getNamedItem('title').textContent === 'CATEGORIES_MANAGEMENT.DELETE_CATEGORY');
            expect(isTitleCorrect).toBeTrue();
        });

        it('should display create category label', fakeAsync(() => {
            typeCategory('test');

            expect(getCreateCategoryLabel().textContent.trim()).toBe('CATEGORIES_MANAGEMENT.GENERIC_CREATE');
        }));

        it('should hide create category label when typing', fakeAsync(() => {
            typeCategory('test', 0);

            expect(getCreateCategoryLabel()).toBeUndefined();
            discardPeriodicTasks();
            flush();
        }));

        it('should disable existing categories', fakeAsync(() => {
            typeCategory('test');

            expect(getSelectionList().disabled).toBeTrue();
        }));

        it('should be able to add typed category when create label is clicked', fakeAsync(() => {
            const categoriesChangeSpy = spyOn(component.categoriesChange, 'emit');
            createCategory('test');

            expect(component.categories.length).toBe(3);
            expect(component.categories[2].name).toBe('test');
            expect(categoriesChangeSpy).toHaveBeenCalledOnceWith(component.categories);
        }));

        it('should be able to add typed category when enter is hit', fakeAsync(() => {
            const categoriesChangeSpy = spyOn(component.categoriesChange, 'emit');
            createCategory('test', true);

            expect(component.categories.length).toBe(3);
            expect(component.categories[2].name).toBe('test');
            expect(categoriesChangeSpy).toHaveBeenCalledOnceWith(component.categories);
        }));

        it('should clear and hide input after category is created', fakeAsync(() => {
            const controlVisibilityChangeSpy = spyOn(component.categoryNameControlVisibleChange, 'emit');
            createCategory('test');
            const categoryControl: HTMLDivElement = fixture.debugElement.query(By.css('.adf-category-name-field')).nativeElement;

            expect(categoryControl.hidden).toBeTrue();
            expect(controlVisibilityChangeSpy).toHaveBeenCalledOnceWith(false);
            expect(getExistingCategoriesList()).toEqual([]);
            expect(component.categoryNameControl.value).toBe('');
            expect(component.categoryNameControl.untouched).toBeTrue();
        }));

        it('should be able to remove added category', fakeAsync(() => {
            createCategory('test');

            const categoriesChangeSpy = spyOn(component.categoriesChange, 'emit');
            const removeCategoryBtns = getRemoveCategoryButtons();
            removeCategoryBtns[2].click();
            fixture.detectChanges();

            expect(component.categories.length).toBe(2);
            expect(component.categories[1].name).toBe('testCat4');
            expect(categoriesChangeSpy).toHaveBeenCalledOnceWith(component.categories);
        }));

        describe('Errors', () => {
            it('should display validation error when searching for empty category', fakeAsync(() => {
                typeCategory('   ');

                expect(getFirstError()).toBe('CATEGORIES_MANAGEMENT.ERRORS.EMPTY_CATEGORY');
            }));

            it('should show error for required', fakeAsync(() => {
                typeCategory('');

                expect(getFirstError()).toBe('CATEGORIES_MANAGEMENT.ERRORS.REQUIRED');
            }));

            it('should show error when duplicated already added category', fakeAsync(() => {
                const category = 'new Cat';

                createCategory(category);
                typeCategory(category);

                expect(getFirstError()).toBe('CATEGORIES_MANAGEMENT.ERRORS.DUPLICATED_CATEGORY');
            }));

            it('should show error when duplicated already existing category', fakeAsync(() => {
                const category = 'testCat2';

                typeCategory(category);

                expect(getFirstError()).toBe('CATEGORIES_MANAGEMENT.ERRORS.ALREADY_EXISTS');
            }));

            it('should show error for required when not typed anything and blur input', fakeAsync(() => {
                typeCategory('');
                getCategoryControlInput().blur();
                fixture.detectChanges();

                expect(getFirstError()).toBe('CATEGORIES_MANAGEMENT.ERRORS.REQUIRED');

                flush();
            }));

            it('should not display create category label when control has error', fakeAsync(() => {
                typeCategory('   ');

                expect(getCreateCategoryLabel().hidden).toBeTrue();
            }));
        });
    });
});
