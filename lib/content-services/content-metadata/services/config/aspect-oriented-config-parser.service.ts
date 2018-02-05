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
import { AspectOrientedConfig, ConfigParser } from './content-metadata-config.service';

@Injectable()
export class AspectOrientedConfigParserService implements ConfigParser {

    public isGroupAllowed(config: AspectOrientedConfig, groupName: string) {
        const groupNames = Object.keys(config);
        return groupNames.indexOf(groupName) !== -1;
    }

    public isPropertyAllowed(config: AspectOrientedConfig, groupName: string, propertyName: string) {
        if (this.isEveryPropertyAllowedFor(config, groupName)) {
            return true;
        }

        if (config[groupName]) {
            return config[groupName].indexOf(propertyName) !== -1;
        }

        return false;
    }

    private isEveryPropertyAllowedFor(preset: AspectOrientedConfig, groupName: string): boolean {
        const allowedProperties = preset[groupName];
        return typeof allowedProperties === 'string' && allowedProperties === '*';
    }
}
