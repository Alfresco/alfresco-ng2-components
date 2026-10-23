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

import { DOCUMENT } from '@angular/common';
import { Injectable, OnDestroy, inject } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { getNativeEventListenerApi } from './zone-native-api';

export const ACTIVITY_EVENTS = ['click', 'keydown', 'mousedown', 'mousemove', 'pointerdown', 'scroll', 'touchstart', 'wheel'] as const;

/** High-frequency activity events (e.g. mousemove, scroll) are throttled to avoid rescheduling the idle timer on every DOM event. */
export const ACTIVITY_THROTTLE_MS = 1000;

const ACTIVE_ACTIVITY_LISTENER_OPTIONS: AddEventListenerOptions = { capture: true, passive: false };
const PASSIVE_ACTIVITY_LISTENER_OPTIONS: AddEventListenerOptions = { capture: true, passive: true };

const getActivityListenerOptions = (eventName: (typeof ACTIVITY_EVENTS)[number]): AddEventListenerOptions =>
    eventName === 'mousemove' ? ACTIVE_ACTIVITY_LISTENER_OPTIONS : PASSIVE_ACTIVITY_LISTENER_OPTIONS;

@Injectable()
export class IdleActivityTracker implements OnDestroy {
    private readonly document = inject(DOCUMENT);
    private readonly activitySubject = new Subject<void>();
    private readonly visibilitySubject = new Subject<DocumentVisibilityState>();
    private isStarted = false;
    private lastActivityEmitAt: number | undefined;
    private lastActivitySeenAt: number | undefined;

    readonly activity$: Observable<void> = this.activitySubject.asObservable();
    readonly visibilityChange$: Observable<DocumentVisibilityState> = this.visibilitySubject.asObservable();

    get lastActivityAt(): number | undefined {
        return this.lastActivitySeenAt;
    }

    start(): void {
        if (this.isStarted) {
            return;
        }

        this.isStarted = true;
        this.lastActivityEmitAt = undefined;
        this.lastActivitySeenAt = undefined;

        const { addEventListener } = getNativeEventListenerApi(this.document);
        ACTIVITY_EVENTS.forEach((eventName) => addEventListener(eventName, this.handleActivity, getActivityListenerOptions(eventName)));
        addEventListener('visibilitychange', this.handleVisibilityChange);
    }

    stop(): void {
        if (!this.isStarted) {
            return;
        }

        this.isStarted = false;

        const { removeEventListener } = getNativeEventListenerApi(this.document);
        ACTIVITY_EVENTS.forEach((eventName) => removeEventListener(eventName, this.handleActivity, getActivityListenerOptions(eventName)));
        removeEventListener('visibilitychange', this.handleVisibilityChange);
    }

    ngOnDestroy(): void {
        this.stop();
    }

    private readonly handleActivity = (): void => {
        const now = Date.now();
        this.lastActivitySeenAt = now;

        if (this.lastActivityEmitAt !== undefined && now - this.lastActivityEmitAt < ACTIVITY_THROTTLE_MS) {
            return;
        }

        this.lastActivityEmitAt = now;
        this.activitySubject.next();
    };

    private readonly handleVisibilityChange = (): void => {
        this.visibilitySubject.next(this.document.visibilityState);
    };
}
