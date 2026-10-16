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

import { DateAdapter } from '@angular/material/core';
import { isDate, isValid } from 'date-fns';

/**
 * Reads what the user typed into a picker input. Empty text is no value; text the adapter can't parse becomes an
 * invalid date, so the field reports it rather than silently clearing.
 *
 * @param adapter the picker's date adapter
 * @param text the input's text
 * @param parseFormat the format to parse the text with
 * @returns the typed value
 */
export const typedPickerValue = (adapter: DateAdapter<Date>, text: string, parseFormat: string): Date | null => {
    if (!text.trim()) {
        return null;
    }
    const parsed = adapter.parse(text, parseFormat);
    return parsed && adapter.isValid(parsed) ? parsed : new Date(NaN);
};

/**
 * Returns the value a picker can show: a valid date, or `null` for anything else.
 *
 * @param value the field value
 * @returns the date to show
 */
export const pickerDate = (value: unknown): Date | null => (isDate(value) && isValid(value) ? (value as Date) : null);

/**
 * Combines a day and a time of day into one value. A time without a day, or an unparseable part, is an invalid date;
 * a day without a time is its midnight.
 *
 * @param day the day, `null` when empty
 * @param time the time of day, `null` when empty
 * @returns the combined value, `null` when both are empty
 */
export const combinedDateTime = (day: Date | null, time: Date | null): Date | null => {
    if (!day && !time) {
        return null;
    }
    if (!pickerDate(day) || (time && !pickerDate(time))) {
        return new Date(NaN);
    }
    const combined = new Date(day);
    combined.setHours(time?.getHours() ?? 0, time?.getMinutes() ?? 0, 0, 0);
    return combined;
};
