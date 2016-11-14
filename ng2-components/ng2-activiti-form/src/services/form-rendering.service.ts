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

import { Injectable, Type } from '@angular/core';

import { TextWidget } from './../components/widgets/text/text.widget';

@Injectable()
export class FormRenderingService {

    private types: { [key: string]: Type<{}> } = {
        'text': TextWidget
    };

    getComponentType(fieldType: string): Type<{}> {
        if (fieldType) {
            return this.types[fieldType] || null;
        }
        return null;
    }

    setComponentType(fieldType: string, componentType: Type<{}>, override: boolean = false) {
        if (!fieldType) {
            throw new Error(`fieldType is null or not defined`);
        }

        if (!componentType) {
            throw new Error(`componentType is null or not defined`);
        }

        let existing = this.types[fieldType];
        if (existing && !override) {
            throw new Error(`componentType is already mapped, use override option if you intend replacing existing mapping.`);
        }

        this.types[fieldType] = componentType;
    }

    constructor() {
        this.setComponentType('xx', TextWidget);
    }

}
