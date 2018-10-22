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
import { AspectOrientedConfigService } from './aspect-oriented-config.service';
import { IndifferentConfigService } from './indifferent-config.service';
import { LayoutOrientedConfigService } from './layout-oriented-config.service';
import {
    PresetConfig,
    ContentMetadataConfig,
    AspectOrientedConfig,
    InDifferentConfig,
    LayoutOrientedConfig
} from '../../interfaces/content-metadata.interfaces';

@Injectable({
    providedIn: 'root'
})
export class ContentMetadataConfigFactory {

    static readonly INDIFFERENT_PRESET = '*';
    static readonly DEFAULT_PRESET_NAME = 'default';

    constructor(private appConfigService: AppConfigService, private logService: LogService) {}

    public get(presetName: string = 'default'): ContentMetadataConfig {
        let presetConfig;
        try {
            presetConfig = this.appConfigService.config['content-metadata'].presets[presetName];
        } catch {
            if (presetName !== ContentMetadataConfigFactory.DEFAULT_PRESET_NAME) {
                this.logService.error(`No content-metadata preset for: ${presetName}`);
            }
            presetConfig = ContentMetadataConfigFactory.INDIFFERENT_PRESET;
        }

        return this.createConfig(presetConfig);
    }

    private createConfig(presetConfig: PresetConfig): ContentMetadataConfig {
        let config: ContentMetadataConfig;

        if (this.isLayoutOrientedPreset(presetConfig)) {
            config = new LayoutOrientedConfigService(<LayoutOrientedConfig> presetConfig);
        } else if (this.isAspectOrientedPreset(presetConfig)) {
            config = new AspectOrientedConfigService(<AspectOrientedConfig> presetConfig);
        } else {
            config = new IndifferentConfigService(<InDifferentConfig> presetConfig);
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

    private isObject(x) {
        return x != null && typeof x === 'object';
    }
}
