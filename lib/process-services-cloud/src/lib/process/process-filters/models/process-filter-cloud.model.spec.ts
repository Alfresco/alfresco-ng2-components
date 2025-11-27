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

import { DateCloudFilterType } from '../../../models/date-cloud-filter.model';
import { ProcessFilterCloudModel } from './process-filter-cloud.model';
import { endOfDay, startOfDay } from 'date-fns';

describe('ProcessFilterCloudModel', () => {
    it('should use appVersion from the provided object', () => {
        const model = new ProcessFilterCloudModel({ appVersion: 1 });

        expect(model.appVersion).toBe(1);
    });

    it('should use appVersionMultiple if provided', () => {
        const model = new ProcessFilterCloudModel({ appVersionMultiple: [1, 2] });

        expect(model.appVersion).toEqual([1, 2]);
    });

    it('should use appVersionMultiple over the appVersion if both provided', () => {
        const model = new ProcessFilterCloudModel({ appVersion: 1, appVersionMultiple: [1, 2] });

        expect(model.appVersion).toEqual([1, 2]);
    });

    it('should get suspended start and end date if date type is today', () => {
        const date = new Date();
        const model = new ProcessFilterCloudModel({
            suspendedDateType: DateCloudFilterType.TODAY
        });

        expect(model.suspendedFrom).toEqual(startOfDay(date).toISOString());
        expect(model.suspendedTo).toEqual(endOfDay(date).toISOString());
    });

    it('should get completed date start and end date if date type is today', () => {
        const date = new Date();
        const model = new ProcessFilterCloudModel({
            completedDateType: DateCloudFilterType.TODAY
        });
        expect(model.completedFrom).toEqual(startOfDay(date).toISOString());
        expect(model.completedTo).toEqual(endOfDay(date).toISOString());
    });

    it('should get started date start and end date if date type is today', () => {
        const date = new Date();
        const model = new ProcessFilterCloudModel({
            startedDateType: DateCloudFilterType.TODAY
        });
        expect(model.startFrom).toEqual(startOfDay(date).toISOString());
        expect(model.startTo).toEqual(endOfDay(date).toISOString());
    });

    it('should assign value to the excludeByProcessCategoryName if provided', () => {
        const model = new ProcessFilterCloudModel({ excludeByProcessCategoryName: 'test' });
        expect(model.excludeByProcessCategoryName).toBe('test');
    });

    it('should assign null to the excludeByProcessCategoryName if value not provided', () => {
        const model = new ProcessFilterCloudModel({});
        expect(model.excludeByProcessCategoryName).toBeNull();
    });
});
