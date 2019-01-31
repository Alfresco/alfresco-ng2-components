/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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
   description?: string;
   initiator?: null;
   id?: string;
   name?: string;
   processDefinitionId?: string;
   processDefinitionKey?: string;
   status?: string;
   startDate?: string;
   businessKey?: string;
   lastModified?: string;
   lastModifiedTo?: string;
   lastModifiedFrom?: string;
   maxItems: number;
   skipCount: number;
   sorting?: ProcessListCloudSortingModel[];
    constructor(obj?: any) {
       if (obj) {
           this.appName = obj.appName;
           this.description = obj.description;
           this.initiator = obj.initiator;
           this.id = obj.id;
           this.name = obj.name;
           this.processDefinitionId = obj.processDefinitionId;
           this.processDefinitionKey = obj.processDefinitionKey;
           this.status = obj.status;
           this.startDate = obj.startDate;
           this.businessKey = obj.businessKey;
           this.lastModified = obj.lastModified;
           this.lastModifiedTo = obj.lastModifiedTo;
           this.lastModifiedFrom = obj.lastModifiedFrom;
           this.maxItems = obj.maxItems;
           this.skipCount = obj.skipCount;
           this.sorting = obj.sorting;
       }
   }
}
