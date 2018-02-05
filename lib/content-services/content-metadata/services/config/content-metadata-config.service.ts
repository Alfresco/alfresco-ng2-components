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
import { CardViewGroup } from '../../interfaces/content-metadata.interfaces';
import { AspectOrientedConfigParserService } from './aspect-oriented-config-parser.service';
import { IndifferentConfigParserService } from './indifferent-config-parser.service';

export declare type InDifferentConfig = '*';
export declare type AspectOrientedConfig = any[];
export interface LayoutOrientedConfig {};
export declare type PresetConfig = InDifferentConfig | AspectOrientedConfig | LayoutOrientedConfig;

export interface ConfigParser {
    isGroupAllowed(config: PresetConfig, groupname: string): boolean;
    isPropertyAllowed(config: PresetConfig, groupName: string, propertyName: string): boolean;
}

@Injectable()
export class ContentMetadataConfigService {

    static readonly INDIFFERENT_PRESET = '*';
    static readonly DEFAULT_PRESET_NAME = 'default';

    presetConfig: PresetConfig;
    parser: ConfigParser;

    constructor(private aspectOrientedConfigParserService: AspectOrientedConfigParserService,
                private indifferentConfigParserService: IndifferentConfigParserService,
                private appConfigService: AppConfigService,
                private logService: LogService) {}

    public use(presetName: string) {
        try {
            const presetConfig = this.appConfigService.config['content-metadata'].presets[presetName];

            if (presetConfig) {
                this.presetConfig = presetConfig;
            } else if (presetName !== ContentMetadataConfigService.DEFAULT_PRESET_NAME) {
                const errorMessage = `No content-metadata preset for: ${presetName}`;
                this.logService.error(errorMessage);
                throw new Error(errorMessage);
            }
        } catch (e) {
            this.presetConfig = ContentMetadataConfigService.INDIFFERENT_PRESET;            
        }
        this.parser = this.getParser(this.presetConfig);
    }

    public isGroupAllowed(groupname: string): boolean {
        return this.parser.isGroupAllowed(this.presetConfig, groupname);
    }

    public isPropertyAllowed(groupName: string, propertyName: string): boolean {
        return this.parser.isPropertyAllowed(this.presetConfig, groupName, propertyName);
    }

    private getParser(preset): ConfigParser {
        if (this.isAspectOrientedPreset) {
            return this.aspectOrientedConfigParserService;
        } else if (this.isLayoutOrientedPreset) {
            return null;
        } else {
            return this.indifferentConfigParserService;
        }
    }

    private get isAspectOrientedPreset() {
        return this.isObject(this.presetConfig);
    }

    private get isLayoutOrientedPreset() {
        return Array.isArray(this.presetConfig);
    }

    private isObject(x) {
        return x != null && typeof x === 'object';
    }
}
