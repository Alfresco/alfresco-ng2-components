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

import { ReportDateRange } from './report-date-range.model';

export class ReportQuery {
    reportName: string;
    processDefinitionId: string;
    status: string;
    taskName: string;
    typeFiltering: boolean;
    dateRange: ReportDateRange;
    dateRangeInterval: string;
    slowProcessInstanceInteger: number;
    duration: number;

    constructor(obj?: any) {
        this.reportName = obj && obj.reportName || null;
        this.processDefinitionId = obj && obj.processDefinitionId || null;
        this.status = obj && obj.status || null;
        this.taskName = obj && obj.taskName || null;
        this.dateRangeInterval = obj && obj.dateRangeInterval || null;
        this.typeFiltering = obj && (typeof obj.typeFiltering !== 'undefined') ? obj.typeFiltering : true;
        this.slowProcessInstanceInteger = obj && obj.slowProcessInstanceInteger || 0;
        this.duration = obj && obj.duration || 0;
        this.dateRange = new ReportDateRange(obj);
    }

}
