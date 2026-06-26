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

import { DOCUMENT } from '@angular/common';
import { Injectable, NgZone, OnDestroy, inject } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export const ACTIVITY_EVENTS = ['click', 'keydown', 'mousedown', 'mousemove', 'pointerdown', 'scroll', 'touchstart', 'wheel'] as const;

@Injectable()
export class IdleActivityTracker implements OnDestroy {
    private readonly document = inject(DOCUMENT);
    private readonly ngZone = inject(NgZone);
    private readonly activitySubject = new Subject<void>();
    private readonly visibilitySubject = new Subject<DocumentVisibilityState>();
    private isRegistered = false;

    readonly activity$: Observable<void> = this.activitySubject.asObservable();
    readonly visibilityChange$: Observable<DocumentVisibilityState> = this.visibilitySubject.asObservable();

    start(): void {
        if (this.isRegistered) {
            return;
        }

        this.ngZone.runOutsideAngular(() => {
            ACTIVITY_EVENTS.forEach((eventName) => this.document.addEventListener(eventName, this.handleActivity, { passive: true }));
            this.document.addEventListener('visibilitychange', this.handleVisibilityChange);
        });
        this.isRegistered = true;
    }

    stop(): void {
        if (!this.isRegistered) {
            return;
        }

        ACTIVITY_EVENTS.forEach((eventName) => this.document.removeEventListener(eventName, this.handleActivity));
        this.document.removeEventListener('visibilitychange', this.handleVisibilityChange);
        this.isRegistered = false;
    }

    ngOnDestroy(): void {
        this.stop();
    }

    private readonly handleActivity = (): void => {
        this.activitySubject.next();
    };

    private readonly handleVisibilityChange = (): void => {
        this.visibilitySubject.next(this.document.visibilityState);
    };
}
