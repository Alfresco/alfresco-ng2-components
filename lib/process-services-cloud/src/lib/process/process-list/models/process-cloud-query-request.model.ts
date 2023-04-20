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

import { ProcessListCloudSortingModel } from './process-list-sorting.model';

export class ProcessQueryCloudRequestModel {
   appName: string;
   appVersion?: number | string;
   initiator?: null;
   id?: string;
   environmentId?: string;
   name?: string;
   processDefinitionId?: string;
   processDefinitionName?: string;
   processDefinitionKey?: string;
   status?: string;
   startDate?: string;
   businessKey?: string;
   lastModified?: string;
   lastModifiedTo?: string;
   lastModifiedFrom?: string;
   startFrom?: string;
   startTo?: string;
   completedFrom?: string;
   completedTo?: string;
   suspendedFrom?: string;
   suspendedTo?: string;
   completedDate?: string;
   maxItems: number;
   skipCount: number;
   sorting?: ProcessListCloudSortingModel[];
   variableKeys?: string[];

    constructor(obj?: any) {
       if (obj) {
           this.appName = obj.appName;
           this.appVersion = obj.appVersion;
           this.initiator = obj.initiator;
           this.id = obj.id;
           this.environmentId = obj.environmentId;
           this.name = obj.name;
           this.processDefinitionId = obj.processDefinitionId;
           this.processDefinitionName = obj.processDefinitionName;
           this.processDefinitionKey = obj.processDefinitionKey;
           this.status = obj.status;
           this.startDate = obj.startDate;
           this.businessKey = obj.businessKey;
           this.lastModified = obj.lastModified;
           this.lastModifiedTo = obj.lastModifiedTo;
           this.lastModifiedFrom = obj.lastModifiedFrom;
           this.startFrom = obj.startFrom;
           this.startTo = obj.startTo;
           this.completedFrom = obj.completedFrom;
           this.completedTo = obj.completedTo;
           this.suspendedFrom = obj.suspendedFrom;
           this.suspendedTo = obj.suspendedTo;
           this.completedDate = obj.completedDate;
           this.maxItems = obj.maxItems;
           this.skipCount = obj.skipCount;
           this.sorting = obj.sorting;
           this.variableKeys = obj.variableKeys;
       }
   }
}
