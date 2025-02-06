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

import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export const FeaturesServiceConfigToken = new InjectionToken<any>('FeatureServiceConfigToken');
export const FeaturesServiceToken = new InjectionToken<IFeaturesService>('FeaturesService');
export const WritableFeaturesServiceToken = new InjectionToken<IFeaturesService & IWritableFeaturesService>('WritableFeaturesServiceToken');
export const WritableFeaturesServiceConfigToken = new InjectionToken<WritableFeaturesServiceConfig>('WritableFeaturesServiceConfigToken');
export const OverridableFeaturesServiceToken = new InjectionToken<IFeaturesService>('OverridableFeaturesServiceToken');
export const FlagsOverrideToken = new InjectionToken<boolean>('FlagsOverrideToken');

export interface WritableFeaturesServiceConfig {
    storageKey?: string;
}
export interface QaFeaturesHelperConfig {
    helperExposeKeyOnDocument?: string;
}

export interface FlagChangeset {
    [key: string]: {
        current: any;
        previous: any;
    };
}

export interface WritableFlagChangeset {
    [key: string]: {
        current: any;
        previous: any;
        fictive?: boolean;
    };
}

export interface FlagSet {
    [key: string]: any;
}

export interface IFeaturesService<T = FlagChangeset> {
    init(): Observable<T>;
    isOn$(key: string): Observable<boolean>;
    isOff$(key: string): Observable<boolean>;
    getFlags$(): Observable<T>;
}

export interface IWritableFeaturesService {
    setFlag(key: string, value: any): void;
    resetFlags(flags: FlagSet): void;
    removeFlag(key: string): void;
    mergeFlags(flags: FlagChangeset): void;
}

export type IDebugFeaturesService = Omit<IFeaturesService<WritableFlagChangeset>, 'init'> & {
    enable(on: boolean): void;
    isEnabled$(): Observable<boolean>;
    resetFlags(flags: FlagSet): void;
};
