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

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, ViewEncapsulation, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';

export const SESSION_TIMEOUT_BACKDROP_CLASS = 'adf-session-timeout-backdrop';

export interface SessionTimeoutDialogData {
    dialogTimeoutMs: number;
}

@Component({
    selector: 'adf-session-timeout-dialog',
    standalone: true,
    imports: [MatButtonModule, MatDialogModule, TranslatePipe],
    templateUrl: './session-timeout-dialog.component.html',
    styleUrl: './session-timeout-dialog.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class SessionTimeoutDialogComponent implements OnDestroy {
    private readonly dialogRef = inject<MatDialogRef<SessionTimeoutDialogComponent, boolean>>(MatDialogRef);
    private readonly data = inject<SessionTimeoutDialogData>(MAT_DIALOG_DATA);
    private readonly changeDetectorRef = inject(ChangeDetectorRef);
    private readonly timeoutEndTime = Date.now() + this.data.dialogTimeoutMs;
    private readonly countdownIntervalId = setInterval(() => this.updateRemainingSeconds(), 1000);

    remainingSeconds = this.getRemainingSeconds();

    ngOnDestroy(): void {
        clearInterval(this.countdownIntervalId);
    }

    continueWorking(): void {
        this.dialogRef.close(true);
    }

    logout(): void {
        this.dialogRef.close(false);
    }

    private updateRemainingSeconds(): void {
        this.remainingSeconds = this.getRemainingSeconds();
        this.changeDetectorRef.markForCheck();
    }

    private getRemainingSeconds(): number {
        return Math.max(Math.ceil((this.timeoutEndTime - Date.now()) / 1000), 0);
    }
}
