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

import { ReportParameterModel } from '../models/report.model';

export var reportDefParamStatus = {
    'id': 2005,
    'name': 'Fake Task overview status',
    'created': '2016-10-05T15:39:40.222+0000',
    'definition': '{ "parameters" :[{"id":"status","name":null,"nameKey":null,"type":"status","value":null,"dependsOn":null}]}'
};

export var reportDefParamNumber = {
    'id': 2005,
    'name': 'Fake Process instances overview',
    'created': '2016-10-05T15:39:40.222+0000',
    'definition': '{ "parameters"' +
    ' :[{"id":"slowProcessInstanceInteger","name":null,"nameKey":null,"type":"integer","value":10,"dependsOn":null}]}'
};

export var reportDefParamDuration = {
    'id': 2005,
    'name': 'Fake Task service level agreement',
    'created': '2016-10-05T15:39:40.222+0000',
    'definition': '{ "parameters"' +
    ' :[{"id":"duration","name":null,"nameKey":null,"type":"duration","value":null,"dependsOn":null}]}'
};

export var reportDefParamCheck = {
    'id': 2005,
    'name': 'Fake Task service level agreement',
    'created': '2016-10-05T15:39:40.222+0000',
    'definition': '{ "parameters"' +
    ' :[{"id":"typeFiltering","name":null,"nameKey":null,"type":"boolean","value":true,"dependsOn":null}]}'
};

export var reportDefParamDateRange = {
    'id': 2005,
    'name': 'Fake Process instances overview',
    'created': '2016-10-05T15:39:40.222+0000',
    'definition': '{ "parameters" :[{"id":"dateRange","name":null,"nameKey":null,"type":"dateRange","value":null,"dependsOn":null}]}'
};

export var reportDefParamRangeInterval = {
    'id': 2006,
    'name': 'Fake Task overview RangeInterval',
    'created': '2016-10-05T15:39:40.222+0000',
    'definition': '{ "parameters" :[{"id":"dateRangeInterval","name":null,"nameKey":null,"type":"dateInterval","value":null,"dependsOn":null}]}'
};

export var reportDefParamProcessDef = {
    'id': 2006,
    'name': 'Fake Task overview ProcessDefinition',
    'created': '2016-10-05T15:39:40.222+0000',
    'definition': '{ "parameters" :[{"id":"processDefinitionId","name":null,"nameKey":null,"type":"processDefinition","value":null,"dependsOn":null}]}'
};

export var reportDefParamProcessDefOptions = [
    {
        'id': 'FakeProcessTest 1:1:1',
        'name': 'Fake Process Test 1 Name ',
        'version': 1
    },
    {
        'id': 'FakeProcessTest 1:2:1',
        'name': 'Fake Process Test 1 Name ',
        'version': 2
    },
    {
        'id': 'FakeProcessTest 2:1:1',
        'name': 'Fake Process Test 2 Name ',
        'version': 1
    },
    {
        'id': 'FakeProcessTest 3:1:1',
        'name': 'Fake Process Test 3 Name ',
        'version': 1
    }
];

export var reportDefParamTask = {
    'id': 2006,
    'name': 'Fake Task service level agreement',
    'created': '2016-10-05T15:39:40.222+0000',
    'definition': '{ "parameters" :[{"id":"taskName","name":null,"nameKey":null,"type":"task","value":null,"dependsOn":"processDefinitionId"}]}'
};

export var reportDefParamTaskOptions = ['Fake task name 1', 'Fake task name 2'];

