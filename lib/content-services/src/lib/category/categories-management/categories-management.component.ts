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

import { Category } from '@alfresco/js-api';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSelectionListChange } from '@angular/material/list';
import { EMPTY, Observable, Subject, timer } from 'rxjs';
import { debounce, first, map, takeUntil, tap } from 'rxjs/operators';
import { CategoriesManagementMode } from '../categories-management-mode';
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
            this.validateEmptyCategory
        ],
        this.validateIfNotAlreadyCreated.bind(this)
    );
    private _existingCategories: Category[];
    private _categoryNameErrorMessageKey = '';
    private _existingCategoriesLoading = false;
    private _typing = false;
    private _existingCategoriesPanelVisible: boolean;
    existingCategoriesListLimit = 15;
    noCategoriesTitle = '';
    removeCategoryTitle = '';
    initialCategories: Category[] = [];

    @Input()
    categories: Category[] = [];

    @Input()
    categoryNameControlVisible = false;

    @Input()
    classifiableChanged: Observable<void>;

    @Input()
    disableRemoval = false;

    @Input()
    managementMode: CategoriesManagementMode;

    @Input()
    parentId: string;

    @Output()
    categoriesChange = new EventEmitter<Category[]>();

    @Output()
    categoryNameControlVisibleChange = new EventEmitter<boolean>();

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
                    } else {
                        this._existingCategoriesPanelVisible = false;
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
        this.noCategoriesTitle = this.isCRUDMode ?
            'CATEGORIES_MANAGEMENT.NO_CATEGORIES_CREATED':
            'CATEGORIES_MANAGEMENT.NO_CATEGORIES_ASSIGNED';
        this.removeCategoryTitle = this.isCRUDMode ?
            'CATEGORIES_MANAGEMENT.DELETE_CATEGORY':
            'CATEGORIES_MANAGEMENT.UNASSIGN_CATEGORY';

        if (this.isCRUDMode) {
            this._categoryNameControl.addValidators(Validators.required);
        } else {
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

    hideNameInput() {
        this.categoryNameControlVisible = false;
        this.categoryNameControlVisibleChange.emit(false);
        this._existingCategoriesPanelVisible = false;
    }

    addCategory() {
        if (!this._typing && !this.categoryNameControl.invalid) {
            const newCatName = this.categoryNameControl.value.trim();
            const newCat = new Category({ id: newCatName, name: newCatName });
            this.categories.push(newCat);
            this.hideNameInput();
            this.categoryNameControl.setValue('');
            this.categoryNameControl.markAsUntouched();
            this.categoriesChange.emit(this.categories);
        }
    }

    addCategoryToAssign(change: MatSelectionListChange) {
        const selectedCategory: Category = change.options[0].value;
        this.categories.push(selectedCategory);
        this._existingCategories.splice(this._existingCategories.indexOf(selectedCategory), 1);
        this.categoryNameControl.updateValueAndValidity();
        this.categoriesChange.emit(this.categories);
    }

    removeCategory(category: Category) {
        this.categories.splice(this.categories.indexOf(category), 1);
        if (!!this._existingCategories && !this.initialCategories.some((cat) => cat.id === category.id)) {
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
        if (this.isCRUDMode) {
            this.getChildrenCategories();
        } else {
            this.searchForExistingCategories(name);
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

    private getChildrenCategories() {
        this.categoryService.getSubcategories(this.parentId).subscribe((childrenCategories) => {
            this._existingCategories = childrenCategories.list.entries.map((categoryEntry) => categoryEntry.entry);
            this.sortCategoriesList(this._existingCategories);
            this._existingCategoriesLoading = false;
            this._typing = false;
            this.existingCategoryLoaded$.next();
        });
    }

    private validateIfNotAlreadyAdded(nameControl: FormControl<string>): CategoryNameControlErrors | null {
        return this.categories?.some((category) => this.compareCategories(category, nameControl.value))
            ? { duplicatedCategory: true }
            : null;
    }

    private validateIfNotAlreadyCreated(nameControl: FormControl<string>): Observable<CategoryNameControlErrors | null>  {
        return this.existingCategoryLoaded$.pipe(
            map<void, CategoryNameControlErrors | null>(() => {
                return this.existingCategories.some((category) => this.compareCategories(category, nameControl.value))
                    ? { duplicatedExistingCategory: true }
                    : null;
            }),
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
