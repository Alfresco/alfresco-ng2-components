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
import { AppConfigService } from '../app-config';

registerLocaleData(localeDe, 'de', localeDeExtra);

describe('TimeAgoPipe', () => {
    const NOW = new Date('2026-03-27T12:00:00.000Z');

    const createPipe = (dateFormat, locale): TimeAgoPipe => {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            providers: [
                TimeAgoPipe,
                {
                    provide: UserPreferencesService,
                    useValue: {
                        localeSignal: jasmine.createSpy('localeSignal').and.returnValue(locale)
                    }
                },
                {
                    provide: AppConfigService,
                    useValue: {
                        get: jasmine.createSpy('get').and.returnValue(dateFormat)
                    }
                }
            ]
        });

        const newPipe = TestBed.inject(TimeAgoPipe);
        spyOn(newPipe, 'getCurrentDateTime').and.returnValue(NOW);

        return newPipe;
    };

    describe('AppConfigService returns "MMM d, y, h:mm" and locale="en-US" ', () => {
        let pipe: TimeAgoPipe;
        beforeEach(() => {
            pipe = createPipe('MMM d, y, h:mm', 'en-US');
        });
        it('should return time difference for a given date', () => {
            const date = pipe.getCurrentDateTime();
            expect(pipe.transform(date)).toBe('less than a minute ago');
        });

        it('should return exact date if given date is more than seven days for en locale ', () => {
            const date = new Date('1990-11-02T15:25:42.749');
            expect(pipe.transform(date)).toBe('Nov 2, 1990, 3:25');
        });

        it('should return empty string if given date is empty', () => {
            expect(pipe.transform(null)).toBe('');
            expect(pipe.transform(undefined)).toBe('');
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
        it('should return relative distance when date is exactly 7 days ago', () => {
            const sevenDaysAgo = new Date('2026-03-20T12:00:00.000Z');

            const result = pipe.transform(sevenDaysAgo);

            const expected = formatDistance(sevenDaysAgo, NOW, {
                addSuffix: true,
                locale: DateFnsUtils.getLocaleFromString('en-US')
            });
            expect(result).toBe(expected);
        });

        it('should use locale argument over user preference locale', () => {
            const oldDate = new Date('2026-03-01T10:00:00.000Z');
            const result = pipe.transform(oldDate, 'de');

            expect(result).toBe('März 1, 2026, 10:00');
        });
    });

    describe('AppConfigService return "MMM d, y, h:mm" and locale="de" ', () => {
        let pipe: TimeAgoPipe;
        beforeEach(() => {
            pipe = createPipe('MMM d, y, h:mm', 'de');
        });
        it('should return time difference for a given date', () => {
            const date = pipe.getCurrentDateTime();
            expect(pipe.transform(date)).toBe('vor weniger als 1 Minute');
        });

        it('should return exact date if given date is more than seven days for de locale ', () => {
            const date = new Date('1990-11-03T15:25:42.749');
            expect(pipe.transform(date)).toBe('Nov. 3, 1990, 3:25');
        });

        it('should return empty string if given date is empty', () => {
            expect(pipe.transform(null)).toBe('');
            expect(pipe.transform(undefined)).toBe('');
        });

        it('should return relative distance when date is a few hours ago', () => {
            const threeHoursAgo = new Date('2026-03-27T09:00:00.000Z');
            const result = pipe.transform(threeHoursAgo);
            const expected = formatDistance(threeHoursAgo, NOW, {
                addSuffix: true,
                locale: DateFnsUtils.getLocaleFromString('de')
            });
            expect(result).toBe(expected);
        });
        it('should return relative distance when date is 6 days ago', () => {
            const sixDaysAgo = new Date('2026-03-21T12:00:00.000Z');
            const result = pipe.transform(sixDaysAgo);
            const expected = formatDistance(sixDaysAgo, NOW, {
                addSuffix: true,
                locale: DateFnsUtils.getLocaleFromString('de')
            });
            expect(result).toBe(expected);
        });
        it('should return relative distance when date is exactly 7 days ago', () => {
            const sevenDaysAgo = new Date('2026-03-20T12:00:00.000Z');
            const result = pipe.transform(sevenDaysAgo);
            const expected = formatDistance(sevenDaysAgo, NOW, {
                addSuffix: true,
                locale: DateFnsUtils.getLocaleFromString('de')
            });

            expect(result).toBe(expected);
        });

        it('should use locale argument over user preference locale', () => {
            const oldDate = new Date('2026-03-01T10:00:00.000Z');
            const result = pipe.transform(oldDate, 'en-US');

            expect(result).toBe('Mar 1, 2026, 10:00');
        });
    });

    describe('AppConfigService has no value and returns default short and locale="en-US" ', () => {
        let pipe: TimeAgoPipe;
        beforeEach(() => {
            pipe = createPipe('short', 'en-US');
        });
        it('should return time difference for a given date', () => {
            const date = pipe.getCurrentDateTime();
            expect(pipe.transform(date)).toBe('less than a minute ago');
        });

        it('should return exact date if given date is more than seven days for en locale ', () => {
            const date = new Date('1990-11-04T15:25:42.749');

            expect(pipe.transform(date)).toBe('11/4/90, 3:25 PM');
        });

        it('should return empty string if given date is empty', () => {
            expect(pipe.transform(null)).toBe('');
            expect(pipe.transform(undefined)).toBe('');
        });

        it('should use locale argument over user preference locale', () => {
            const oldDate = new Date('2026-03-01T10:00:00.000Z');
            const result = pipe.transform(oldDate, 'de');

            expect(result).toBe('01.03.26, 10:00');
        });
    });

    describe('AppConfigService has no value and returns default short and locale="de" ', () => {
        let pipe: TimeAgoPipe;
        beforeEach(() => {
            pipe = createPipe('short', 'de');
        });
        it('should return time difference for a given date', () => {
            const date = pipe.getCurrentDateTime();
            expect(pipe.transform(date)).toBe('vor weniger als 1 Minute');
        });

        it('should return exact date if given date is more than seven days for de locale ', () => {
            const date = new Date('1990-11-04T15:25:42.749');
            expect(pipe.transform(date)).toBe('04.11.90, 15:25');
        });

        it('should return empty string if given date is empty', () => {
            expect(pipe.transform(null)).toBe('');
            expect(pipe.transform(undefined)).toBe('');
        });

        it('should use locale argument over user preference locale', () => {
            const oldDate = new Date('2026-03-01T10:00:00.000Z');
            const result = pipe.transform(oldDate, 'en-US');

            expect(result).toBe('3/1/26, 10:00 AM');
        });
    });

    describe('locale handling', () => {
        let pipe: TimeAgoPipe;
        beforeEach(() => {
            pipe = createPipe('short', undefined);
        });
        it('should return localized relative message when locale argument is provided', () => {
            const date = new Date(NOW);
            const result = pipe.transform(date, 'de');
            const expected = formatDistance(date, NOW, {
                addSuffix: true,
                locale: DateFnsUtils.getLocaleFromString('de')
            });
            expect(result).toBe(expected);
        });

        it('should fall back to DEFAULT_LOCALE when user preference locale is empty', () => {
            const oldDate = new Date('2026-03-01T10:00:00.000Z');
            const result = pipe.transform(oldDate);
            const expected = new DatePipe('en-US').transform(oldDate, 'short');

            expect(result).toBe(expected);
        });
    });
});
