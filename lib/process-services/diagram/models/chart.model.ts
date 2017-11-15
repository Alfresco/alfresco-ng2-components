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

import * as moment from 'moment';

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
    labels: any = [];
    datasets: any[] = [];
    data: any[] = [];
    xAxisType: string;
    yAxisType: string;
    options: any = {
        responsive: true,
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                    stepSize: 1
                }
            }],
            xAxes: [{
                ticks: {
                },
                stacked: false
            }]
        }
    };

    constructor(obj?: any) {
        super(obj);
        this.title = obj && obj.title || null;
        this.titleKey = obj && obj.titleKey || null;
        this.xAxisType = obj && obj.xAxisType || null;
        this.yAxisType = obj && obj.yAxisType || null;
        this.options.scales.xAxes[0].ticks.callback = this.xAxisTickFormatFunction(this.xAxisType);
        this.options.scales.yAxes[0].ticks.callback = this.yAxisTickFormatFunction(this.yAxisType);
        if (obj.values) {
            obj.values.forEach((params: any) => {
                let dataValue = [];
                params.values.forEach((info: any) => {
                    info.forEach((value: any, index: any) => {
                        if (index % 2 === 0) {
                            if (!this.labels.includes(value)) {
                                this.labels.push(value);
                            }
                        } else {
                            dataValue.push(value);
                        }
                    });
                });
                if (dataValue && dataValue.length > 0) {
                    this.datasets.push({data: dataValue, label: params.key});
                }
            });
        }
    }

    xAxisTickFormatFunction = function (xAxisType) {
        return function (value) {
            if (xAxisType !== null && xAxisType !== undefined) {
                if ('date_day' === xAxisType) {
                    return moment(new Date(value)).format('DD');
                } else if ('date_month' === xAxisType) {
                    return moment(new Date(value)).format('MMMM');
                } else if ('date_year' === xAxisType) {
                    return moment(new Date(value)).format('YYYY');
                }
            }
            return value;
        };
    };

    yAxisTickFormatFunction = function (yAxisType) {
        return function (value) {
            if (yAxisType !== null && yAxisType !== undefined) {
                if ('count' === yAxisType) {
                    let label = '' + value;
                    if (label.indexOf('.') !== -1) {
                        return '';
                    }
                }
            }
            return value;
        };
    };

    hasDatasets() {
        return this.datasets && this.datasets.length > 0 ? true : false;
    }
}

export class MultiBarChart extends BarChart {

    constructor(obj?: any) {
        super(obj);
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
        if (obj.rows) {
            this.datasets = obj && obj.rows;
        }
    }

    hasDatasets() {
        return this.datasets && this.datasets.length > 0 ? true : false;
    }
}

export class DetailsTableChart extends TableChart {
    detailsTable: any;
    showDetails: boolean = false;

    constructor(obj?: any) {
        super(obj);
        if (obj.detailTables) {
            this.detailsTable = new TableChart(obj.detailTables[0]);
        }
    }

    hasDetailsTable() {
        return this.detailsTable ? true : false;
    }
}

export class HeatMapChart extends Chart {
    avgTimePercentages: string;
    avgTimeValues: string;
    processDefinitionId: string;
    titleKey: string;
    totalCountValues: string;
    totalCountsPercentages: string;
    totalTimePercentages: string;
    totalTimeValues: string;

    constructor(obj?: any) {
        super(obj);
        this.avgTimePercentages = obj && obj.avgTimePercentages || null;
        this.avgTimeValues = obj && obj.avgTimeValues || null;
        this.processDefinitionId = obj && obj.processDefinitionId || null;
        this.totalCountValues = obj && obj.totalCountValues || null;
        this.titleKey = obj && obj.titleKey || null;
        this.totalCountsPercentages = obj && obj.totalCountsPercentages || null;
        this.totalTimePercentages = obj && obj.totalTimePercentages || null;
        this.totalTimeValues = obj && obj.totalTimeValues || null;
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

    hasData(): boolean {
        return this.data && this.data.length > 0 ? true : false;
    }

    hasZeroValues(): boolean {
        let isZeroValues: boolean = false;
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
}
