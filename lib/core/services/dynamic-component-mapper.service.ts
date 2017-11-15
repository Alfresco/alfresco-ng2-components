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

import { Type } from '@angular/core';

export interface DynamicComponentModel { type: string; }
export type DynamicComponentResolveFunction = (model: DynamicComponentModel) => Type<{}>;
export class DynamicComponentResolver {
    static fromType(type: Type<{}>): DynamicComponentResolveFunction {
        return (model: DynamicComponentModel) => {
            return type;
        };
    }
}

export abstract class DynamicComponentMapper {

    protected defaultValue: Type<{}> = undefined;
    protected types: { [key: string]: DynamicComponentResolveFunction } = {};

    getComponentTypeResolver(type: string, defaultValue: Type<{}> = this.defaultValue): DynamicComponentResolveFunction {
        if (type) {
            return this.types[type] || DynamicComponentResolver.fromType(defaultValue);
        }
        return DynamicComponentResolver.fromType(defaultValue);
    }

    setComponentTypeResolver(type: string, resolver: DynamicComponentResolveFunction, override: boolean = false) {
        if (!type) {
            throw new Error(`type is null or not defined`);
        }

        if (!resolver) {
            throw new Error(`resolver is null or not defined`);
        }

        let existing = this.types[type];
        if (existing && !override) {
            throw new Error(`already mapped, use override option if you intend replacing existing mapping.`);
        }

        this.types[type] = resolver;
    }

    resolveComponentType(model: DynamicComponentModel, defaultValue: Type<{}> = this.defaultValue): Type<{}> {
        if (model) {
            let resolver = this.getComponentTypeResolver(model.type, defaultValue);
            return resolver(model);
        }
        return defaultValue;
    }
}
