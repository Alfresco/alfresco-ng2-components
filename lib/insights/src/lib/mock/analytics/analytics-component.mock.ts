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

export const chartProcessDefOverview = {
    elements: [{
        id: 'id1585876275153',
        type: 'table',
        rows: [
            ['__KEY_REPORTING.DEFAULT-REPORTS.PROCESS-DEFINITION-OVERVIEW.GENERAL-TABLE-TOTAL-PROCESS-DEFINITIONS', '9'],
            ['__KEY_REPORTING.DEFAULT-REPORTS.PROCESS-DEFINITION-OVERVIEW.GENERAL-TABLE-TOTAL-PROCESS-INSTANCES', '41'],
            ['__KEY_REPORTING.DEFAULT-REPORTS.PROCESS-DEFINITION-OVERVIEW.GENERAL-TABLE-ACTIVE-PROCESS-INSTANCES', '3'],
            ['__KEY_REPORTING.DEFAULT-REPORTS.PROCESS-DEFINITION-OVERVIEW.GENERAL-TABLE-COMPLETED-PROCESS-INSTANCES', '38']
        ]
    }, {
        id: 'id1585876413072',
        type: 'pieChart',
        title: 'Total process instances overview',
        titleKey: 'REPORTING.DEFAULT-REPORTS.PROCESS-DEFINITION-OVERVIEW.PROC-INST-CHART-TITLE',
        values: [{
            key: 'Second Process',
            y: 4,
            keyAndValue: ['Second Process', '4']
        }, {
            key: 'Simple process',
            y: 30,
            keyAndValue: ['Simple process', '30']
        }, {
            key: 'Third Process',
            y: 7,
            keyAndValue: ['Third Process', '7']
        }]
    }, {
        id: 'id1585877659181',
        type: 'table',
        title: 'Process definition details',
        titleKey: 'REPORTING.DEFAULT-REPORTS.PROCESS-DEFINITION-OVERVIEW.DETAIL-TABLE',
        columnNames: ['Process definition', 'Total', 'Active', 'Completed'],
        columnNameKeys: ['REPORTING.DEFAULT-REPORTS.PROCESS-DEFINITION-OVERVIEW.DETAIL-TABLE-PROCESS',
            'REPORTING.DEFAULT-REPORTS.PROCESS-DEFINITION-OVERVIEW.DETAIL-TABLE-TOTAL',
            'REPORTING.DEFAULT-REPORTS.PROCESS-DEFINITION-OVERVIEW.DETAIL-TABLE-ACTIVE',
            'REPORTING.DEFAULT-REPORTS.PROCESS-DEFINITION-OVERVIEW.DETAIL-TABLE-COMPLETED'],
        columnsCentered: [false, false, false, false],
        rows: [
            ['Second Process', '4', '0', '4'],
            ['Simple process', '30', '3', '27'],
            ['Third Process', '7', '0', '7']
        ]
    }]
};

export const chartTaskOverview = {
    elements: [{
        id: 'id792351752194',
        type: 'barChart',
        title: 'title',
        titleKey: 'REPORTING.DEFAULT-REPORTS.TASK-OVERVIEW.TASK-HISTOGRAM-TITLE',
        values: [{
            key: 'series1',
            values: [['2016-09-30T00:00:00.000+0000', 3], ['2016-10-04T00:00:00.000+0000', 1]]
        }],
        xAxisType: 'date_month',
        yAxisType: 'count'
    }, {
        id: 'id792349721129',
        type: 'masterDetailTable',
        title: 'Detailed task statistics',
        titleKey: 'REPORTING.DEFAULT-REPORTS.TASK-OVERVIEW.DETAILED-TASK-STATS-TITLE',
        /* cspell:disable-next-line */
        columnNames: ['Task', 'Count', 'Sum', 'Min duration', 'Max duration', 'Average duration', 'Stddev duration'],
        columnNameKeys: [
            'REPORTING.DEFAULT-REPORTS.TASK-OVERVIEW.DETAILED-TASK-STATS-TASK',
            'REPORTING.DEFAULT-REPORTS.TASK-OVERVIEW.COUNT',
            'REPORTING.DEFAULT-REPORTS.TASK-OVERVIEW.SUM',
            'REPORTING.DEFAULT-REPORTS.TASK-OVERVIEW.MIN-DURATION',
            'REPORTING.DEFAULT-REPORTS.TASK-OVERVIEW.MAX-DURATION',
            'REPORTING.DEFAULT-REPORTS.TASK-OVERVIEW.AVERAGE',
            /* cspell:disable-next-line */
            'REPORTING.DEFAULT-REPORTS.TASK-OVERVIEW.STDDE'],
        columnsCentered: [false, false, false, false],
        rows: [
            ['fake 1 user task', '1', '2.0', '3.0', '4.0', '5.0', '6.0'],
            ['fake 2 user task', '1', '2.0', '3.0', '4.0', '5.0', '6.0']
        ]
    }, {
        id: 'id10931125229538',
        type: 'multiBarChart',
        title: 'Task duration',
        titleKey: 'REPORTING.DEFAULT-REPORTS.TASK-OVERVIEW.TASK-DURATIONS-TITLE',
        values: [{
            key: 'averages',
            values: [[1, 0], [2, 5], [3, 2]]
        }, {
            key: 'minima',
            values: [[1, 0], [2, 0], [3, 0]]
        }, {
            key: 'maxima',
            values: [[1, 0], [2, 29], [3, 29]]
        }],
        yAxisType: 'count'
    }]
};
