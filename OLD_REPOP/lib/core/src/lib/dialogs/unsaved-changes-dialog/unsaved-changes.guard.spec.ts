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

import { TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Observable, Subject } from 'rxjs';
import { UnsavedChangesDialogComponent } from './unsaved-changes-dialog.component';
import { UnsavedChangesGuard } from './unsaved-changes.guard';
import { AuthenticationService } from '../../auth/services/authentication.service';
import { AuthGuardService } from '../../auth/guard/auth-guard.service';
import { provideCoreAuthTesting } from '../../testing';

describe('UnsavedChangesGuard', () => {
    let guard: UnsavedChangesGuard;
    let authService: AuthenticationService;
    let authGuardService: AuthGuardService;

    const expectGuardToBe = (condition: boolean, done: DoneFn, checkUnsaved?: boolean) => {
        (guard.canDeactivate() as Observable<boolean>).subscribe((allowed) => {
            if (checkUnsaved) {
                allowed = guard.unsaved;
            }
            condition ? expect(allowed).toBeTrue() : expect(allowed).toBeFalse();
            done();
        });
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [MatDialogModule],
            providers: [
                provideCoreAuthTesting(),
                {
                    provide: AuthenticationService,
                    useValue: {
                        isLoggedIn: () => true
                    }
                },
                {
                    provide: AuthGuardService,
                    useValue: {
                        get withCredentials() {
                            return false;
                        }
                    }
                }
            ]
        });
        guard = TestBed.inject(UnsavedChangesGuard);
        authService = TestBed.inject(AuthenticationService);
        TestBed.inject(AuthGuardService);
        authGuardService = TestBed.inject(AuthGuardService);
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

        describe('with Auth', () => {
            beforeEach(() => {
                spyOn(authService, 'isLoggedIn').and.returnValue(true);
            });

            it('should return true if unsaved is set to false and user is logged in', () => {
                guard.unsaved = false;
                expect(guard.canDeactivate()).toBeTrue();
            });

            it('should return true if unsaved was not set and user is logged in', () => {
                expect(guard.canDeactivate()).toBeTrue();
            });

            it('should return true when unsaved is set to true and result of dialog is true', (done) => {
                guard.unsaved = true;

                expectGuardToBe(true, done);
                afterClosed$.next(true);
            });

            it('should set unsaved to false when unsaved is set to true and result of dialog is true', (done) => {
                guard.unsaved = true;

                expectGuardToBe(false, done, true);
                afterClosed$.next(true);
            });

            it('should return false if afterClosed subject value was undefined', (done) => {
                guard.unsaved = true;

                expectGuardToBe(false, done);
                afterClosed$.next(undefined);
            });

            it('should return false when unsaved is set to true and result of dialog is false', (done) => {
                guard.unsaved = true;

                expectGuardToBe(false, done);
                afterClosed$.next(false);
            });

            it('should keep unsaved set to true when unsaved was to true and result of dialog is false', (done) => {
                guard.unsaved = true;

                expectGuardToBe(true, done, true);
                afterClosed$.next(false);
            });

            it('should call open on dialog with correct parameters when maxWidth is not set', () => {
                guard.unsaved = true;
                guard.data = {
                    headerText: 'header'
                };

                guard.canDeactivate();
                expect(dialog.open).toHaveBeenCalledWith(UnsavedChangesDialogComponent, {
                    maxWidth: 346,
                    data: guard.data
                });
            });

            it('should call open on dialog with correct parameters when maxWidth is set', () => {
                guard.unsaved = true;
                guard.data = {
                    headerText: 'header',
                    maxWidth: 'none'
                };

                guard.canDeactivate();
                expect(dialog.open).toHaveBeenCalledWith(UnsavedChangesDialogComponent, {
                    maxWidth: 'none',
                    data: guard.data
                });
            });
        });

        describe('Without auth', () => {
            beforeEach(() => {
                spyOn(authService, 'isLoggedIn').and.returnValue(false);
            });

            it('should return true when user is logged out of authenticationService and authGuardBaseService.withCredentials returns false', (done) => {
                expectGuardToBe(true, done);
                afterClosed$.next(true);
            });

            it('should return false when authGuardBaseService.withCredentials returns true', (done) => {
                guard.unsaved = true;
                spyOnProperty(authGuardService, 'withCredentials').and.returnValue(true);

                expectGuardToBe(false, done);
                afterClosed$.next(false);
            });
        });
    });
});
