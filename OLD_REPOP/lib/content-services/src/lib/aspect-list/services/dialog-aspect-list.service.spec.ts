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

import { ContentTestingModule } from '../../testing/content.testing.module';
import { DialogAspectListService } from './dialog-aspect-list.service';
import { AspectListDialogComponent } from '../aspect-list-dialog.component';
import { AspectListDialogComponentData } from '../aspect-list-dialog-data.interface';
import { CategoryService } from '../../category/services/category.service';
import { TagService } from '../../tag/services/tag.service';
import { TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { Observable, Subject } from 'rxjs';

describe('DialogAspectListService', () => {
    let dialogAspectListService: DialogAspectListService;
    let dialog: MatDialog;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ContentTestingModule]
        });
        dialogAspectListService = TestBed.inject(DialogAspectListService);
        dialog = TestBed.inject(MatDialog);
    });

    describe('openAspectListDialog', () => {
        const elementToFocusSelector = 'button';

        it('should focus element indicated by passed selector after closing modal', () => {
            const afterClosed$ = new Subject<void>();
            spyOn(dialog, 'open').and.returnValue({
                afterClosed: () => afterClosed$.asObservable()
            } as MatDialogRef<any>);
            const elementToFocus = document.createElement(elementToFocusSelector);
            spyOn(elementToFocus, 'focus');
            spyOn(document, 'querySelector').withArgs(elementToFocusSelector).and.returnValue(elementToFocus);
            dialogAspectListService.openAspectListDialog('some-node-id', elementToFocusSelector);
            afterClosed$.next();
            expect(elementToFocus.focus).toHaveBeenCalled();
        });

        it('should not focus element indicated by passed selector if modal is not closed', () => {
            const elementToFocus = document.createElement(elementToFocusSelector);
            spyOn(elementToFocus, 'focus');
            spyOn(document, 'querySelector').withArgs(elementToFocusSelector).and.returnValue(elementToFocus);
            dialogAspectListService.openAspectListDialog('some-node-id', elementToFocusSelector);
            expect(elementToFocus.focus).not.toHaveBeenCalled();
        });

        it('should not looking for element to focus if passed selector is empty string', () => {
            const afterClosed$ = new Subject<void>();
            spyOn(dialog, 'open').and.returnValue({
                afterClosed: () => afterClosed$.asObservable()
            } as MatDialogRef<any>);
            spyOn(document, 'querySelector');
            dialogAspectListService.openAspectListDialog('some-node-id', '');
            afterClosed$.next();
            expect(document.querySelector).not.toHaveBeenCalled();
        });

        describe('Calling open on dialog', () => {
            let expectedDialogConfig: MatDialogConfig<AspectListDialogComponentData>;

            beforeEach(() => {
                spyOn(dialog, 'open').and.returnValue({
                    afterClosed: () => new Observable<void>()
                } as MatDialogRef<any>);
                expectedDialogConfig = {
                    data: {
                        title: 'ADF-ASPECT-LIST.DIALOG.TITLE',
                        description: 'ADF-ASPECT-LIST.DIALOG.DESCRIPTION',
                        overTableMessage: 'ADF-ASPECT-LIST.DIALOG.OVER-TABLE-MESSAGE',
                        excludedAspects: [],
                        select: jasmine.any(Subject) as any,
                        nodeId: undefined
                    },
                    panelClass: 'adf-aspect-list-dialog',
                    width: '750px',
                    role: 'dialog',
                    disableClose: true
                };
            });

            it('should call open on dialog with correct parameters when tagService.areTagsEnabled returns true', () => {
                const tagService = TestBed.inject(TagService);
                spyOn(tagService, 'areTagsEnabled').and.returnValue(true);

                dialogAspectListService.openAspectListDialog();
                expect(tagService.areTagsEnabled).toHaveBeenCalled();
                expect(dialog.open).toHaveBeenCalledWith(AspectListDialogComponent, expectedDialogConfig);
            });

            it('should call open on dialog with correct parameters when tagService.areTagsEnabled returns false', () => {
                const tagService = TestBed.inject(TagService);
                spyOn(tagService, 'areTagsEnabled').and.returnValue(false);
                expectedDialogConfig.data.excludedAspects = ['cm:taggable'];

                dialogAspectListService.openAspectListDialog();
                expect(tagService.areTagsEnabled).toHaveBeenCalled();
                expect(dialog.open).toHaveBeenCalledWith(AspectListDialogComponent, expectedDialogConfig);
            });

            it('should call open on dialog with correct parameters when categoryService.areCategoriesEnabled returns true', () => {
                const categoryService = TestBed.inject(CategoryService);
                spyOn(categoryService, 'areCategoriesEnabled').and.returnValue(true);

                dialogAspectListService.openAspectListDialog();
                expect(categoryService.areCategoriesEnabled).toHaveBeenCalled();
                expect(dialog.open).toHaveBeenCalledWith(AspectListDialogComponent, expectedDialogConfig);
            });

            it('should call open on dialog with correct parameters when categoryService.areCategoriesEnabled returns false', () => {
                const categoryService = TestBed.inject(CategoryService);
                spyOn(categoryService, 'areCategoriesEnabled').and.returnValue(false);
                expectedDialogConfig.data.excludedAspects = ['cm:generalclassifiable'];

                dialogAspectListService.openAspectListDialog();
                expect(categoryService.areCategoriesEnabled).toHaveBeenCalled();
                expect(dialog.open).toHaveBeenCalledWith(AspectListDialogComponent, expectedDialogConfig);
            });
        });
    });
});
