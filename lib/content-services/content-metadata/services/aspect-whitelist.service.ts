/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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

import { Injectable } from '@angular/core';
import { AppConfigService, LogService } from '@alfresco/adf-core';

@Injectable()
export class AspectWhiteListService {

    static readonly DEFAULT_PRESET = '*';
    static readonly DEFAULT_PRESET_NAME = 'default';

    preset: object | string = AspectWhiteListService.DEFAULT_PRESET;

    constructor(private appConfigService: AppConfigService,
                private logService: LogService) {}

    public choosePreset(presetName: string) {
        try {
            const preset = this.appConfigService.config['content-metadata'].presets[presetName];

            if (preset) {
                this.preset = preset;
            } else if (presetName !== AspectWhiteListService.DEFAULT_PRESET_NAME) {
                this.logService.error(`No content-metadata preset for: ${presetName}`);
            }
        } catch (e) {
            this.preset = AspectWhiteListService.DEFAULT_PRESET;
        }
    }

    public isAspectAllowed(aspectName) {
        if (this.isEveryAspectAllowed) {
            return true;
        }

        const aspectNames = Object.keys(this.preset);
        return aspectNames.indexOf(aspectName) !== -1;
    }

    public isPropertyAllowed(aspectName, propertyName) {
        if (this.isEveryAspectAllowed || this.isEveryPropertyAllowedFor(aspectName)) {
            return true;
        }

        if (this.preset[aspectName]) {
            return this.preset[aspectName].indexOf(propertyName) !== -1;
        }

        return false;
    }

    private get isEveryAspectAllowed(): boolean {
        return typeof this.preset === 'string' && this.preset === AspectWhiteListService.DEFAULT_PRESET;
    }

    private isEveryPropertyAllowedFor(aspectName): boolean {
        const whitedListedProperties = this.preset[aspectName];
        return typeof whitedListedProperties === 'string' && whitedListedProperties === AspectWhiteListService.DEFAULT_PRESET;
    }
}
