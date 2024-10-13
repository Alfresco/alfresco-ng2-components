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

import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable, of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { UnsavedChangesDialogComponent } from './unsaved-changes-dialog.component';
import { map, tap } from 'rxjs/operators';
import { UnsavedChangesDialogData } from './unsaved-changes-dialog.model';
import { AuthenticationService, AuthGuardService } from '../../auth';

/**
 * Guard responsible for protecting leaving page with unsaved changes.
 */
@Injectable({
    providedIn: 'root'
})
export class UnsavedChangesGuard implements CanDeactivate<any> {
    unsaved = false;
    data: UnsavedChangesDialogData;

    constructor(private dialog: MatDialog, private authenticationService: AuthenticationService, private authGuardBaseService: AuthGuardService) {}

    /**
     * Allows to deactivate route when there is no unsaved changes, otherwise displays dialog to confirm discarding changes.
     * @returns boolean | Observable<boolean> true when there is no unsaved changes or changes can be discarded, false otherwise.
     */
    canDeactivate(): boolean | Observable<boolean> {
        if (!this.authenticationService.isLoggedIn() && !this.authGuardBaseService.withCredentials) {
            return of(true);
        }

        return this.unsaved
            ? this.dialog
                  .open<UnsavedChangesDialogComponent>(UnsavedChangesDialogComponent, {
                      maxWidth: this.data?.maxWidth ?? 346,
                      data: this.data
                  })
                  .afterClosed()
                  .pipe(
                      tap((confirmed) => (this.unsaved = !confirmed)),
                      map((confirmed) => !!confirmed)
                  )
            : true;
    }
}