export var chartProcessDefOverview = {
    'elements': [{
        'id': 'id1585876275153',
        'type': 'table',
        'rows': [
            ['__KEY_REPORTING.DEFAULT-REPORTS.PROCESS-DEFINITION-OVERVIEW.GENERAL-TABLE-TOTAL-PROCESS-DEFINITIONS', '9'],
            ['__KEY_REPORTING.DEFAULT-REPORTS.PROCESS-DEFINITION-OVERVIEW.GENERAL-TABLE-TOTAL-PROCESS-INSTANCES', '41'],
            ['__KEY_REPORTING.DEFAULT-REPORTS.PROCESS-DEFINITION-OVERVIEW.GENERAL-TABLE-ACTIVE-PROCESS-INSTANCES', '3'],
            ['__KEY_REPORTING.DEFAULT-REPORTS.PROCESS-DEFINITION-OVERVIEW.GENERAL-TABLE-COMPLETED-PROCESS-INSTANCES', '38']
        ]
    }, {
        'id': 'id1585876413072',
        'type': 'pieChart',
        'title': 'Total process instances overview',
        'titleKey': 'REPORTING.DEFAULT-REPORTS.PROCESS-DEFINITION-OVERVIEW.PROC-INST-CHART-TITLE',
        'values': [{
            'key': 'Second Process',
            'y': 4,
            'keyAndValue': ['Second Process', '4']
        }, {
            'key': 'Simple process',
            'y': 30,
            'keyAndValue': ['Simple process', '30']
        }, {
            'key': 'Third Process',
            'y': 7,
            'keyAndValue': ['Third Process', '7']
        }]
    }, {
        'id': 'id1585877659181',
        'type': 'table',
        'title': 'Process definition details',
        'titleKey': 'REPORTING.DEFAULT-REPORTS.PROCESS-DEFINITION-OVERVIEW.DETAIL-TABLE',
        'columnNames': ['Process definition', 'Total', 'Active', 'Completed'],
        'columnNameKeys': ['REPORTING.DEFAULT-REPORTS.PROCESS-DEFINITION-OVERVIEW.DETAIL-TABLE-PROCESS',
            'REPORTING.DEFAULT-REPORTS.PROCESS-DEFINITION-OVERVIEW.DETAIL-TABLE-TOTAL',
            'REPORTING.DEFAULT-REPORTS.PROCESS-DEFINITION-OVERVIEW.DETAIL-TABLE-ACTIVE',
            'REPORTING.DEFAULT-REPORTS.PROCESS-DEFINITION-OVERVIEW.DETAIL-TABLE-COMPLETED'],
        'columnsCentered': [false, false, false, false],
        'rows': [
            ['Second Process', '4', '0', '4'],
            ['Simple process', '30', '3', '27'],
            ['Third Process', '7', '0', '7']
        ]
    }]
};

export var chartTaskOverview = {
    'elements': [{
        'id': 'id792351752194',
        'type': 'barChart',
        'title': 'title',
        'titleKey': 'REPORTING.DEFAULT-REPORTS.TASK-OVERVIEW.TASK-HISTOGRAM-TITLE',
        'values': [{
            'key': 'series1',
            'values': [['2016-09-30T00:00:00.000+0000', 3], ['2016-10-04T00:00:00.000+0000', 1]]
        }],
        'xAxisType': 'date_month',
        'yAxisType': 'count'
    }, {
        'id': 'id792349721129',
        'type': 'masterDetailTable',
        'title': 'Detailed task statistics',
        'titleKey': 'REPORTING.DEFAULT-REPORTS.TASK-OVERVIEW.DETAILED-TASK-STATS-TITLE',
        'columnNames': ['Task', 'Count', 'Sum', 'Min duration', 'Max duration', 'Average duration', 'Stddev duration'],
        'columnNameKeys': [
            'REPORTING.DEFAULT-REPORTS.TASK-OVERVIEW.DETAILED-TASK-STATS-TASK',
            'REPORTING.DEFAULT-REPORTS.TASK-OVERVIEW.COUNT',
            'REPORTING.DEFAULT-REPORTS.TASK-OVERVIEW.SUM',
            'REPORTING.DEFAULT-REPORTS.TASK-OVERVIEW.MIN-DURATION',
            'REPORTING.DEFAULT-REPORTS.TASK-OVERVIEW.MAX-DURATION',
            'REPORTING.DEFAULT-REPORTS.TASK-OVERVIEW.AVERAGE',
            'REPORTING.DEFAULT-REPORTS.TASK-OVERVIEW.STDDE'],
        'columnsCentered': [false, false, false, false],
        'rows': [
            ['fake 1 user task', '1', '2.0', '3.0', '4.0', '5.0', '6.0'],
            ['fake 2 user task', '1', '2.0', '3.0', '4.0', '5.0', '6.0']
        ]
    }]
};

export var fieldNumber = new ReportParameterModel(
    {
        id: 'slowProcessInstanceInteger',
        type: 'integer',
        value: '102'
    }
);

export var fieldStatus = new ReportParameterModel(
    {
        id: 'status',
        type: 'status',
        value: 'fake-value'
    }
);

export var fieldTypeFiltering = new ReportParameterModel(
    {
        id: 'typeFiltering',
        type: 'boolean',
        value: false
    }
);

export var fieldTask = new ReportParameterModel(
    {
        id: 'taskName',
        type: 'task',
        value: 'fake-task-name'
    }
);

export var fieldDateRange = {
    startDate: '2016-10-12T00:00:00.000Z',
    endDate: '2016-10-14T00:00:00.000Z'
};

export var fieldDateRangeInterval = new ReportParameterModel(
    {
        id: 'dateRangeInterval',
        type: 'dateInterval',
        value: 'fake-date-interval'
    }
);

export var fieldProcessDef = new ReportParameterModel(
    {
        id: 'processDefinitionId',
        type: 'processDefinition',
        value: 'fake-process-name:1:15027'
    }
);

export var fieldDuration = {value: 30};
