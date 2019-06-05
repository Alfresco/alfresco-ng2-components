/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

import { LocalizedDatePipe } from './localized-date.pipe';
import { async } from '@angular/core/testing';
import { AppConfigService } from '../app-config/app-config.service';

describe('LocalizedDatePipe', () => {

    let pipe: LocalizedDatePipe;

    beforeEach(async(() => {
        pipe = new LocalizedDatePipe(new AppConfigService(null));
    }));

    it('should return time with locale en-US', () => {
        const date = new Date('1990-11-03');
        expect(pipe.transform(date)).toBe('Nov 3, 1990, 12:00:00 AM');
    });

    it('should return correct date when formating and locating it', () => {
        const date = new Date();
        expect(new Date(pipe.transform(date)).toDateString()).toBe(date.toDateString());
    });

    it('should return formated time when a formar is given', () => {
        const date = new Date();
        expect(pipe.transform(date, 'MMM dd')).toBe('Jun 05');
    });

});
