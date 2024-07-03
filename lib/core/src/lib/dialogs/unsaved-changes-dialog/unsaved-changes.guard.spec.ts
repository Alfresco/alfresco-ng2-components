/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { TestBed } from '@angular/core/testing';
import { CoreTestingModule, UnsavedChangesDialogComponent, UnsavedChangesGuard, unsavedChangesGuardProperties } from '@alfresco/adf-core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable, Subject } from 'rxjs';

describe('UnsavedChangesGuard', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [CoreTestingModule]
        });
    });

    describe('canDeactivate', () => {
        let dialog: MatDialog;
        let afterClosed$: Subject<boolean>;

        beforeEach(() => {
            afterClosed$ = new Subject<boolean>();
            dialog = TestBed.inject(MatDialog);
            spyOn(dialog, 'open').and.returnValue({
                afterClosed: () => afterClosed$ as Observable<boolean>
            } as MatDialogRef<UnsavedChangesDialogComponent>);
        });

        it('should return true if unsaved is set to false', async () => {
            unsavedChangesGuardProperties.unsaved = false;
            expect(TestBed.runInInjectionContext(UnsavedChangesGuard)).toBeTrue();
        });

        it('should return true if unsaved was not set', async () => {
            expect(TestBed.runInInjectionContext(UnsavedChangesGuard)).toBeTrue();
        });

        it('should return true and set unsaved to false when unsaved is set to true and result of dialog is true', (done) => {
            unsavedChangesGuardProperties.unsaved = true;

            (TestBed.runInInjectionContext(UnsavedChangesGuard) as Observable<boolean>).subscribe((allowed) => {
                expect(allowed).toBeTrue();
                expect(unsavedChangesGuardProperties.unsaved).toBeFalse();
                done();
            });
            afterClosed$.next(true);
        });

        it('should return false and set unsaved to true when unsaved is set to true and result of dialog is false', (done) => {
            unsavedChangesGuardProperties.unsaved = true;
            (TestBed.runInInjectionContext(UnsavedChangesGuard) as Observable<boolean>).subscribe((allowed) => {
                expect(allowed).toBeFalse();
                expect(unsavedChangesGuardProperties.unsaved).toBeTrue();
                done();
            });
            afterClosed$.next(false);
        });
    });
});
