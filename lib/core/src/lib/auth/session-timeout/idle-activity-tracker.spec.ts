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
import { NgZone } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { IdleActivityTracker } from './idle-activity-tracker';

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
