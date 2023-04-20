/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { AspectOrientedConfigService } from './aspect-oriented-config.service';
import { IndifferentConfigService } from './indifferent-config.service';
import { LayoutOrientedConfigService } from './layout-oriented-config.service';
import { PresetConfig, ContentMetadataConfig } from '../../interfaces/content-metadata.interfaces';

const INDIFFERENT_PRESET = '*';
const DEFAULT_PRESET_NAME = 'default';

@Injectable({
    providedIn: 'root'
})
export class ContentMetadataConfigFactory {
    constructor(private appConfigService: AppConfigService, private logService: LogService) {}

    public get(presetName: string = 'default'): ContentMetadataConfig {
        let presetConfig: PresetConfig;
        try {
            presetConfig = this.appConfigService.config['content-metadata'].presets[presetName];
        } catch {
            if (presetName !== DEFAULT_PRESET_NAME) {
                this.logService.error(`No content-metadata preset for: ${presetName}`);
            }
            presetConfig = INDIFFERENT_PRESET;
        }

        return this.createConfig(presetConfig);
    }

    public createConfig(presetConfig: PresetConfig): ContentMetadataConfig {
        let config: ContentMetadataConfig;

        if (this.isLayoutOrientedPreset(presetConfig)) {
            config = new LayoutOrientedConfigService(presetConfig);
        } else if (this.isAspectOrientedPreset(presetConfig)) {
            config = new AspectOrientedConfigService(presetConfig);
        } else {
            config = new IndifferentConfigService();
        }

        Object.freeze(config);
        return config;
    }

    private isAspectOrientedPreset(presetConfig: PresetConfig): boolean {
        return this.isObject(presetConfig);
    }

    private isLayoutOrientedPreset(presetConfig: PresetConfig): boolean {
        return Array.isArray(presetConfig);
    }

    private isObject(x: any): boolean {
        return x != null && typeof x === 'object';
    }
}
