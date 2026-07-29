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
import { NgZone } from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ACTIVITY_THROTTLE_MS, IdleActivityTracker } from './idle-activity-tracker';

describe('IdleActivityTracker', () => {
    let tracker: IdleActivityTracker;
    let doc: Document;

    beforeEach(() => {
        TestBed.configureTestingModule({ providers: [IdleActivityTracker] });
        tracker = TestBed.inject(IdleActivityTracker);
        doc = TestBed.inject(DOCUMENT);
    });

    afterEach(() => tracker.stop());

    it('emits on activity$ when a registered DOM event fires after start()', () => {
        const spy = jasmine.createSpy('activity');
        tracker.activity$.subscribe(spy);
        tracker.start();

        doc.dispatchEvent(new Event('click'));

        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('throttles a burst of activity events within the throttle window', fakeAsync(() => {
        const spy = jasmine.createSpy('activity');
        tracker.activity$.subscribe(spy);
        tracker.start();

        // Leading edge emits immediately, the rest of the burst is throttled.
        for (let i = 0; i < 10; i++) {
            doc.dispatchEvent(new Event('mousemove'));
        }
        expect(spy).toHaveBeenCalledTimes(1);

        // After the throttle window, activity emits again.
        tick(ACTIVITY_THROTTLE_MS);
        doc.dispatchEvent(new Event('mousemove'));
        expect(spy.calls.count()).toBeGreaterThan(1);

        tick(ACTIVITY_THROTTLE_MS);
    }));

    it('does not emit after stop()', () => {
        const spy = jasmine.createSpy('activity');
        tracker.activity$.subscribe(spy);
        tracker.start();
        tracker.stop();

        doc.dispatchEvent(new Event('click'));

        expect(spy).not.toHaveBeenCalled();
    });

    it('registers listeners only once across repeated start() calls', () => {
        const spy = jasmine.createSpy('activity');
        tracker.activity$.subscribe(spy);
        tracker.start();
        tracker.start();

        doc.dispatchEvent(new Event('click'));

        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should allow a later listener to prevent default when an activity event fires', () => {
        const preventDefault = jasmine.createSpy('preventDefault').and.callFake((event: Event) => event.preventDefault());
        tracker.start();
        doc.addEventListener('mousemove', preventDefault);

        try {
            const event = new MouseEvent('mousemove', { cancelable: true });
            doc.dispatchEvent(event);

            expect(preventDefault).toHaveBeenCalledTimes(1);
            expect(event.defaultPrevented).toBeTrue();
        } finally {
            doc.removeEventListener('mousemove', preventDefault);
        }
    });

    it('is a no-op when stop() is called without a prior start()', () => {
        const spy = jasmine.createSpy('activity');
        tracker.activity$.subscribe(spy);

        expect(() => tracker.stop()).not.toThrow();

        doc.dispatchEvent(new Event('click'));
        expect(spy).not.toHaveBeenCalled();
    });

    it('emits the current visibility state on visibilitychange', () => {
        const spy = jasmine.createSpy('visibility');
        tracker.visibilityChange$.subscribe(spy);
        tracker.start();

        doc.dispatchEvent(new Event('visibilitychange'));

        expect(spy).toHaveBeenCalledWith(doc.visibilityState);
    });

    it('registers listeners outside the Angular zone', () => {
        const ngZone = TestBed.inject(NgZone);
        const runOutside = spyOn(ngZone, 'runOutsideAngular').and.callThrough();
        tracker.start();
        expect(runOutside).toHaveBeenCalled();
    });
});
