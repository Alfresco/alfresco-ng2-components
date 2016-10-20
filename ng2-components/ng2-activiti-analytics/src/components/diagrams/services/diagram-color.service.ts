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

@Injectable()
export class DiagramColorService {

    static CURRENT_COLOR = '#017501';
    static COMPLETED_COLOR = '#2632aa';
    static ACTIVITY_STROKE_COLOR = '#bbbbbb';

    static TASK_STROKE = '1';
    static TASK_HIGHLIGHT_STROKE = '2';

    totalColors: any;

    constructor() {
    }

    setTotalColors(totalColors) {
        this.totalColors = totalColors;
    }

    getFillOpacity(): string {
        return '0.6';
    }

    getFillColour(key: string) {
        if (this.totalColors.hasOwnProperty(key)) {
            let colorPercentage = this.totalColors[key];
            return this.convertColorToHsb(colorPercentage);
        }
    }

    getBpmnColor(data, defaultColor) {
        if (data.current) {
            return DiagramColorService.CURRENT_COLOR;
        } else if (data.completed) {
            return DiagramColorService.COMPLETED_COLOR;
        } else {
            return defaultColor;
        }
    }

    getBpmnStrokeWidth(data) {
        if (data.current || data.completed) {
            return DiagramColorService.TASK_HIGHLIGHT_STROKE;
        } else {
            return DiagramColorService.TASK_STROKE;
        }
    }

    convertColorToHsb(colorPercentage: number): string {
        let hue = (120.0 - (colorPercentage * 1.2)) / 360.0;
        return 'hsb(' + hue + ', 1, 1)';
    }
}
