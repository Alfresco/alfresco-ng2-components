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

import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { UnsavedChangesDialogComponent } from './unsaved-changes-dialog.component';
import { tap } from 'rxjs/operators';

export const unsavedChangesGuardProperties = {
    unsaved: false
};

/**
 * Guard responsible for protecting leaving page with unsaved changes.
 *
 * @returns boolean | Observable<boolean> flag indicating whether user has unsaved changes or not
 */
export const UnsavedChangesGuard = (): boolean | Observable<boolean> => {
    const dialog = inject(MatDialog);
    return unsavedChangesGuardProperties.unsaved
        ? dialog
              .open<UnsavedChangesDialogComponent, undefined, boolean>(UnsavedChangesDialogComponent, {
                  maxWidth: 346
              })
              .afterClosed()
              .pipe(tap((confirmed) => (unsavedChangesGuardProperties.unsaved = !confirmed)))
        : true;
};
