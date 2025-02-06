/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { TaskAttachmentListComponent } from './task-attachment-list/task-attachment-list.component';
import { ProcessAttachmentListComponent } from './process-attachment-list/process-attachment-list.component';
import { CreateProcessAttachmentComponent } from './create-process-attachment/create-process-attachment.component';
import { AttachmentComponent } from './create-task-attachment/create-task-attachment.component';

export * from './task-attachment-list/task-attachment-list.component';
export * from './process-attachment-list/process-attachment-list.component';
export * from './create-process-attachment/create-process-attachment.component';
export * from './create-task-attachment/create-task-attachment.component';

export const ATTACHMENT_DIRECTIVES = [
    TaskAttachmentListComponent,
    ProcessAttachmentListComponent,
    CreateProcessAttachmentComponent,
    AttachmentComponent
] as const;
