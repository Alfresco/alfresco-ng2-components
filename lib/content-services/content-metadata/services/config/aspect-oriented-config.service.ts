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
import { ContentMetadataConfig, AspectOrientedConfig } from '../../interfaces/content-metadata.interfaces';

@Injectable()
export class AspectOrientedConfigService implements ContentMetadataConfig {

    constructor(private config: AspectOrientedConfig) {}

    public isGroupAllowed(groupName: string): boolean {
        const groupNames = Object.keys(this.config);
        return groupNames.indexOf(groupName) !== -1;
    }

    public isPropertyAllowed(groupName: string, propertyName: string): boolean {
        if (this.isEveryPropertyAllowedFor(groupName)) {
            return true;
        }

        if (this.config[groupName]) {
            return this.config[groupName].indexOf(propertyName) !== -1;
        }

        return false;
    }

    private isEveryPropertyAllowedFor(groupName: string): boolean {
        const allowedProperties = this.config[groupName];
        return typeof allowedProperties === 'string' && allowedProperties === '*';
    }
}
