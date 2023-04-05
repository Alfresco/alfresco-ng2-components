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

import { NotificationService } from '@alfresco/adf-core';
import { Category, CategoryBody } from '@alfresco/js-api';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Component, EventEmitter, HostBinding, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSelectionListChange } from '@angular/material/list';
import { EMPTY, Observable, Subject, timer } from 'rxjs';
import { debounce, finalize, first, map, takeUntil, tap } from 'rxjs/operators';
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
export class CategoriesManagementComponent implements OnInit {
    readonly nameErrorMessagesByErrors = new Map<keyof CategoryNameControlErrors, string>([
        ['duplicatedExistingCategory', 'ALREADY_EXISTS'],
        ['duplicatedCategory', 'DUPLICATED_CATEGORY'],
        ['emptyCategory', 'EMPTY_CATEGORY'],
        ['required', 'REQUIRED'],
    ]);

    existingCategoriesListLimit = 15;
    noCategoriesTitle = '';
    removeCategoryTitle = '';
    initialCategories: Category[] = [];
    private existingCategoryLoaded$ = new Subject<void>();
    private _categoriesToCreate: string[] = [];
    private _categoryNameControl = new FormControl<string>(
        '',
        [
            this.validateIfNotAlreadyAdded.bind(this),
            this.validateEmptyCategory
        ],
        this.validateIfNotAlreadyCreated.bind(this),
    );
    private _existingCategories: Category[];
    private onDestroy$ = new Subject<void>();
    private _categoryNameErrorMessageKey = '';
    private _existingCategoriesLoading = false;
    private _categoriesListScrollbarVisible = false;
    private _typing = false;
    private _saving = false;
    private cancelExistingCategoriesLoading$ = new Subject<void>();
    private _existingCategoriesPanelVisible: boolean;
    // private categoriesList: CategoryEntry[] = [];
    private parentId = '';

    @Input()
    categoryNameControlVisible = false;

    @Input()
    disableRemoval = false;

    @Input()
    managementMode: CategoriesManagementMode;

    @Input()
    categories: Category[] = [];

    @Input()
    classifiableChanged: Observable<void>;

    @Output()
    categoriesChange = new EventEmitter<Category[]>();

    @Output()
    categoryNameControlVisibleChange = new EventEmitter<boolean>();

    // @ViewChild('categoriesList')
    // private categoriesListElement: ElementRef;

    constructor(
        private categoryService: CategoryService,
        private notificationService: NotificationService,
    ) {}

