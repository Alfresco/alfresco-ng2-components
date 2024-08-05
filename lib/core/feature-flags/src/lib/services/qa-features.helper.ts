/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { ApplicationRef, Inject, Injectable } from '@angular/core';
import { FeaturesServiceToken, FlagSet } from '../interfaces/features.interface';
import { DebugFeaturesService } from './debug-features.service';
@Injectable()
export class QaFeaturesHelper {
    constructor(private applicationRef: ApplicationRef, @Inject(FeaturesServiceToken) private debugFeaturesService: DebugFeaturesService) { /* empty */ }

    isOn(key: string): boolean {
        let isOn = false;
        this.debugFeaturesService.isOn$(key).subscribe((on) => {
            isOn = on;
        });

        return isOn;
    }

    resetFlags(flags: FlagSet): void {
        this.debugFeaturesService.resetFlags(flags);
        this.applicationRef.tick();
    }

    enable(): void {
        this.debugFeaturesService.enable(true);
        this.applicationRef.tick();
    }

    disable(): void {
        this.debugFeaturesService.enable(false);
        this.applicationRef.tick();
    }

    isEnabled(): boolean {
        let enabled = false;
        this.debugFeaturesService.isEnabled$().subscribe((isEnabled) => {
            enabled = isEnabled;
        });
        return enabled;
    }
}
