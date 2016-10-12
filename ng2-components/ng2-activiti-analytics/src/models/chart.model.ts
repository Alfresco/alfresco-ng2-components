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

    constructor(obj?: any) {
        this.id = obj && obj.id || null;
        if (obj && obj.type) {
            this.type = this.convertType(obj.type);
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
            default:
                chartType = 'table';
                break;
        }
        return chartType;
    }
}

export class LineChart extends Chart {
    title: string;
    titleKey: string;
    labels: string[] = [];
    datasets: any[] = [];

    constructor(obj?: any) {
        super(obj);
        this.title = obj && obj.title || null;
        this.titleKey = obj && obj.titleKey || null;
        this.labels = obj && obj.columnNames.slice(1, obj.columnNames.length);

        obj.rows.forEach((value: any) => {
            this.datasets.push({data: value.slice(1, value.length), label: value[0]});
        });
    }
}

export class BarChart extends Chart {
    title: string;
    titleKey: string;
    labels: string[] = [];
    datasets: any[] = [];
    data: any[] = [];
    options: any = {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                    stepSize: 1
                }
            }]
        }
    };

    constructor(obj?: any) {
        super(obj);
        this.title = obj && obj.title || null;
        this.titleKey = obj && obj.titleKey || null;
        obj.values.forEach((params: any) => {
            let dataValue = [];
            params.values.forEach((info: any) => {
                info.forEach((value: any, index: any) => {
                    if (index % 2 === 0) {
                        this.labels.push(value);
                    } else {
                        dataValue.push(value);
                    }
                });
            });
            this.datasets.push({data: dataValue, label: params.key});

        });
    }
}

export class TableChart extends Chart {
    title: string;
    titleKey: string;
    labels: string[] = [];
    datasets: any[] = [];

    constructor(obj?: any) {
        super(obj);
        this.title = obj && obj.title || null;
        this.titleKey = obj && obj.titleKey || null;
        this.labels = obj && obj.columnNames;
        this.datasets = obj && obj.rows;
    }
}

export class HeatMapChart extends Chart {
    title: string;
    titleKey: string;
    labels: string[] = [];
    datasets: any[] = [];

    constructor(obj?: any) {
        super(obj);
        this.title = obj && obj.title || null;
        this.titleKey = obj && obj.titleKey || null;
        this.labels = obj && obj.columnNames;
        this.datasets = obj && obj.rows;
    }
}

export class PieChart extends Chart {
    title: string;
    titleKey: string;
    labels: string[] = [];
    data: string[] = [];

    constructor(obj?: any) {
        super(obj);
        this.title = obj && obj.title || null;
        this.titleKey = obj && obj.titleKey || null;
        if (obj.values) {
            obj.values.forEach((value: any) => {
                this.add(value.key, value.y);
            });
        }
    }

    add(label: string, data: string) {
        this.labels.push(label);
        this.data.push(data);
    }
}