    ngOnInit(): void {
        this.parentId = '-root-';
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
                    this._existingCategories = null;
                }),
                debounce((name: string) => (name ? timer(300) : EMPTY)),
                takeUntil(this.onDestroy$)
            )
            .subscribe((name: string) => this.onNameControlValueChange(name));

        // this.initialCategories.forEach((category) => this.categories.push(category));
        // this.categories = this.initialCategories;
        this.categories.forEach((category) => this.initialCategories.push(category));
        this.categoryNameControl.statusChanges
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(() => this.setCategoryNameControlErrorMessageKey());

        this.classifiableChanged
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(() => {
                this.categories = []
                this.categoryNameControlVisible = false;
                this.categoryNameControlVisibleChange.emit(false);
            });

        this.setCategoryNameControlErrorMessageKey();
        this.noCategoriesTitle = this.managementMode === CategoriesManagementMode.ASSIGN ?
            'No Categories assigned':
            'CATEGORIES_MANAGEMENT.NO_CATEGORIES_CREATED';
            // 'CATEGORIES_MANAGEMENT.NO_CATEGORIES_ASSIGNED';
        this.removeCategoryTitle = this.managementMode === CategoriesManagementMode.ASSIGN ?
            // 'CATEGORIES_MANAGEMENT.UNASSIGN_CATEGORY':
            'Unassign Category':
            'CATEGORIES_MANAGEMENT.DELETE_CATEGORY';
        if (this.managementMode === CategoriesManagementMode.CRUD) {
            this._categoryNameControl.addValidators(Validators.required);
        }
    }

    ngOnDestroy(): void {
        this.onDestroy$.next();
        this.onDestroy$.complete();
        this.cancelExistingCategoriesLoading$.next();
        this.cancelExistingCategoriesLoading$.complete();
    }

    @HostBinding('class.acc-dialog-with-existing-categories-panel')
    get hostClass(): boolean {
        return this.existingCategoriesPanelVisible;
    }

    get categoryNameControl(): FormControl<string> {
        return this._categoryNameControl;
    }

    get categoriesListScrollbarVisible(): boolean {
        return this._categoriesListScrollbarVisible;
    }

    get categoriesToCreate(): string[] {
        return this._categoriesToCreate;
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

    get saving(): boolean {
        return this._saving;
    }

    get existingCategoriesPanelVisible(): boolean {
        return this._existingCategoriesPanelVisible;
    }

    showNameInput(): void {
        this.categoryNameControlVisible = true;
        this.categoryNameControlVisibleChange.emit(true);
        this._existingCategoriesPanelVisible = !!this.categoryNameControl.value.trim();
    }

    hideNameInput(): void {
        this.categoryNameControlVisible = false;
        this.categoryNameControlVisibleChange.emit(false);
        this._existingCategoriesPanelVisible = false;
    }

    addCategory(category?: Category): void {
        if (!this._typing && !this.categoryNameControl.invalid) {
            // this.categories.push(category ? category : this.categoryNameControl.value.trim());
            this.categories.push(category);
            this.hideNameInput();
            this.categoryNameControl.setValue('');
            this.categoryNameControl.markAsUntouched();
        }
    }

    addCategoryToAssign(change: MatSelectionListChange): void {
        const selectedCategory: Category = change.options[0].value;
        this.categories.push(selectedCategory);
        this._existingCategories.splice(this._existingCategories.indexOf(selectedCategory), 1);
        this.categoryNameControl.updateValueAndValidity();
        this.categoriesChange.emit(this.categories);
    }

    removeCategory(category: Category): void {
        this.categories.splice(this.categories.indexOf(category), 1);
        console.log(this.initialCategories);
        if (!!this._existingCategories && !!this.initialCategories.find((cat) => cat.id === category.id)) {
            this._existingCategories.push(category);
            this.sortCategoriesList(this._existingCategories);
        }
        this.categoryNameControl.updateValueAndValidity({
            emitEvent: false,
        });
        this.categoriesChange.emit(this.categories);
    }

    saveCategories(): void {
        this._saving = true;

        this.hideNameInput();

        const categoriesToCreate = this.categories.map((category: Category) => {
            const categoryBody = new CategoryBody();
            categoryBody.name = category.name;
            return categoryBody;
        });

        this.categoryService
            .createSubcategories(this.parentId, categoriesToCreate)
            .pipe(finalize(() => (this._saving = false)))
            .subscribe(
                () => {
                    this.notificationService.showInfo('CONTENT_STRUCTURING.CATEGORIES.SUCCESS');
                },
                (error: HttpErrorResponse) => this.handleCreateCategoryError(error)
            );
    }

    private handleCreateCategoryError(error: HttpErrorResponse) {
        const message = error.status === HttpStatusCode.Conflict
            ? 'CONTENT_STRUCTURING.CATEGORIES.ERRORS.EXISTING_CATEGORIES'
            : 'CONTENT_STRUCTURING.CATEGORIES.ERRORS.CREATE_CATEGORIES';

        this.notificationService.showError(message);
    }

    private onNameControlValueChange(name: string): void {
        this.categoryNameControl.markAsTouched();
        this.categoryService.searchCategories(name, 0 , this.existingCategoriesListLimit).subscribe((existingCategoriesResult) => {
            console.log(existingCategoriesResult.list.entries);
            this._existingCategories = existingCategoriesResult.list.entries.map((rowEntry) => {
                let existingCat = new Category();
                existingCat.id = rowEntry.entry.id;
                const path = rowEntry.entry.path.name.split('/').splice(3).join('/');
                existingCat.name = path ? `${path}/${rowEntry.entry.name}` : rowEntry.entry.name;
                return existingCat;
            });
            console.log(this._existingCategories.length);
            this._existingCategories = this._existingCategories.filter((existingCat) => this.categories.find((category) => existingCat.id === category.id) === undefined);
            console.log(this._existingCategories.length);
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
                        return this.categories.some((category) => this.compareCategories(category, nameControl.value))
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

    private setCategoryNameControlErrorMessageKey(): void {
        this._categoryNameErrorMessageKey = this.categoryNameControl.invalid
            ? `CONTENT_STRUCTURING.CATEGORIES.ERRORS.${this.nameErrorMessagesByErrors.get(
                  Object.keys(this.categoryNameControl.errors)[0] as keyof CategoryNameControlErrors
              )}`
            : '';
    }

    private sortCategoriesList(categoriesList: Category[]): void {
        categoriesList.sort((category1, category2) => category1.name.localeCompare(category2.name));
    }
}
