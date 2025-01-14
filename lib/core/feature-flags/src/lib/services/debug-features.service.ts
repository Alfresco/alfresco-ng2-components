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

import { Inject, Injectable, Optional } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';
import {
    IDebugFeaturesService,
    IFeaturesService,
    FlagChangeset,
    OverridableFeaturesServiceToken,
    WritableFeaturesServiceToken,
    WritableFeaturesServiceConfigToken,
    WritableFeaturesServiceConfig,
    FlagSet,
    IWritableFeaturesService
} from '../interfaces/features.interface';

@Injectable()
export class DebugFeaturesService implements IDebugFeaturesService {
    private readonly isInDebugModeSubject = new BehaviorSubject<boolean>(false);
    private readonly isInDebugMode$ = this.isInDebugModeSubject.asObservable();
    private readonly initSubject = new BehaviorSubject<boolean>(false);

    get storageKey(): string {
        return `${this.config?.storageKey || 'feature-flags'}-override`;
    }

    constructor(
        @Inject(OverridableFeaturesServiceToken) private overriddenFeaturesService: IFeaturesService,
        @Inject(WritableFeaturesServiceToken) private writableFeaturesService: IFeaturesService & IWritableFeaturesService,
        @Optional() @Inject(WritableFeaturesServiceConfigToken) private config?: WritableFeaturesServiceConfig
    ) {
        this.init();

        combineLatest({
            debugMode: this.isInDebugModeSubject,
            init: this.waitForInitializationToFinish()
        }).subscribe(({ debugMode }) => {
            sessionStorage.setItem(this.storageKey, JSON.stringify(debugMode));
        });
    }

    isOn$(key: string): Observable<boolean> {
        return this.isInDebugMode$.pipe(
            switchMap((isInDebugMode) => (isInDebugMode ? this.writableFeaturesService : this.overriddenFeaturesService).isOn$(key))
        );
    }

    isOff$(key: string): Observable<boolean> {
        return this.isInDebugMode$.pipe(
            switchMap((isInDebugMode) => (isInDebugMode ? this.writableFeaturesService : this.overriddenFeaturesService).isOff$(key))
        );
    }

    /**
     * Gets the flags as an observable.
     *
     * @returns the observable that emits the flag changeset.
     */
    getFlags$(): Observable<FlagChangeset> {
        return this.isInDebugMode$.pipe(
            switchMap((isInDebugMode) => (isInDebugMode ? this.writableFeaturesService : this.overriddenFeaturesService).getFlags$())
        );
    }

    /**
     * Resets the specified flags.
     *
     * @param flags The flags to reset.
     */
    resetFlags(flags: FlagSet): void {
        this.writableFeaturesService.resetFlags(flags);
    }

    enable(on: boolean): void {
        this.isInDebugModeSubject.next(on);
    }

    isEnabled$(): Observable<boolean> {
        return this.isInDebugMode$;
    }

    private init() {
        const storedOverride = JSON.parse(sessionStorage.getItem(this.storageKey) || 'false');
        this.isInDebugModeSubject.next(storedOverride);
        this.initSubject.next(true);
    }

    private waitForInitializationToFinish(): Observable<boolean> {
        return this.initSubject.pipe(filter((initialized) => !!initialized));
    }
}
