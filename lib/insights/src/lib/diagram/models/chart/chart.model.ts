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

export class Chart {
    id: string;
    type: string;
    icon: string;
    title?: string;
    titleKey?: string;
    labels?: string[] = [];
    data?: any[] = [];
    datasets?: any[] = [];
    detailsTable?: any;
    showDetails = false;
    options?: any;

    constructor(obj?: any) {
        this.id = obj && obj.id || null;
        this.title = obj.title;
        this.titleKey = obj.titleKey;
        this.labels = obj.labels || [];
        this.data = obj.data || [];
        this.datasets = obj.datasets || [];
        this.detailsTable = obj.detailsTable;
        this.showDetails = !!obj.showDetails;
        this.options = obj.options;

        if (obj && obj.type) {
            this.type = this.convertType(obj.type);
            this.icon = this.getIconType(this.type);
        }
    }

    hasData(): boolean {
        return this.data && this.data.length > 0;
    }

    hasDatasets(): boolean {
        return this.datasets && this.datasets.length > 0;
    }

    hasDetailsTable(): boolean {
        return !!this.detailsTable;
    }

    hasZeroValues(): boolean {
        let isZeroValues = false;

        if (this.hasData()) {
            isZeroValues = true;

            this.data.forEach((value) => {
                if (value.toString() !== '0') {
                    isZeroValues = false;
                }
            });
        }

        return isZeroValues;
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
