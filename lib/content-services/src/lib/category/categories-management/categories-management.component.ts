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

import { Category } from '@alfresco/js-api';
import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSelectionListChange } from '@angular/material/list';
import { EMPTY, Observable, Subject, timer } from 'rxjs';
import { debounce, first, map, takeUntil, tap } from 'rxjs/operators';
import { CategoriesManagementMode } from './categories-management-mode';
import { CategoryService } from '../services/category.service';

interface CategoryNameControlErrors {
    duplicatedExistingCategory?: boolean;
    duplicatedCategory?: boolean;
    emptyCategory?: boolean;
    required?: boolean;
}

@Component({
  selector: 'adf-categories-management',
  templateUrl: './categories-management.component.html',
  styleUrls: ['./categories-management.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CategoriesManagementComponent implements OnInit, OnDestroy {
    readonly nameErrorMessagesByErrors = new Map<keyof CategoryNameControlErrors, string>([
        ['duplicatedExistingCategory', 'ALREADY_EXISTS'],
        ['duplicatedCategory', 'DUPLICATED_CATEGORY'],
        ['emptyCategory', 'EMPTY_CATEGORY'],
        ['required', 'REQUIRED']
    ]);

    private existingCategoryLoaded$ = new Subject<void>();
    private cancelExistingCategoriesLoading$ = new Subject<void>();
    private onDestroy$ = new Subject<void>();
    private _categoryNameControl = new FormControl<string>(
        '',
        [
            this.validateIfNotAlreadyAdded.bind(this),
            this.validateEmptyCategory,
            Validators.required
        ],
        this.validateIfNotAlreadyCreated.bind(this)
    );
    private _existingCategories: Category[];
    private _categoryNameErrorMessageKey = '';
    private _existingCategoriesLoading = false;
    private _typing = false;
    private _existingCategoriesPanelVisible: boolean;
    private _categoryNameControlVisible = false;
    private readonly existingCategoriesListLimit = 15;
    initialCategories: Category[] = [];
    noCategoriesMsg = '';
    removeCategoryTitle = '';
    existingCategoriesMsg = '';

    /** Categories to display initially */
    @Input()
    categories: Category[] = [];

    /**
     * Decides if categoryNameControl should be visible. Sets also existing categories panel visibility
     * and scrolls control into view when visible.
     *
     * @param categoryNameControlVisible control visibility.
     */
     @Input()
     set categoryNameControlVisible(categoryNameControlVisible: boolean) {
         this._categoryNameControlVisible = categoryNameControlVisible;
         if (categoryNameControlVisible) {
             setTimeout(() => {
                 this.categoryNameInputElement.nativeElement.scrollIntoView();
             });
             this._existingCategoriesPanelVisible = true;
         } else {
            this._existingCategoriesPanelVisible = false;
         }
     }

     get categoryNameControlVisible(): boolean {
         return this._categoryNameControlVisible;
     }

    /** Emits when classifiable aspect changes */
    @Input()
    classifiableChanged: Observable<void>;

    /** Disables remove button in upper categories list */
    @Input()
    disableRemoval = false;

    /**
     * Component mode.
     * In ASSIGN mode we can only assign/unassign categories from existing list.
     * In CRUD mode we can create categories.
     */
    @Input()
    managementMode: CategoriesManagementMode;

    /** ID of a parent category. New categories will be created under this parent */
    @Input()
    parentId: string;

    /** Emits when state of upper categories list changes */
    @Output()
    categoriesChange = new EventEmitter<Category[]>();

    /** Emits when categoryNameControl visibility changes */
    @Output()
    categoryNameControlVisibleChange = new EventEmitter<boolean>();

    @ViewChild('categoryNameInput')
    private categoryNameInputElement: ElementRef;

    constructor(private categoryService: CategoryService) {}

    ngOnInit() {
        this.categoryNameControl.valueChanges
            .pipe(
                map((name: string) => name.trim()),
                tap((name: string) => {
                    this._typing = true;
                    if (name) {
                        this._existingCategoriesLoading = true;
                        this._existingCategoriesPanelVisible = true;
                    }
                    this.cancelExistingCategoriesLoading$.next();
                }),
                debounce((name: string) => (name ? timer(300) : EMPTY)),
                takeUntil(this.onDestroy$)
            )
            .subscribe((name: string) => this.onNameControlValueChange(name));

        this.categoryNameControl.statusChanges
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(() => this.setCategoryNameControlErrorMessageKey());

        this.setCategoryNameControlErrorMessageKey();

        this.noCategoriesMsg = this.isCRUDMode ? 'CATEGORIES_MANAGEMENT.NO_CATEGORIES_CREATED' : 'CATEGORIES_MANAGEMENT.NO_CATEGORIES_ASSIGNED';
        this.removeCategoryTitle = this.isCRUDMode ? 'CATEGORIES_MANAGEMENT.DELETE_CATEGORY' : 'CATEGORIES_MANAGEMENT.UNASSIGN_CATEGORY';
        this.existingCategoriesMsg = this.isCRUDMode ? 'CATEGORIES_MANAGEMENT.EXISTING_CATEGORIES' : 'CATEGORIES_MANAGEMENT.SELECT_EXISTING_CATEGORY';

        if (!this.isCRUDMode) {
            this._categoryNameControl.removeValidators(Validators.required);
            this.categories.forEach((category) => this.initialCategories.push(category));
            this.classifiableChanged
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(() => {
                this.categories = [];
                this.categoryNameControlVisible = false;
                this.categoryNameControlVisibleChange.emit(false);
            });
        }
    }

    ngOnDestroy() {
        this.onDestroy$.next();
        this.onDestroy$.complete();
        this.cancelExistingCategoriesLoading$.next();
        this.cancelExistingCategoriesLoading$.complete();
    }

    get categoryNameControl(): FormControl<string> {
        return this._categoryNameControl;
    }

    get existingCategories(): Category[] {
        return this._existingCategories;
    }

    get categoryNameErrorMessageKey(): string {
        return this._categoryNameErrorMessageKey;
    }

    get existingCategoriesLoading(): boolean {
        return this._existingCategoriesLoading;
    }

    get typing(): boolean {
        return this._typing;
    }

    get existingCategoriesPanelVisible(): boolean {
        return this._existingCategoriesPanelVisible;
    }

    get isCRUDMode(): boolean {
        return this.managementMode === CategoriesManagementMode.CRUD;
    }

    /**
     * Hides and emits categoryNameControl and hides existing categories panel.
     */
    hideNameInput() {
        this.categoryNameControlVisible = false;
        this.categoryNameControlVisibleChange.emit(false);
        this._existingCategoriesPanelVisible = false;
    }

    /**
     * Adds category that has been typed to a categoryNameControl and hides it afterwards.
     */
    addCategory() {
        if (this.isCRUDMode && !this._typing && !this.categoryNameControl.invalid) {
            const newCatName = this.categoryNameControl.value.trim();
            const newCat = new Category({ id: newCatName, name: newCatName });
            this.categories.push(newCat);
            this.hideNameInput();
            this.categoryNameControl.setValue('');
            this.categoryNameControl.markAsUntouched();
            this._existingCategories = null;
            this.categoriesChange.emit(this.categories);
        }
    }

    /**
     * Adds existing category to categories list and removes it from existing categories list.
     *
     * @param change - selection list change containing selected category
     */
    addCategoryToAssign(change: MatSelectionListChange) {
        const selectedCategory: Category = change.options[0].value;
        this.categories.push(selectedCategory);
        this._existingCategories.splice(this._existingCategories.indexOf(selectedCategory), 1);
        this.categoryNameControl.updateValueAndValidity();
        this.categoriesChange.emit(this.categories);
    }

    /**
     * Removes the category from categories list and adds it to existing categories list in ASSIGN mode.
     *
     * @param category - category to remove
     */
    removeCategory(category: Category) {
        this.categories.splice(this.categories.indexOf(category), 1);
        if (!this.isCRUDMode && !!this._existingCategories && !this.initialCategories.some((cat) => cat.id === category.id)) {
            this._existingCategories.push(category);
            this.sortCategoriesList(this._existingCategories);
        }
        this.categoryNameControl.updateValueAndValidity({
            emitEvent: false
        });
        this.categoriesChange.emit(this.categories);
    }

    private onNameControlValueChange(name: string) {
        this.categoryNameControl.markAsTouched();
        if (name) {
            if (this.isCRUDMode) {
                this.getChildrenCategories(name);
            } else {
                this.searchForExistingCategories(name);
            }
        } else {
            this._existingCategories = null;
        }
    }

    private searchForExistingCategories(searchTerm: string) {
        this.categoryService.searchCategories(searchTerm, 0 , this.existingCategoriesListLimit).subscribe((existingCategoriesResult) => {
            this._existingCategories = existingCategoriesResult.list.entries.map((rowEntry) => {
                const existingCat = new Category();
                existingCat.id = rowEntry.entry.id;
                const path = rowEntry.entry.path.name.split('/').splice(3).join('/');
                existingCat.name = path ? `${path}/${rowEntry.entry.name}` : rowEntry.entry.name;
                return existingCat;
            });
            this._existingCategories = this._existingCategories.filter((existingCat) => this.categories.find((category) => existingCat.id === category.id) === undefined);
            this.sortCategoriesList(this._existingCategories);
            this._existingCategoriesLoading = false;
            this._typing = false;
            this.existingCategoryLoaded$.next();
        });
    }

    private getChildrenCategories(searchTerm: string) {
        this.categoryService.getSubcategories(this.parentId).subscribe((childrenCategories) => {
            this._existingCategories = childrenCategories.list.entries.map((categoryEntry) => categoryEntry.entry);
            this._existingCategories = this._existingCategories.filter((existingCat) => existingCat.name.toLowerCase().includes(searchTerm.toLowerCase()));
            this.sortCategoriesList(this._existingCategories);
            this._existingCategoriesLoading = false;
            this._typing = false;
            this.existingCategoryLoaded$.next();
        });
    }

    private validateIfNotAlreadyAdded(nameControl: FormControl<string>): CategoryNameControlErrors | null {
        return this.categories?.some((category) => this.compareCategories(category, nameControl.value)) && this.isCRUDMode
            ? { duplicatedCategory: true }
            : null;
    }

    private validateIfNotAlreadyCreated(nameControl: FormControl<string>): Observable<CategoryNameControlErrors | null>  {
        return this.existingCategoryLoaded$.pipe(
            map<void, CategoryNameControlErrors | null>(() => this.existingCategories.some((category) => this.compareCategories(category, nameControl.value)) && this.isCRUDMode
                    ? { duplicatedExistingCategory: true }
                    : null),
            first()
        );
    }

    private compareCategories(category1?: Category, cat2Name?: string): boolean {
        return category1?.name.trim().toUpperCase() === cat2Name?.trim().toUpperCase();
    }

    private validateEmptyCategory(categoryNameControl: FormControl<string>): CategoryNameControlErrors | null {
        return categoryNameControl.value.length && !categoryNameControl.value.trim()
            ? { emptyCategory: true }
            : null;
    }

    private setCategoryNameControlErrorMessageKey() {
        this._categoryNameErrorMessageKey = this.categoryNameControl.invalid
            ? `CATEGORIES_MANAGEMENT.ERRORS.${this.nameErrorMessagesByErrors.get(
                  Object.keys(this.categoryNameControl.errors)[0] as keyof CategoryNameControlErrors
              )}`
            : '';
    }

    private sortCategoriesList(categoriesList: Category[]) {
        categoriesList.sort((category1, category2) => category1.name.localeCompare(category2.name));
    }
}
