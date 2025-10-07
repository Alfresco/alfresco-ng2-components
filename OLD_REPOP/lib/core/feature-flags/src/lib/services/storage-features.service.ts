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
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import {
    FlagChangeset,
    IFeaturesService,
    FlagSet,
    IWritableFeaturesService,
    WritableFeaturesServiceConfigToken,
    WritableFlagChangeset,
    WritableFeaturesServiceConfig
} from '../interfaces/features.interface';
import { FlagSetParser } from './flagset.parser';

@Injectable({ providedIn: 'root' })
export class StorageFeaturesService implements IFeaturesService, IWritableFeaturesService {
    private currentFlagState: WritableFlagChangeset = {};
    private readonly flags = new BehaviorSubject<WritableFlagChangeset>({});
    private readonly flags$ = this.flags.asObservable();
    private readonly initSubject = new BehaviorSubject<boolean>(false);

    constructor(@Optional() @Inject(WritableFeaturesServiceConfigToken) private config?: WritableFeaturesServiceConfig) {
        combineLatest({
            flags: this.flags,
            init: this.waitForInitializationToFinish()
        }).subscribe(({ flags }) => {
            this.currentFlagState = flags;
            sessionStorage.setItem(this.storageKey, JSON.stringify(FlagSetParser.serialize(flags)));
        });
    }

    get storageKey(): string {
        return this.config?.storageKey || 'feature-flags';
    }

    init(): Observable<WritableFlagChangeset> {
        const storedFlags = JSON.parse(sessionStorage.getItem(this.storageKey) || '{}');
        const initialFlagChangeSet = FlagSetParser.deserialize(storedFlags);
        this.flags.next(initialFlagChangeSet);
        this.initSubject.next(true);
        return of(initialFlagChangeSet);
    }

    isOn$(key: string): Observable<boolean> {
        return this.flags$.pipe(map((flags) => !!flags[key]?.current));
    }

    isOff$(key: string): Observable<boolean> {
        return this.flags$.pipe(map((flags) => !flags[key]?.current));
    }

    getFlags$(): Observable<WritableFlagChangeset> {
        return this.flags$;
    }

    setFlag(key: string, value: any): void {
        let fictive = {};
        if (!this.currentFlagState[key]) {
            fictive = { fictive: true };
        } else {
            fictive = this.currentFlagState[key]?.fictive ? { fictive: true } : {};
        }

        this.flags.next({
            ...this.currentFlagState,
            [key]: {
                current: value,
                previous: this.currentFlagState[key]?.current ?? null,
                ...fictive
            }
        });
    }

    removeFlag(key: string): void {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [key]: _, ...flags } = this.currentFlagState;
        this.flags.next(flags);
    }

    resetFlags(flags: FlagSet): void {
        this.flags.next(
            Object.keys(flags).reduce(
                (acc, key) => ({
                    ...acc,
                    [key]: {
                        current: flags[key],
                        previous: null,
                        fictive: true
                    }
                }),
                {}
            )
        );
    }

    mergeFlags(flags: FlagChangeset): void {
        const mergedFlags: WritableFlagChangeset = Object.keys(flags).reduce((acc, key) => {
            const current = this.currentFlagState[key]?.current;
            return {
                ...acc,
                [key]: {
                    current: current ?? flags[key].current,
                    previous: current ?? null
                }
            };
        }, {});

        Object.keys(this.currentFlagState)
            .filter((key) => !flags[key])
            .forEach((key) => {
                mergedFlags[key] = {
                    current: this.currentFlagState[key].current,
                    previous: this.currentFlagState[key].previous,
                    fictive: true
                };
            });

        this.flags.next(mergedFlags);
    }

    private waitForInitializationToFinish(): Observable<boolean> {
        return this.initSubject.pipe(filter((initialized) => !!initialized));
    }
}
