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

import { TaskListCloudSortingModel } from './task-list-sorting.model';

// export abstract class TaskQueryCloudRequestModel {
//     appName: string;
//     appVersion?: string;
//     id?: string;
//     status?: string;
//     maxItems: number;
//     skipCount: number;
//     sorting?: TaskListCloudSortingModel[];

//     constructor(obj?: any) {
//         if (obj) {
//             this.appName = obj.appName;
//             this.appVersion = obj.appVersion;
//             this.id = obj.id;
//             this.status = obj.status;
//             this.maxItems = obj.maxItems;
//             this.skipCount = obj.skipCount;
//             this.sorting = obj.sorting;
//         }
//     }
// }

// export class UserTaskQueryCloudRequestModel extends TaskQueryCloudRequestModel {
//     assignee?: string;
//     claimedDate?: string;
//     createdDate?: Date;
//     description?: string;
//     dueDate?: null;
//     lastModifiedFrom?: null;
//     lastModifiedTo?: null;
//     name?: string;
//     owner?: string;
//     parentTaskId?: string;
//     standalone?: boolean;
//     priority?: number;
//     processDefinitionId?: string;
//     processInstanceId?: string;

//     constructor(obj?: any) {
//         super(obj);
//         if (obj) {
//             this.assignee = obj.assignee;
//             this.claimedDate = obj.claimedDate;
//             this.createdDate = obj.createdDate;
//             this.description = obj.description;
//             this.dueDate = obj.dueDate;
//             this.lastModifiedFrom = obj.lastModifiedFrom;
//             this.lastModifiedTo = obj.lastModifiedTo;
//             this.name = obj.name;
//             this.owner = obj.owner;
//             this.parentTaskId = obj.parentTaskId;
//             this.standalone = obj.standalone;
//             this.priority = obj.priority;
//             this.processDefinitionId = obj.processDefinitionId;
//             this.processInstanceId = obj.processInstanceId;
//         }
//     }
// }
