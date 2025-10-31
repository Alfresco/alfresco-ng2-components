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

import { TestBed } from '@angular/core/testing';
import { QaFeaturesHelper } from './qa-features.helper';
import { FeaturesServiceToken } from '../interfaces/features.interface';
import { DebugFeaturesService } from './debug-features.service';
import { of } from 'rxjs';

describe('QaFeaturesHelper', () => {
    let qaHelper: QaFeaturesHelper;
    let mockDebugFeaturesService: jasmine.SpyObj<DebugFeaturesService>;

    beforeEach(() => {
        mockDebugFeaturesService = jasmine.createSpyObj('DebugFeaturesService', ['isOn$', 'resetFlags', 'enable', 'isEnabled$']);

        TestBed.configureTestingModule({
            providers: [QaFeaturesHelper, { provide: FeaturesServiceToken, useValue: mockDebugFeaturesService }]
        });

        qaHelper = TestBed.inject(QaFeaturesHelper);
    });

    it('should return true when feature is on', () => {
        mockDebugFeaturesService.isOn$.and.returnValue(of(true));

        const result = qaHelper.isOn('testFeature');

        expect(result).toBe(true);
        expect(mockDebugFeaturesService.isOn$).toHaveBeenCalledWith('testFeature');
    });

    it('should return false when feature is off', () => {
        mockDebugFeaturesService.isOn$.and.returnValue(of(false));

        const result = qaHelper.isOn('testFeature');

        expect(result).toBe(false);
        expect(mockDebugFeaturesService.isOn$).toHaveBeenCalledWith('testFeature');
    });

    it('should handle different feature keys', () => {
        mockDebugFeaturesService.isOn$.and.returnValue(of(true));

        qaHelper.isOn('feature1');
        qaHelper.isOn('feature2');

        expect(mockDebugFeaturesService.isOn$).toHaveBeenCalledWith('feature1');
        expect(mockDebugFeaturesService.isOn$).toHaveBeenCalledWith('feature2');
    });

    it('should reset flags and trigger application tick', () => {
        const flags = { feature1: true, feature2: false };

        qaHelper.resetFlags(flags);

        expect(mockDebugFeaturesService.resetFlags).toHaveBeenCalledWith(flags);
    });

    it('should reset flags with empty flags object', () => {
        const flags = {};

        qaHelper.resetFlags(flags);

        expect(mockDebugFeaturesService.resetFlags).toHaveBeenCalledWith(flags);
    });

    it('should reset flags with multiple flags', () => {
        const flags = {
            feature1: true,
            feature2: false,
            feature3: true,
            feature4: false
        };

        qaHelper.resetFlags(flags);

        expect(mockDebugFeaturesService.resetFlags).toHaveBeenCalledWith(flags);
    });

    it('should enable debug mode and trigger application tick', () => {
        qaHelper.enable();

        expect(mockDebugFeaturesService.enable).toHaveBeenCalledWith(true);
    });

    it('should disable debug mode and trigger application tick', () => {
        qaHelper.disable();

        expect(mockDebugFeaturesService.enable).toHaveBeenCalledWith(false);
    });

    it('should return true when debug mode is enabled', () => {
        mockDebugFeaturesService.isEnabled$.and.returnValue(of(true));

        const result = qaHelper.isEnabled();

        expect(result).toBe(true);
        expect(mockDebugFeaturesService.isEnabled$).toHaveBeenCalled();
    });

    it('should return false when debug mode is disabled', () => {
        mockDebugFeaturesService.isEnabled$.and.returnValue(of(false));

        const result = qaHelper.isEnabled();

        expect(result).toBe(false);
        expect(mockDebugFeaturesService.isEnabled$).toHaveBeenCalled();
    });

    it('should allow toggling debug mode and checking status', () => {
        mockDebugFeaturesService.isEnabled$.and.returnValue(of(false));
        expect(qaHelper.isEnabled()).toBe(false);

        qaHelper.enable();
        expect(mockDebugFeaturesService.enable).toHaveBeenCalledWith(true);

        mockDebugFeaturesService.isEnabled$.and.returnValue(of(true));
        expect(qaHelper.isEnabled()).toBe(true);

        qaHelper.disable();
        expect(mockDebugFeaturesService.enable).toHaveBeenCalledWith(false);
    });

    it('should allow checking and resetting flags', () => {
        mockDebugFeaturesService.isOn$.and.returnValue(of(true));
        expect(qaHelper.isOn('feature1')).toBe(true);

        const newFlags = { feature1: false, feature2: true };
        qaHelper.resetFlags(newFlags);

        expect(mockDebugFeaturesService.resetFlags).toHaveBeenCalledWith(newFlags);
    });
});
