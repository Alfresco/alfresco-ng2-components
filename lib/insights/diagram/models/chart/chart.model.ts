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

export class Chart {
    id: string;
    type: string;
    icon: string;

    constructor(obj?: any) {
        this.id = obj && obj.id || null;
        if (obj && obj.type) {
            this.type = this.convertType(obj.type);
            this.icon = this.getIconType(this.type);
        }
    }

    private convertType(type: string) {
        let chartType = '';
        switch (type) {
            case 'pieChart':
                chartType = 'pie';
                break;
            case 'table':
                chartType = 'table';
                break;
            case 'line':
                chartType = 'line';
                break;
            case 'barChart':
                chartType = 'bar';
                break;
            case 'multiBarChart':
                chartType = 'multiBar';
                break;
            case 'processDefinitionHeatMap':
                chartType = 'HeatMap';
                break;
            case 'masterDetailTable':
                chartType = 'masterDetailTable';
                break;
            default:
                chartType = 'table';
                break;
        }
        return chartType;
    }

    private getIconType(type: string): string {
        let typeIcon: string = '';
        switch (type) {
            case 'pie':
                typeIcon = 'pie_chart';
                break;
            case 'table':
                typeIcon = 'web';
                break;
            case 'line':
                typeIcon = 'show_chart';
                break;
            case 'bar':
                typeIcon = 'equalizer';
                break;
            case 'multiBar':
                typeIcon = 'poll';
                break;
            case 'HeatMap':
                typeIcon = 'share';
                break;
            case 'masterDetailTable':
                typeIcon = 'subtitles';
                break;
            default:
                typeIcon = 'web';
                break;
        }
        return typeIcon;
    }
}
