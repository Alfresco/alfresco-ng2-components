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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategorySelectorDialogComponent, CategorySelectorDialogOptions } from './category-selector.dialog';
import { Subject } from 'rxjs';
import { Category } from '@alfresco/js-api';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { AppConfigService, AppConfigServiceMock } from '@alfresco/adf-core';

describe('CategorySelectorDialogComponent', () => {
    let fixture: ComponentFixture<CategorySelectorDialogComponent>;
    let component: CategorySelectorDialogComponent;
    let selectButton: HTMLButtonElement;

    const dialogRef = {
        close: jasmine.createSpy('close')
    };

    const options: CategorySelectorDialogOptions = {
        select: new Subject<Category[]>()
    };

    const categories: Category[] = [
        { id: 'id1', name: 'cat1' },
        { id: 'id2', name: 'cat3' }
    ];

    const setCategories = () => {
        component.categories = categories;
        fixture.detectChanges();
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [MatDialogModule, CategorySelectorDialogComponent],
            providers: [
                { provide: AppConfigService, useClass: AppConfigServiceMock },
                { provide: MatDialogRef, useValue: dialogRef },
                { provide: MAT_DIALOG_DATA, useValue: options }
            ]
        });
        dialogRef.close.calls.reset();
        fixture = TestBed.createComponent(CategorySelectorDialogComponent);
        component = fixture.componentInstance;

        fixture.detectChanges();

        selectButton = fixture.debugElement.query(By.css(`[data-automation-id="category-selector-dialog-select-button"]`)).nativeElement;
    });

    it('should set params if they are provided as dialog options', () => {
        options.multiSelect = true;
        component.ngOnInit();

        expect(component.multiSelect).toBeTrue();
    });

    it('should close dialog on cancel button click', () => {
        fixture.debugElement.query(By.css(`[data-automation-id="category-selector-dialog-cancel-button"]`)).nativeElement.click();
        expect(dialogRef.close).toHaveBeenCalled();
    });

    it('should close dialog if category is selected and Select button was clicked', () => {
        selectButton.click();
        expect(dialogRef.close).not.toHaveBeenCalled();

        setCategories();
        selectButton.click();

        expect(dialogRef.close).toHaveBeenCalled();
    });

    it('should provide selected categories as observable on Select click', () => {
        spyOn(options.select, 'next');
        setCategories();
        selectButton.click();

        expect(options.select.next).toHaveBeenCalledWith(categories);
    });

    it('should disable select button if no categories were selected', () => {
        expect(selectButton.disabled).toBeTruthy();
        setCategories();
        expect(selectButton.disabled).toBeFalse();
    });
});
