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
import { UnsavedChangesDialogComponent, UnsavedChangesGuard } from '@alfresco/adf-core';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Observable, Subject } from 'rxjs';

describe('UnsavedChangesGuard', () => {
    let guard: UnsavedChangesGuard;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [MatDialogModule]
        });
        guard = TestBed.inject(UnsavedChangesGuard);
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

        it('should return true if unsaved is set to false', () => {
            guard.unsaved = false;
            expect(guard.canDeactivate()).toBeTrue();
        });

        it('should return true if unsaved was not set', () => {
            expect(guard.canDeactivate()).toBeTrue();
        });

        it('should return true when unsaved is set to true and result of dialog is true', (done) => {
            guard.unsaved = true;

            (guard.canDeactivate() as Observable<boolean>).subscribe((allowed) => {
                expect(allowed).toBeTrue();
                done();
            });
            afterClosed$.next(true);
        });

        it('should return false when unsaved is set to true and result of dialog is false', (done) => {
            guard.unsaved = true;

            (guard.canDeactivate() as Observable<boolean>).subscribe((allowed) => {
                expect(allowed).toBeFalse();
                done();
            });
            afterClosed$.next(false);
        });

        it('should keep unsaved set to true when unsaved was to true and result of dialog is false', (done) => {
            guard.unsaved = true;

            (guard.canDeactivate() as Observable<boolean>).subscribe(() => {
                expect(guard.unsaved).toBeTrue();
                done();
            });
            afterClosed$.next(false);
        });

        it('should set unsaved to false when unsaved is set to true and result of dialog is true', (done) => {
            guard.unsaved = true;

            (guard.canDeactivate() as Observable<boolean>).subscribe(() => {
                expect(guard.unsaved).toBeFalse();
                done();
            });
            afterClosed$.next(true);
        });
    });
});
