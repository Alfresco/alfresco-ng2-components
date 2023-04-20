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
import { ACTIVITY_FILL_COLOR, COMPLETED_COLOR, CURRENT_COLOR } from '../constants/diagram-colors';

const TASK_STROKE = 1;
const TASK_HIGHLIGHT_STROKE = 2;

@Injectable({ providedIn: 'root' })
export class DiagramColorService {
    totalColors: any;

    setTotalColors(totalColors: any) {
        this.totalColors = totalColors;
    }

    getFillOpacity(): string {
        return '0.6';
    }

    getFillColour(key: string) {
        if (this.totalColors && this.totalColors.hasOwnProperty(key)) {
            const colorPercentage = this.totalColors[key];
            return this.convertColorToHsb(colorPercentage);
        } else {
            return ACTIVITY_FILL_COLOR;
        }
    }

    getBpmnColor(data: any, defaultColor: any) {
        if (data.current) {
            return CURRENT_COLOR;
        } else if (data.completed) {
            return COMPLETED_COLOR;
        } else {
            return defaultColor;
        }
    }

    getBpmnStrokeWidth(data: any) {
        if (data.current || data.completed) {
            return TASK_HIGHLIGHT_STROKE;
        } else {
            return TASK_STROKE;
        }
    }

    convertColorToHsb(colorPercentage: number): string {
        const hue = (120.0 - (colorPercentage * 1.2)) / 360.0;
        return 'hsb(' + hue + ', 1, 1)';
    }
}
