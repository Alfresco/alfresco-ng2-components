/*!
 * @license
 * Copyright © 2005-2026 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SessionTimeoutDialogComponent } from './session-timeout-dialog.component';
import { NoopTranslateModule } from '../../testing';

describe('SessionTimeoutDialogComponent', () => {
    const dialogRef = { close: jasmine.createSpy('close') };

    beforeEach(() => {
        dialogRef.close.calls.reset();
        TestBed.configureTestingModule({
            imports: [SessionTimeoutDialogComponent, NoopTranslateModule],
            providers: [
                { provide: MatDialogRef, useValue: dialogRef },
                { provide: MAT_DIALOG_DATA, useValue: { dialogTimeoutMs: 3000 } }
            ]
        });
    });

    it('initializes remainingSeconds from dialogTimeoutMs', () => {
        const fixture = TestBed.createComponent(SessionTimeoutDialogComponent);
        expect(fixture.componentInstance.remainingSeconds).toBe(3);
    });

    it('counts down each second', fakeAsync(() => {
        const fixture = TestBed.createComponent(SessionTimeoutDialogComponent);
        fixture.detectChanges();
        tick(1000);
        expect(fixture.componentInstance.remainingSeconds).toBe(2);
        tick(1000);
        expect(fixture.componentInstance.remainingSeconds).toBe(1);
        fixture.destroy();
    }));

    it('closes with true on continueWorking()', () => {
        const fixture = TestBed.createComponent(SessionTimeoutDialogComponent);
        fixture.componentInstance.continueWorking();
        expect(dialogRef.close).toHaveBeenCalledWith(true);
    });

    it('closes with false on logout()', () => {
        const fixture = TestBed.createComponent(SessionTimeoutDialogComponent);
        fixture.componentInstance.logout();
        expect(dialogRef.close).toHaveBeenCalledWith(false);
    });
});
