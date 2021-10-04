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

import { TaskDetailsCloudModel } from '@alfresco/adf-process-services-cloud';

export const taskAssignedDetails: TaskDetailsCloudModel = {
  appName: 'simple-app',
  assignee: 'admin.adf',
  completedDate: null,
  createdDate: new Date(1555419255340),
  dueDate: new Date(1558419255340),
  description: null,
  formKey: null,
  priority: 1,
  parentTaskId: 'bd6b1741-6046-11e9-80f0-0a586460040d',
  id: 'bd6b1741-6046-11e9-80f0-0a586460040d',
  name: 'Task1',
  owner: 'admin.adf',
  standalone: true,
  status: 'ASSIGNED'
};

const taskCompletedDetails: TaskDetailsCloudModel = {
  ...taskAssignedDetails,
  status: 'COMPLETED'
};

export const tasksDetailsContainer = {
  taskAssigned: taskAssignedDetails,
  taskCompleted: taskCompletedDetails
};
