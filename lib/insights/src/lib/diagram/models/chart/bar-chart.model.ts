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

import { Chart } from './chart.model';
import { format } from 'date-fns';

export class BarChart extends Chart {
    xAxisType: string;
    yAxisType: string;
    options: any = {
        responsive: true,
        scales: {
            yAxes: [
                {
                    ticks: {
                        beginAtZero: true,
                        stepSize: 1
                    }
                }
            ],
            xAxes: [
                {
                    ticks: {},
                    stacked: false
                }
            ]
        }
    };

    constructor(obj?: any) {
        super(obj);
        this.xAxisType = obj?.xAxisType || null;
        this.yAxisType = obj?.yAxisType || null;
        this.options.scales.xAxes[0].ticks.callback = this.xAxisTickFormatFunction(this.xAxisType);
        this.options.scales.yAxes[0].ticks.callback = this.yAxisTickFormatFunction(this.yAxisType);
        if (obj.values) {
            obj.values.forEach((params: any) => {
                const dataValue = [];
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
                    this.datasets.push({ data: dataValue, label: params.key });
                }
            });
        }
    }

    xAxisTickFormatFunction(xAxisType: string) {
        return (value: string) => {
            if (xAxisType) {
                if ('date_day' === xAxisType) {
                    return format(new Date(value), 'dd');
                } else if ('date_month' === xAxisType) {
                    return format(new Date(value), 'MMMM');
                } else if ('date_year' === xAxisType) {
                    return format(new Date(value), 'yyyy');
                }
            }
            return value;
        };
    }

    yAxisTickFormatFunction(yAxisType: string) {
        return (value: string) => {
            if (yAxisType) {
                if ('count' === yAxisType) {
                    const label = '' + value;
                    if (label.indexOf('.') !== -1) {
                        return '';
                    }
                }
            }
            return value;
        };
    }
}
