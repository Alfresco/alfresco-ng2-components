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

import { Ng2ActivitiProcesslistComponent } from './src/components/ng2-activiti-processlist.component';
import { ActivitiProcessService } from './src/services/activiti-process-service.service';

// components
export * from './src/components/ng2-activiti-processlist.component';

// services
export * from './src/services/activiti-process-service.service';

export const ACTIVITI_PROCESSLIST_DIRECTIVES: [any] = [
    Ng2ActivitiProcesslistComponent
];

export const ACTIVITI_PROCESSLIST_PROVIDERS: [any] = [
    ActivitiProcessService
];
