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

import { DatePipe, registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import localeDeExtra from '@angular/common/locales/extra/de';
import { TestBed } from '@angular/core/testing';
import { formatDistance } from 'date-fns';
import { UserPreferencesService } from '../common/services/user-preferences.service';
import { DateFnsUtils } from '../common/utils/date-fns-utils';
import { TimeAgoPipe } from './time-ago.pipe';

registerLocaleData(localeDe, 'de', localeDeExtra);

describe('TimeAgoPipe', () => {
    let pipe: TimeAgoPipe;
    let localeSignalSpy: jasmine.Spy<() => string>;
    const NOW = new Date('2026-03-27T12:00:00.000Z');

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                TimeAgoPipe,
                {
                    provide: UserPreferencesService,
                    useValue: {
                        localeSignal: jasmine.createSpy('localeSignal').and.returnValue('en-US')
                    }
                }
            ]
        });

        pipe = TestBed.inject(TimeAgoPipe);
        const userPreferences = TestBed.inject(UserPreferencesService);
        localeSignalSpy = userPreferences.localeSignal as unknown as jasmine.Spy<() => string>;

        jasmine.clock().uninstall();
        jasmine.clock().install();
        jasmine.clock().mockDate(NOW);
        jasmine.clock().mockDate(new Date('2026-03-27T12:00:00.000Z'));
    });

    it('should return time difference for a given date', () => {
        const date = new Date();
        expect(pipe.transform(date)).toBe('less than a minute ago');
    });

    it('should return exact date if given date is more than seven days for en locale ', () => {
        const date = new Date('1990-11-03T15:25:42.749');
        expect(pipe.transform(date)).toBe('11/3/90, 3:25 PM');
    });

    it('should return exact date if given date is more than seven days for de locale ', () => {
        localeSignalSpy.and.returnValue('de');
        const date = new Date('1990-11-03T15:25:42.749');

        expect(pipe.transform(date)).toBe('03.11.90, 15:25');
    });

    it('should return empty string if given date is empty', () => {
        expect(pipe.transform(null)).toBe('');
        expect(pipe.transform(undefined)).toBe('');
    });

    describe('When a locale is given', () => {
        it('should return a localised message', () => {
            const date = new Date();
            const transformedDate = pipe.transform(date, 'de');
            /* cspell:disable-next-line */
            expect(transformedDate).toBe('vor weniger als 1 Minute');
        });
    });

    describe('relative time output (within 7 days)', () => {
        it('should return "less than a minute ago" when date is now', () => {
            const date = new Date(NOW);

            expect(pipe.transform(date)).toBe('less than a minute ago');
        });

        it('should return relative distance when date is a few hours ago', () => {
            const threeHoursAgo = new Date('2026-03-27T09:00:00.000Z');

            const result = pipe.transform(threeHoursAgo);

            const expected = formatDistance(threeHoursAgo, NOW, {
                addSuffix: true,
                locale: DateFnsUtils.getLocaleFromString('en-US')
            });
            expect(result).toBe(expected);
        });

        it('should return relative distance when date is 6 days ago', () => {
            const sixDaysAgo = new Date('2026-03-21T12:00:00.000Z');

            const result = pipe.transform(sixDaysAgo);

            const expected = formatDistance(sixDaysAgo, NOW, {
                addSuffix: true,
                locale: DateFnsUtils.getLocaleFromString('en-US')
            });
            expect(result).toBe(expected);
        });
    });

    describe('absolute date output (older than 7 days)', () => {
        it('should return short formatted date when date is more than 7 days ago', () => {
            const oldDate = new Date('1990-11-03T15:25:42.749');

            const result = pipe.transform(oldDate);

            const expected = new DatePipe('en-US').transform(oldDate, 'short', null, 'en-US');
            expect(result).toBe(expected);
        });

        it('should return short formatted date when date is exactly 8 days ago', () => {
            const eightDaysAgo = new Date('2026-03-19T12:00:00.000Z');

            const result = pipe.transform(eightDaysAgo);

            const expected = new DatePipe('en-US').transform(eightDaysAgo, 'short', null, 'en-US');
            expect(result).toBe(expected);
        });
    });

    describe('locale handling', () => {
        it('should return a localized relative message when locale argument is provided', () => {
            const date = new Date(NOW);

            const result = pipe.transform(date, 'de');

            const expected = formatDistance(date, NOW, {
                addSuffix: true,
                locale: DateFnsUtils.getLocaleFromString('de')
            });
            expect(result).toBe(expected);
        });

        it('should use locale argument over user preference locale', () => {
            localeSignalSpy.and.returnValue('fr');
            const oldDate = new Date('2026-03-01T10:00:00.000Z');

            const result = pipe.transform(oldDate, 'de');

            const expected = '01.03.26, 10:00';
            expect(result).toBe(expected);
        });

        it('should use user preference locale when no locale argument is provided', () => {
            localeSignalSpy.and.returnValue('fr');
            const date = new Date(NOW);

            const result = pipe.transform(date);

            const expected = formatDistance(date, NOW, {
                addSuffix: true,
                locale: DateFnsUtils.getLocaleFromString('fr')
            });
            expect(result).toBe(expected);
        });

        it('should fall back to DEFAULT_LOCALE when user preference locale is empty', () => {
            localeSignalSpy.and.returnValue('');
            const oldDate = new Date('2026-03-01T10:00:00.000Z');

            const result = pipe.transform(oldDate);

            const expected = new DatePipe('en-US').transform(oldDate, 'short', null, 'en-US');
            expect(result).toBe(expected);
        });
    });

    describe('null and undefined handling', () => {
        it('should return empty string when value is null', () => {
            expect(pipe.transform(null as unknown as Date)).toBe('');
        });

        it('should return empty string when value is undefined', () => {
            expect(pipe.transform(undefined as unknown as Date)).toBe('');
        });
    });
});
